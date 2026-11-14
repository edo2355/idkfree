import { useState } from 'react';
import { Settings, MapPin, Link as LinkIcon, Calendar } from 'lucide-react';
import { useUIStore } from '../stores/uiStore';
import { useAuthStore } from '../stores/authStore';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('posts');
  const { showToast } = useUIStore();
  const { user } = useAuthStore();

  const renderContent = () => {
    if (activeTab === 'posts') {
      return (
        <div className="grid grid-cols-3 gap-2">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="aspect-square bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border hover:border-brand-blue transition-colors cursor-pointer flex items-center justify-center">
              <span className="text-gray-400 text-xs font-mono">POST #{i}</span>
            </div>
          ))}
        </div>
      );
    }
    if (activeTab === 'reels') return <div className="text-center py-12 text-gray-500 font-mono">AÚN NO HAY REELS PUBLICADOS.</div>;
    if (activeTab === 'vibes') return <div className="text-center py-12 text-gray-500 font-mono">AÚN NO HAY VIBES PUBLICADOS.</div>;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border rounded-lg overflow-hidden transition-colors">
        <div className="h-32 bg-gradient-to-r from-brand-blue/40 to-gray-100 dark:to-[#0a0a0a] w-full"></div>
        <div className="p-6 relative">
          <div className="absolute -top-12 left-6 w-24 h-24 bg-white dark:bg-[#050505] border-4 border-white dark:border-brand-panel rounded-full flex items-center justify-center text-3xl font-bold text-brand-blue shadow-lg">
            {user?.alias?.charAt(0).toUpperCase() || 'E'}
          </div>
          <div className="flex justify-end mb-4">
            <button onClick={() => showToast('Editor de perfil en desarrollo', 'info')} className="border border-gray-300 dark:border-brand-border text-gray-900 dark:text-white px-4 py-2 rounded text-xs font-mono hover:bg-gray-100 dark:hover:bg-brand-border transition-colors flex items-center gap-2">
              <Settings size={14} /> EDITAR PERFIL
            </button>
          </div>
          <div className="mt-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.alias || 'Eduardo Amate'}</h1>
            <p className="text-brand-blue font-mono text-sm mb-4">@{user?.alias || 'edo_creator'}</p>
            <p className="text-gray-700 dark:text-gray-300 text-sm max-w-lg mb-4">Construyendo el futuro de la libertad digital desde Cuba. Fundador de IDKfree.OS.</p>
            <div className="flex flex-wrap gap-4 text-xs text-gray-500 font-mono">
              <span className="flex items-center gap-1"><MapPin size={14} /> La Habana, Cuba</span>
              <span className="flex items-center gap-1"><LinkIcon size={14} /> idkfreegetid.dpdns.org</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> Nov 2026</span>
            </div>
          </div>
          <div className="flex gap-6 mt-6 border-t border-gray-200 dark:border-brand-border pt-4 text-sm">
            <span className="text-gray-500"><strong className="text-gray-900 dark:text-white">12</strong> Posts</span>
            <span className="text-gray-500"><strong className="text-gray-900 dark:text-white">1.2K</strong> Seguidores</span>
            <span className="text-gray-500"><strong className="text-gray-900 dark:text-white">45</strong> Siguiendo</span>
          </div>
        </div>
      </div>
      
      {/* Tabs Interactivos */}
      <div className="flex border-b border-gray-200 dark:border-brand-border">
        <button onClick={() => setActiveTab('posts')} className={`px-6 py-3 text-sm font-mono border-b-2 transition-colors ${activeTab === 'posts' ? 'text-brand-blue border-brand-blue' : 'text-gray-500 border-transparent hover:text-gray-900 dark:hover:text-white'}`}>PUBLICACIONES</button>
        <button onClick={() => setActiveTab('reels')} className={`px-6 py-3 text-sm font-mono border-b-2 transition-colors ${activeTab === 'reels' ? 'text-brand-blue border-brand-blue' : 'text-gray-500 border-transparent hover:text-gray-900 dark:hover:text-white'}`}>REELS</button>
        <button onClick={() => setActiveTab('vibes')} className={`px-6 py-3 text-sm font-mono border-b-2 transition-colors ${activeTab === 'vibes' ? 'text-brand-blue border-brand-blue' : 'text-gray-500 border-transparent hover:text-gray-900 dark:hover:text-white'}`}>VIBES</button>
      </div>
      
      {renderContent()}
    </div>
  );
}
