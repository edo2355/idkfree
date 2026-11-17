import { X, Copy, MessageCircle, Send, Twitter, Facebook, Check } from 'lucide-react';
import { useState } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventUrl: string;
  eventName: string;
}

export default function ShareModal({ isOpen, onClose, eventUrl, eventName }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(eventUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = encodeURIComponent(`¡Mira este evento en IDKMEDIA: ${eventName}!`);
  const encodedUrl = encodeURIComponent(eventUrl);

  const shareLinks = [
    { name: 'WhatsApp', icon: MessageCircle, color: 'bg-green-500', url: `https://wa.me/?text=${shareText}%20${encodedUrl}` },
    { name: 'Telegram', icon: Send, color: 'bg-blue-500', url: `https://t.me/share/url?url=${encodedUrl}&text=${shareText}` },
    { name: 'Twitter / X', icon: Twitter, color: 'bg-black', url: `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}` },
    { name: 'Facebook', icon: Facebook, color: 'bg-blue-700', url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white z-10"><X size={20} /></button>

        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white font-mono mb-4">Compartir Evento</h2>
          
          <div className="grid grid-cols-4 gap-3 mb-6">
            {shareLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group"
              >
                <div className={`w-14 h-14 rounded-2xl ${link.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg`}>
                  <link.icon size={24} />
                </div>
                <span className="text-[10px] font-mono text-gray-500 text-center">{link.name}</span>
              </a>
            ))}
          </div>

          <div className="border-t border-gray-200 dark:border-brand-border pt-4">
            <p className="text-xs font-mono text-gray-500 mb-2 uppercase">O copia el enlace</p>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#111] rounded-lg p-2 border border-gray-200 dark:border-[#222]">
              <span className="text-xs font-mono text-gray-600 dark:text-gray-400 truncate flex-1">{eventUrl}</span>
              <button onClick={handleCopy} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-1 ${copied ? 'bg-green-500 text-white' : 'bg-brand-blue text-white hover:bg-blue-600'}`}>
                {copied ? <><Check size={12}/> Copiado</> : <><Copy size={12}/> Copiar</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
