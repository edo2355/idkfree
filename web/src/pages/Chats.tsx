import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { resolveAssetUrl } from '../utils/assetUrl';
import { ScreenBackground } from '../components/ScreenBackground';
import './Chats.css';

export function Chats() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.messages.conversations();
        setConversations(res.conversations || []);
      } catch (err) {
        console.error('Error cargando chats', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="chats-container">
      <ScreenBackground variant="neural" opacity={0.05} />
      
      <header className="chats-header">
        <h1>Mensajes</h1>
      </header>

      <div className="chats-list">
        {loading ? (
          <div className="chats-empty">Cargando conversaciones...</div>
        ) : conversations.length === 0 ? (
          <div className="chats-empty">Aún no tienes mensajes. ¡Ve a buscar amigos!</div>
        ) : (
          conversations.map((c) => (
            <Link to={`/chat/${c.user_id}`} key={c.user_id} className="chat-item">
              <img 
                src={c.avatar ? resolveAssetUrl(c.avatar) : `https://ui-avatars.com/api/?name=${c.alias}&background=1A1A1A&color=0891B2`} 
                alt={c.alias} 
                className="chat-avatar" 
              />
              <div className="chat-info">
                <div className="chat-name-row">
                  <span className="chat-name">{c.name || c.alias}</span>
                  <span className="chat-time">{new Date(c.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <span className="chat-last-msg">{c.last_message}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
