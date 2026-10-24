import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { resolveAssetUrl } from '../utils/assetUrl';
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
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      <div className="chats-container">
        <div className="chats-header">
          <h1>Mensajes</h1>
        </div>
        <div className="chats-list">
          {loading ? (
            <div className="chats-status">Cargando chats...</div>
          ) : conversations.length === 0 ? (
            <div className="chats-status">No tienes conversaciones aún.</div>
          ) : (
            conversations.map((c) => (
              <Link to={`/chat/${c.other_alias}`} key={c.other_id} className="chat-row">
                <img 
                  src={c.other_avatar ? resolveAssetUrl(c.other_avatar) : `https://ui-avatars.com/api/?name=${c.other_alias}&background=1A1A1A&color=A855F7`} 
                  alt={c.other_alias} 
                  className="chat-avatar" 
                />
                <div className="chat-info">
                  <div className="chat-name-row">
                    <span className="chat-name">{c.other_name || c.other_alias}</span>
                  </div>
                  <span className="chat-last-msg">{c.last_message}</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}
