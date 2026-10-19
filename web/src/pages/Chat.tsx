import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import './Chat.css';

export function Chat() {
  const { userId } = useParams();
  const me = useAuthStore((s) => s.user);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadMessages = async () => {
    if (!userId) return;
    try {
      const res = await api.messages.conversation(userId);
      setMessages(res.messages || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
    // Polling básico cada 3 segundos
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !userId) return;

    const msgText = text;
    setText('');
    
    // Optimistic UI
    const tempMsg = { id: Date.now().toString(), sender_id: me?.id, body: msgText, created_at: new Date().toISOString() };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      await api.messages.send(userId, msgText);
      loadMessages();
    } catch (err) {
      console.error('Error enviando mensaje', err);
    }
  }

  return (
    <div className="chat-window">
      <header className="chat-window-header">
        <Link to="/chats" className="chat-back-btn">←</Link>
        <div className="chat-window-title">Chat</div>
      </header>

      <div className="chat-messages-area">
        {loading ? (
          <div className="chat-loading">Cargando mensajes...</div>
        ) : messages.length === 0 ? (
          <div className="chat-loading">Di hola 👋</div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === me?.id || msg.sender_id === 'me';
            return (
              <div key={msg.id} className={`msg-bubble-wrapper ${isMe ? 'right' : 'left'}`}>
                <div className={`msg-bubble ${isMe ? 'msg-me' : 'msg-them'}`}>
                  {msg.body}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="chat-input-area">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="chat-input"
        />
        <button type="submit" className="chat-send-btn">Enviar</button>
      </form>
    </div>
  );
}
