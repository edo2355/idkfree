import { useState } from 'react';
import { Terminal, Key, Copy } from 'lucide-react';

export default function DeveloperApi() {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');

  const generateKeys = async () => {
    // Simulación (luego conectas al endpoint real /developer/keys)
    setApiKey('idk_pub_1234567890abcdef');
    setApiSecret('idk_sec_supersecret_987654321');
  };

  return (
    <div style={{ padding: 40, maxWidth: 700, margin: '0 auto', color: '#fff' }}>
      <h1 style={{ color: '#00e5ff', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Terminal /> Integrated KYC API
      </h1>
      <p style={{ color: '#888', marginBottom: 30 }}>
        Ofrece verificación de identidad en tu propia plataforma usando nuestra tecnología.
      </p>

      <div style={{ background: 'rgba(255,255,255,0.02)', padding: 20, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ fontSize: 18, marginBottom: 15 }}>Generar Credenciales</h2>
        <button onClick={generateKeys} style={{ padding: '10px 20px', background: '#00e5ff', color: '#000', border: 'none', borderRadius: 6, fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Key size={16} /> Generar API Key
        </button>

        {apiKey && (
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ background: '#000', padding: 10, borderRadius: 6, fontFamily: 'monospace', color: '#4ade80', display: 'flex', justifyContent: 'space-between' }}>
              <span>{apiKey}</span> <Copy size={16} style={{ cursor: 'pointer' }} />
            </div>
            <div style={{ background: '#000', padding: 10, borderRadius: 6, fontFamily: 'monospace', color: '#ff4444', display: 'flex', justifyContent: 'space-between' }}>
              <span>{apiSecret}</span> <Copy size={16} style={{ cursor: 'pointer' }} />
            </div>
            <p style={{ color: '#888', fontSize: 12 }}>⚠️ Guarda el Secret. No se volverá a mostrar.</p>
          </div>
        )}
      </div>
    </div>
  );
}
