import { useState, useEffect } from 'react';
import { Settings, MapPin, Link as LinkIcon, Calendar, Loader2 } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useUIStore } from '../stores/uiStore';

interface UserProfile {
  id: string;
  alias: string;
  email: string;
  name: string;
  bio: string;
  createdAt: string;
}

export default function Profile() {
  const { token } = useAuthStore();
  const { showToast } = useUIStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const res = await fetch('https://idkfree.onrender.com/api/social/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-blue" size={32} /></div>;
  if (!profile) return <div className="text-center py-20 text-gray-500 font-mono">No se pudo cargar el perfil.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
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
    </div>
  );
}
