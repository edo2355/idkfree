import { useEffect, useState } from 'react';
import { api } from '../api/client';
import './NotesRow.css';

const MOODS: Record<string, string> = {
  silencio: '[MUTE]', charlar: '[CHAT]', crear: '[ART]', tranquilo: '[WAVE]', nose: '[?]',
};

export function NotesRow() {
  const [vibes, setVibes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.vibes.list({ limit: 20 });
        setVibes(res.vibes ?? []);
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="notes-loading">Cargando notas...</div>;

  return (
    <div className="notes-container">
      {/* Botón de Añadir */}
      <div className="note-bubble-wrapper" onClick={() => alert('Próximamente: Crear nota')}>
        <div className="note-bubble add-bubble">
          <span className="note-add-icon">+</span>
        </div>
        <span className="note-alias" style={{ color: 'var(--accent)' }}>Añadir</span>
      </div>

      {/* Lista de Notas */}
      {vibes.map((v) => (
        <div key={v.id} className="note-bubble-wrapper">
          <div className="note-bubble">
            <span className="note-emoji">{MOODS[v.mood] ?? '[•]'}</span>
            {v.message && <span className="note-text">{v.message}</span>}
          </div>
          <div className="note-tail"></div>
          <span className="note-alias">@{v.author_alias}</span>
        </div>
      ))}
    </div>
  );
}
