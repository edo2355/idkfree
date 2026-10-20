import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import { Layout } from '../components/Layout';
import './Chat.css';

export function Chat() {
  const { userId: alias } = useParams();
  const me = useAuthStore((s) => s.user);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  async function loadMessages() {
    if (!alias) return;
    try {
      const res = await api.messages.conversation(alias);
      setMessages(res.messages || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000); // Polling cada 3 seg
    return () => clearInterval(interval);
  }, [alias]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !alias) return;
    
    const msg = text;
    setText('');
    try {
      await api.messages.send(alias, msg);
      loadMessages();
    } catch (err) {
      alert('Error al enviar');
    }
  }

  return (
    <Layout>
      <div className="chat-window">
        <div className="chat-window-header">
          <Link to="/chats" className="back-btn">←</Link>
          <span>@{alias}</span>
        </div>
        <div className="chat-messages">
          {loading ? (
             <div className="chat-status">Cargando...</div>
          ) : (
            messages.map((m) => {
              const isMe = m.sender_id === me?.id;
              return (
                <div key={m.id} className={`msg-row ${isMe ? 'me' : 'them'}`}>
                  <div className={`msg-bubble ${isMe ? 'bubble-me' : 'bubble-them'}`}>
                    {m.body}
                  </div>
                </div>
              );
            })
          )}
          <div ref={endRef} />
        </div>
        <form onSubmit={handleSend} className="chat-input-area">
          <input 
            type="text" 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            placeholder="Escribe un mensaje..."
          />
          <button type="submit">Enviar</button>
        </form>
      </div>
    </Layout>
  );
}
