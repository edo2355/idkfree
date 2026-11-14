import { Search, Send } from 'lucide-react';

export default function Messages() {
  return (
    <div className="h-[calc(100vh-8rem)] flex border border-brand-border rounded-lg overflow-hidden bg-brand-panel animate-in fade-in duration-500">
      
      {/* Lista de Chats */}
      <div className="w-1/3 border-r border-brand-border flex flex-col hidden md:flex">
        <div className="p-4 border-b border-brand-border">
          <h2 className="text-white font-bold font-mono">MENSAJES</h2>
        </div>
        <div className="p-2">
          <div className="flex items-center bg-[#000] border border-brand-border rounded px-2 py-1">
            <Search size={14} className="text-gray-500 mr-2" />
            <input type="text" placeholder="Buscar..." className="bg-transparent border-none outline-none text-xs text-white w-full" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {[1,2,3].map((i) => (
            <div key={i} className={`p-4 border-b border-brand-border cursor-pointer hover:bg-brand-border/30 transition-colors ${i === 1 ? 'bg-brand-border/50 border-l-2 border-l-brand-blue' : ''}`}>
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-white font-bold text-sm">Creador_{i}</h3>
                <span className="text-[10px] text-gray-500 font-mono">12:30</span>
              </div>
              <p className="text-xs text-gray-400 truncate">Hola, ¿cómo va el proyecto?</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ventana de Chat */}
      <div className="flex-1 flex flex-col bg-[#050505]">
        <div className="p-4 border-b border-brand-border flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-blue/20 border border-brand-blue rounded-full flex items-center justify-center text-xs font-bold text-brand-blue">C</div>
          <h3 className="text-white font-bold text-sm">Creador_1</h3>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          <div className="flex justify-start">
            <div className="bg-brand-panel border border-brand-border p-3 rounded-lg rounded-tl-none max-w-[80%]">
              <p className="text-sm text-gray-300">Hola, ¿cómo va el proyecto?</p>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-brand-blue p-3 rounded-lg rounded-tr-none max-w-[80%]">
              <p className="text-sm text-white">¡Todo marcha perfecto! Ya estamos en producción.</p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-brand-border">
          <div className="flex items-center bg-brand-panel border border-brand-border rounded-full px-4 py-2">
            <input type="text" placeholder="Escribe un mensaje..." className="bg-transparent border-none outline-none text-sm text-white w-full" />
            <button className="text-brand-blue hover:text-white transition-colors"><Send size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
