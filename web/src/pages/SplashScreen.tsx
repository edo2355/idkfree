import { useState, useEffect } from 'react';
import { ScreenBackground } from '../components/ScreenBackground';
import './SplashScreen.css';

interface Props {
  onComplete?: () => void;
}

export function SplashScreen({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);

  // Simulamos la carga
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (onComplete) setTimeout(onComplete, 500); // Espera medio segundo antes de salir
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5; // Avanza aleatoriamente
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Genera 20 bloques para la barra
  const totalBlocks = 20;
  const activeBlocks = Math.floor((progress / 100) * totalBlocks);

  return (
    <div className="splash-container">
      <ScreenBackground variant="topo" opacity={0.15} />

      {/* HUD Superior */}
      <div className="splash-hud-top">
        <span style={{ color: '#22C55E' }}>● IDKFREE.OS</span>
        <span>SERVIDOR</span>
        <span>V2.0.0 · 2026</span>
      </div>

      {/* Textos de fondo */}
      <div className="watermark wm-1">SOBERANIA<br/>DIGITAL</div>
      <div className="watermark wm-2">2023</div>
      <div className="watermark wm-3">RECUPERACIÓN<br/>3.DRS - IDENTIDAD</div>
      <div className="watermark wm-4">IDKFREE<br/>2023 - ∞</div>
      <div className="watermark wm-5">SYS.CMD<br/>&gt;_</div>

      {/* Icono y Título */}
      <img src="/icon.png" alt="IDKFREE Icon" className="splash-icon" />
      <h1 className="splash-title">IDKFREE</h1>
      <div className="splash-subtitle">[ SYSTEM BOOT · v2.0.0 ]</div>

      {/* Caja de Terminal */}
      <div className="splash-terminal">
        <div className="terminal-line">
          <span>&gt; BOOTING IDKFREE OS v2.0.0</span>
          <span className="terminal-ok">[OK]</span>
        </div>
        <div className="terminal-line">
          <span>&gt; VERIFYING IDENTITY</span>
          <span className="terminal-ok">[OK]</span>
        </div>
        <div className="terminal-line">
          <span>&gt; LOADING ALDEA v1</span>
          <span className="terminal-ok">[OK]</span>
        </div>
        <div className="terminal-line">
          <span>&gt; SYNCING CARNET</span>
          <span className="terminal-ok">[OK]</span>
        </div>

        {/* Barra de Progreso */}
        <div className="progress-container">
          <div className="progress-blocks">
            {Array.from({ length: totalBlocks }).map((_, i) => (
              <div key={i} className={`progress-block ${i < activeBlocks ? 'active' : ''}`} />
            ))}
          </div>
          <div className="progress-info">
            <span>LOADING</span>
            <span>
              <span className="progress-dot"></span>
              {progress}%
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="splash-footer">
        <div className="splash-tagline">Un lugar para pensar en voz alta</div>
        <div className="splash-created-by">[ CREADO POR ]</div>
        <img src="/logo-edo.svg" alt="edo amate" className="splash-logo-bottom" />
      </div>
    </div>
  );
}
