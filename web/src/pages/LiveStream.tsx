import { useState } from 'react';
import { Radio, Send, MessageCircle } from 'lucide-react';
import SocialEmbed from '../components/SocialEmbed';
import { useUIStore } from '../stores/uiStore';

export default function LiveStream() {
  const { showToast } = useUIStore();
  const [streamUrl, setStreamUrl] = useState('https://www.youtube.com/watch?v=jfKfPfyJRdk'); // Enlace de prueba (Lofi Girl)
  const [inputUrl, setInputUrl] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  
  // Simulación de chat
  const [chat, setChat] = useState([
    { user: 'fan_1', msg: '¡Qué buena transmisión! 🔥' },
    { user: 'creator_pro', msg: 'Saludos desde La Habana 🇨🇺' },
  ]);

  const handleUpdateStream = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl) return;
    setStreamUrl(inputUrl);
    setInputUrl('');
    showToast('Transmisión actualizada', 'success');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage) return;
    setChat([...chat, { user: 'Yo', msg: chatMessage }]);
    setChatMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 dark:border-brand-border pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-mono tracking-tight flex items-center gap-3">
            <Radio size={28} className="text-red-500 animate-pulse" />
            LIVE_STREAM
          </h1>
          <p className="text-gray-500 text-sm mt-1">Transmisión en vivo y chat de la comunidad.</p>
        </div>
        
        {/* Formulario para cambiar el enlace del stream */}
        <form onSubmit={handleUpdateStream} className="flex w-full md:w-auto gap-2">
          <input 
            type="text" 
            value={inputUrl} 
            onChange={e => setInputUrl(e.target.value)}
            placeholder="Pega un enlace de YouTube o Twitch..." 
            className="bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border px-4 py-2 rounded-lg text-sm w-full md:w-80 text-gray-900 dark:text-white outline-none focus:border-brand-blue"
          />
          <button type="submit" className="bg-brand-blue text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors">
            Cargar
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Reproductor de Video */}
        <div className="lg:col-span-2 space-y-4">
          <SocialEmbed url={streamUrl} />
          <div className="flex justify-between items-center bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border p-4 rounded-lg">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">IDKMedia Underground Fest</h2>
              <p className="text-xs text-gray-500 font-mono">Transmitiendo en vivo desde La Habana</p>
            </div>
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded animate-pulse">EN VIVO</span>
          </div>
        </div>

        {/* Chat Lateral */}
        <div className="bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border rounded-lg flex flex-col h-[500px]">
          <div className="p-4 border-b border-gray-200 dark:border-brand-border flex items-center gap-2">
            <MessageCircle size={18} className="text-brand-blue" />
            <h2 className="text-sm font-mono text-gray-900 dark:text-white font-bold uppercase">Chat en Vivo</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chat.map((msg, i) => (
              <div key={i} className="text-sm">
                <span className="font-bold text-brand-blue mr-2">@{msg.user}</span>
                <span className="text-gray-700 dark:text-gray-300">{msg.msg}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="p-4 border-t border-gray-200 dark:border-brand-border">
            <div className="flex items-center bg-gray-100 dark:bg-[#000] border border-gray-200 dark:border-brand-border rounded-full px-4 py-2">
              <input 
                type="text" 
                value={chatMessage}
                onChange={e => setChatMessage(e.target.value)}
                placeholder="Escribe algo..." 
                className="bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white w-full" 
              />
              <button type="submit" className="text-brand-blue hover:text-blue-400">
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
