import { useState } from 'react';
import { Shield, Send, UserCheck, Lock } from 'lucide-react';

export default function KycSelect() {
  const [selected, setSelected] = useState('telegram');

  const options = [
    { id: 'telegram', name: 'Telegram Passport', icon: <Send size={24} />, desc: 'Rápido y seguro vía Telegram.' },
    { id: 'sumsub', name: 'Verificación Automática', icon: <Shield size={24} />, desc: 'Proveedor internacional (Excepto Cuba/Irán).' },
    { id: 'manual', name: 'Revisión Manual', icon: <UserCheck size={24} />, desc: 'Nuestro equipo revisará tus documentos.' },
  ];

  return (
    <div style={{ padding: 40, maxWidth: 600, margin: '0 auto', color: '#fff' }}>
      <h1 style={{ color: '#00e5ff', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Lock /> Verificación de Identidad
      </h1>
      <p style={{ color: '#888', marginBottom: 30 }}>Elige cómo quieres verificar tu identidad para aumentar tu Trust Score.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        {options.map(opt => (
          <div 
            key={opt.id} 
            onClick={() => setSelected(opt.id)}
            style={{
              padding: 20, borderRadius: 12, cursor: 'pointer',
              background: selected === opt.id ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255,255,255,0.02)',
              border: selected === opt.id ? '1px solid #00e5ff' : '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', gap: 15
            }}
          >
            <div style={{ color: selected === opt.id ? '#00e5ff' : '#888' }}>{opt.icon}</div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16 }}>{opt.name}</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: 13, color: '#888' }}>{opt.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <button style={{ 
        width: '100%', marginTop: 30, padding: 15, background: '#00e5ff', 
        color: '#000', fontWeight: 'bold', border: 'none', borderRadius: 8, cursor: 'pointer' 
      }}>
        Iniciar Verificación
      </button>
    </div>
  );
}
