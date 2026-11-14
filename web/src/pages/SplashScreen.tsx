import { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState('INITIALIZING...');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500); // Espera medio segundo al llegar a 100 y entra
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5; // Avanza aleatoriamente
      });
    }, 150);

    const messages = [
      'CONNECTING TO OFF-GRID NETWORK...',
      'BYPASSING RESTRICTIONS...',
      'VERIFYING ENCRYPTION KEYS...',
      'LOADING IDENTITY MODULES...',
      'SYSTEM READY.'
    ];
    
    let msgIndex = 0;
    const textInterval = setInterval(() => {
      setText(messages[msgIndex]);
      msgIndex = (msgIndex + 1) % messages.length;
    }, 600);

    return () => {
      clearInterval(interval);
      clearInterval(textInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#050505] flex flex-col items-center justify-center font-mono z-[9999]">
      
      {/* Cruz de calibración (Esquinas) */}
      <div className="absolute top-10 left-10 w-4 h-4 border-t border-l border-orange-500"></div>
      <div className="absolute top-10 right-10 w-4 h-4 border-t border-r border-orange-500"></div>
      <div className="absolute bottom-10 left-10 w-4 h-4 border-b border-l border-orange-500"></div>
      <div className="absolute bottom-10 right-10 w-4 h-4 border-b border-r border-orange-500"></div>

      <div className="w-full max-w-md px-6">
        {/* Logo / Título */}
        <div className="flex items-center gap-3 mb-12 justify-center">
          <div className="w-8 h-8 bg-orange-500 flex items-center justify-center">
            <span className="text-black font-bold text-xl">I</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-[0.2em]">IDKFREE.OS</h1>
        </div>

        {/* Consola de estado */}
        <div className="space-y-2 mb-8">
          <div className="flex justify-between text-xs text-gray-500">
            <span className="text-orange-500 animate-pulse">▶ SYSTEM BOOT</span>
            <span>{Math.min(progress, 100)}%</span>
          </div>
          
          {/* Barra de progreso */}
          <div className="h-2 w-full bg-[#1a1a1a] border border-gray-800 relative overflow-hidden">
            <div 
              className="h-full bg-orange-500 transition-all duration-150 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
            {/* Efecto de escaneo */}
            <div className="absolute inset-0 bg-white/20 w-full h-full animate-[scan_2s_ease-in-out_infinite] origin-left scale-x-0"></div>
          </div>
        </div>

        {/* Texto de la terminal */}
        <div className="text-[10px] text-gray-400 space-y-1 border-l-2 border-orange-500 pl-3">
          <p className="text-green-500">✓ Hardware crypto module: ACTIVE</p>
          <p className="text-green-500">✓ Turso DB connection: SECURE</p>
          <p className="text-green-500">✓ QvaPay tunnel: STANDBY</p>
          <p className="text-orange-400 animate-pulse">{'> '}{text}</p>
        </div>
      </div>

      <div className="absolute bottom-6 text-[9px] text-gray-700 tracking-widest">
        © 2026 IDKFREE INC. // ALL RIGHTS RESERVED
      </div>
    </div>
  );
}
