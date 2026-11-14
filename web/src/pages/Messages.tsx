import { useState } from 'react';
import { Search, Send } from 'lucide-react';
import { useDataStore } from '../stores/dataStore';

export default function Messages() {
  const [input, setInput] = useState('');
  const { messages, addMessage } = useDataStore();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    addMessage(input, 'Yo');
    setInput('');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex border border-gray-200 dark:border-brand-border rounded-lg overflow-hidden bg-white dark:bg-brand-panel">
      <div className="w-1/3 border-r border-gray-200 dark:border-brand-border flex flex-col hidden md:flex">
        <div className="p-4 border-b border-gray-200 dark:border-brand-border"><h2 className="text-gray-900 dark:text-white font-bold font-mono">CHATS</h2></div>
        <div className="p-2"><div className="flex items-center bg-gray-100 dark:bg-[#000] border border-gray-300 dark:border-brand-border rounded px-2 py-1"><Search size={14} className="text-gray-500 mr-2" /><input type="text" placeholder="Buscar..." className="bg-transparent outline-none text-xs text-gray-900 dark:text-white w-full" /></div></div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 dark:border-brand-border bg-gray-50 dark:bg-brand-border/30 border-l-2 border-l-brand-blue cursor-pointer">
            <h3 className="text-gray-900 dark:text-white font-bold text-sm">Creador_1</h3>
            <p className="text-xs text-gray-500 truncate">Hola, ¿cómo va el proyecto?</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-[#050505]">
        <div className="p-4 border-b border-gray-200 dark:border-brand-border flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-blue/20 border border-brand-blue rounded-full flex items-center justify-center text-xs font-bold text-brand-blue">C</div>
          <h3 className="text-gray-900 dark:text-white font-bold text-sm">Creador_1</h3>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'Yo' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-lg max-w-[80%] ${msg.sender === 'Yo' ? 'bg-brand-blue text-white rounded-tr-none' : 'bg-white dark:bg-brand-panel border border-gray-200 dark:border-brand-border text-gray-700 dark:text-gray-300 rounded-tl-none'}`}>
                <p className="text-sm">{msg.text}</p>
                <span className="text-[10px] opacity-50 block mt-1 text-right">{msg.time}</span>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="p-4 border-t border-gray-200 dark:border-brand-border">
          <div className="flex items-center bg-white dark:bg-brand-panel border border-gray-300 dark:border-brand-border rounded-full px-4 py-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escribe un mensaje..." className="bg-transparent outline-none text-sm text-gray-900 dark:text-white w-full" />
            <button type="submit" className="text-brand-blue hover:text-blue-400"><Send size={18} /></button>
          </div>
        </form>
      </div>
    </div>
  );
}
