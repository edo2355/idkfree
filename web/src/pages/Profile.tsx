import { useState, useEffect } from 'react';
import { Settings, MapPin, Link as LinkIcon, Calendar, Loader2, Send, CheckCircle2, Unlink, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';
import { useModal } from '../contexts/ModalContext';

interface UserProfile {
  id: string;
  alias: string;
  email: string;
  name: string;
  bio: string;
  createdAt: string;
  telegram_chat_id?: string;
}

export default function Profile() {
  const { token, user } = useAuthStore();
  const { showToast } = useUIStore();
  const { openModal } = useModal();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [telegramLinked, setTelegramLinked] = useState(false);
  const [linkingTelegram, setLinkingTelegram] = useState(false);

  // ⚠️ CAMBIA ESTO POR EL NOMBRE DE TU BOT
  const TELEGRAM_BOT_USERNAME = 'IDKMEDIA_Oficial_bot'; 

  const fetchProfile = async () => {
    if (!token) return;
    try {
      const res = await fetch('https://idkfree.onrender.com/api/social/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setTelegramLinked(!!data.telegram_chat_id);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const handleLinkTelegram = () => {
    if (!profile) return;
    // Abrimos Telegram con el ID del usuario en el parámetro start
    const url = `https://t.me/${TELEGRAM_BOT_USERNAME}?start=${profile.id}`;
    window.open(url, '_blank');
    setLinkingTelegram(true);
    showToast('Ve a Telegram y presiona "Start" para vincular', 'info');
    
    // Polling para verificar si se vinculó (revisa cada 3 segundos por 1 minuto)
    let attempts = 0;
    const interval = setInterval(async () => {
      attempts++;
      const res = await fetch('https://idkfree.onrender.com/api/telegram/status', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.linked) {
          setTelegramLinked(true);
          setLinkingTelegram(false);
          showToast('¡Telegram vinculado exitosamente!', 'success');
          clearInterval(interval);
        }
      }
      if (attempts > 20) { // 1 minuto
        clearInterval(interval);
        setLinkingTelegram(false);
      }
    }, 3000);
  };

  const handleUnlinkTelegram = () => {
    openModal({
      title: 'Desvincular Telegram',
      content: '¿Estás seguro? Dejarás de recibir notificaciones por Telegram.',
      variant: 'warning',
      confirmText: 'Sí, desvincular',
      onConfirm: async () => {
        try {
          const res = await fetch('https://idkfree.onrender.com/api/telegram/unlink', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            setTelegramLinked(false);
            showToast('Telegram desvinculado', 'success');
          }
        } catch (error) {
          showToast('Error al desvincular', 'error');
        }
      }
    });
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-blue" size={32} /></div>;
  if (!profile) return <div className="text-center py-20 text-gray-500 font-mono">No se pudo cargar el perfil.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Cabecera del Perfil */}
      <div className="bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border rounded-lg overflow-hidden transition-colors">
        <div className="h-32 bg-gradient-to-r from-brand-blue/40 to-gray-100 dark:to-[#0a0a0a] w-full"></div>
        <div className="p-6 relative">
          <div className="absolute -top-12 left-6 w-24 h-24 bg-white dark:bg-[#050505] border-4 border-white dark:border-brand-panel rounded-full flex items-center justify-center text-3xl font-bold text-brand-blue shadow-lg">
            {profile.alias?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex justify-end mb-4">
            <button onClick={() => showToast('Editor de perfil en desarrollo', 'info')} className="border border-gray-300 dark:border-brand-border text-gray-900 dark:text-white px-4 py-2 rounded text-xs font-mono hover:bg-gray-100 dark:hover:bg-brand-border transition-colors flex items-center gap-2">
              <Settings size={14} /> EDITAR PERFIL
            </button>
          </div>
          <div className="mt-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.name || profile.alias}</h1>
            <p className="text-brand-blue font-mono text-sm mb-4">@{profile.alias}</p>
            <p className="text-gray-700 dark:text-gray-300 text-sm max-w-lg mb-4">{profile.bio || 'Sin biografía aún.'}</p>
            <div className="flex flex-wrap gap-4 text-xs text-gray-500 font-mono">
              <span className="flex items-center gap-1"><MapPin size={14} /> La Habana, Cuba</span>
              <span className="flex items-center gap-1"><LinkIcon size={14} /> idkfreegetid.dpdns.org</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> Se unió en {new Date(profile.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex gap-6 mt-6 border-t border-gray-200 dark:border-brand-border pt-4 text-sm">
            <span className="text-gray-500"><strong className="text-gray-900 dark:text-white">0</strong> Posts</span>
            <span className="text-gray-500"><strong className="text-gray-900 dark:text-white">0</strong> Seguidores</span>
            <span className="text-gray-500"><strong className="text-gray-900 dark:text-white">0</strong> Siguiendo</span>
          </div>
        </div>
      </div>

      {/* SECCIÓN DE INTEGRACIONES / TELEGRAM */}
      <div className="bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border rounded-lg p-6 transition-colors">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white font-mono mb-4 flex items-center gap-2">
          <LinkIcon size={18} className="text-brand-blue" /> Integraciones
        </h2>
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1a1a1a] rounded-xl gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
              <Send size={24} className="text-blue-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Bot de Telegram</h3>
              <p className="text-xs text-gray-500">
                {telegramLinked 
                  ? 'Tu cuenta está vinculada. Recibirás notificaciones de ventas y eventos.' 
                  : 'Vincula tu cuenta para recibir notificaciones instantáneas por Telegram.'}
              </p>
            </div>
          </div>

          {telegramLinked ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-green-500 flex items-center gap-1 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                <CheckCircle2 size={14} /> VINCULADO
              </span>
              <button onClick={handleUnlinkTelegram} className="text-red-500 hover:text-red-400 p-2 rounded-full hover:bg-red-500/10 transition-colors" title="Desvincular">
                <Unlink size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={handleLinkTelegram} 
              disabled={linkingTelegram}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold font-mono text-xs px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {linkingTelegram ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
              {linkingTelegram ? 'ESPERANDO EN TELEGRAM...' : 'VINCULAR TELEGRAM'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
