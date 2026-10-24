import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuthStore } from '../stores/authStore';
import './EditProfile.css';

export function EditProfile() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [accountType, setAccountType] = useState('personal');
  const [category, setCategory] = useState('');
  const [links, setLinks] = useState<{title: string, url: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      if (!user) return;
      try {
        const res = await api.profile.get(user.alias);
        setName(res.user.name ?? '');
        setBio(res.user.bio ?? '');
        setAccountType(res.user.account_type ?? 'personal');
        setCategory(res.user.category ?? '');
        if (res.user.links) {
          try { setLinks(JSON.parse(res.user.links)); } catch {}
        }
      } catch (err) { console.error(err); }
      setLoading(false);
    }
    load();
  }, [user?.alias]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const validLinks = links.filter(l => l.title.trim() && l.url.trim());
      await api.profile.update({
        name: name.trim() || null,
        bio: bio.trim() || null,
        account_type: accountType,
        category: accountType === 'personal' ? null : category.trim(),
        links: validLinks.length > 0 ? JSON.stringify(validLinks) : null,
      });
      navigate(`/u/${user?.alias}`);
    } catch (err: any) {
      alert('Error al guardar: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  function updateLink(index: number, key: 'title' | 'url', value: string) {
    const newLinks = [...links];
    if (!newLinks[index]) newLinks[index] = { title: '', url: '' };
    newLinks[index][key] = value;
    setLinks(newLinks);
  }

  if (loading) return <div style={{ padding: 40, color: 'white' }}>Cargando...</div>;

  return (
    <>
      <div className="edit-profile-container">
        <h1>Editar Perfil</h1>
        <form onSubmit={handleSave} className="edit-form">
          
          <label>TIPO DE CUENTA</label>
          <div className="account-types">
            {['personal', 'creator', 'business'].map(type => (
              <button 
                type="button" 
                key={type}
                className={accountType === type ? 'active' : ''}
                onClick={() => setAccountType(type)}
              >
                {type === 'business' ? 'Empresa' : type === 'creator' ? 'Creador' : 'Personal'}
              </button>
            ))}
          </div>

          {accountType !== 'personal' && (
            <div className="form-group">
              <label>CATEGORÍA</label>
              <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Ej: Música, Tech, Arte" />
            </div>
          )}

          <div className="form-group">
            <label>NOMBRE</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" />
          </div>

          <div className="form-group">
            <label>BIO</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Cuéntale algo al mundo" maxLength={160} />
          </div>

          <label>ENLACES (Máximo 3)</label>
          {[0, 1, 2].map(index => (
            <div key={index} className="link-row">
              <input value={links[index]?.title || ''} onChange={e => updateLink(index, 'title', e.target.value)} placeholder="Título (ej. GitHub)" />
              <input value={links[index]?.url || ''} onChange={e => updateLink(index, 'url', e.target.value)} placeholder="https://..." />
            </div>
          ))}

          <button type="submit" className="save-btn" disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>
    </>
  );
}
