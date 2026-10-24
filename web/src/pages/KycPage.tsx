import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ApiError } from '../api/client';
import './SettingsPage.css';

const MAX_DIM = 1280;
const JPEG_QUALITY = 0.6;

type KycStatus = 'loading' | 'not_submitted' | 'pending' | 'approved' | 'rejected' | 'error';

async function compressImage(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('El archivo no es una imagen');
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Error leyendo archivo'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Imagen inválida'));
      img.onload = () => {
        let { width, height } = img;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas no disponible'));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function KycPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<KycStatus>('loading');
  const [adminNotes, setAdminNotes] = useState('');
  const [docType, setDocType] = useState('id_card');
  const [docNumber, setDocNumber] = useState('');
  const [docPhoto, setDocPhoto] = useState<string | null>(null);
  const [selfiePhoto, setSelfiePhoto] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const aliveRef = useRef(true);

  useEffect(() => {
    aliveRef.current = true;
    (async () => {
      try {
        const res = await api.kyc.status();
        if (!aliveRef.current) return;
        setStatus((res?.status as KycStatus) || 'not_submitted');
        if (res?.admin_notes) setAdminNotes(res.admin_notes);
      } catch (e) {
        if (!aliveRef.current) return;
        const msg = e instanceof ApiError
          ? (e.status === 401 ? 'Sesión expirada. Vuelve a iniciar sesión.' : e.message)
          : 'No se pudo conectar con el servidor';
        setStatus('error');
        setError(msg);
      }
    })();
    return () => { aliveRef.current = false; };
  }, []);

  async function pickImage(
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (v: string | null) => void
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    try {
      const data = await compressImage(file);
      setter(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo procesar la imagen');
    }
  }

  async function handleSubmit() {
    setError('');
    if (!docNumber.trim()) return setError('Ingresa tu número de documento');
    if (!docPhoto) return setError('Sube la foto frontal del documento');
    if (!selfiePhoto) return setError('Sube tu selfie');

    setSubmitting(true);
    try {
      await api.kyc.submit({
        document_type: docType,
        document_number: docNumber.trim(),
        document_photo: docPhoto,
        selfie_photo: selfiePhoto,
      });
      setStatus('pending');
    } catch (e) {
      if (e instanceof ApiError) {
        setError(e.status === 401 ? 'Sesión expirada' : e.message);
      } else {
        setError('Error de red. Intenta de nuevo.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="settings-container">
      <header className="settings-hud">
        <h1>[ KYC - VERIFICACIÓN DE IDENTIDAD ]</h1>
        <button onClick={() => navigate(-1)} className="btn-icon">[ X ]</button>
      </header>

      <div className="settings-group">
        {status === 'loading' && (
          <p style={{ color: '#aaa', fontFamily: 'monospace', fontSize: '13px', padding: '20px 0' }}>
            [ CONSULTANDO ESTADO... ]
          </p>
        )}

        {status === 'error' && (
          <>
            <h2>[ ERROR ]</h2>
            <p style={{ color: '#ff4444', fontFamily: 'monospace', fontSize: '13px', marginBottom: '20px' }}>
              {error}
            </p>
            <button className="btn-tactical" onClick={() => window.location.reload()} style={{ padding: '12px 24px' }}>
              REINTENTAR
            </button>
          </>
        )}

        {status === 'pending' && (
          <div style={{ padding: '20px 0' }}>
            <h2 style={{ color: '#00E5FF', fontSize: '20px', marginBottom: '15px' }}>[ EN REVISIÓN ]</h2>
            <p style={{ color: '#aaa', fontSize: '13px', lineHeight: 1.6 }}>
              Tu verificación ha sido enviada y está siendo revisada manualmente.<br />
              Te notificaremos cuando sea aprobada o si necesitamos más información.
            </p>
          </div>
        )}

        {status === 'approved' && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <h2 style={{ color: '#00E5FF', fontSize: '20px', marginBottom: '15px' }}>[ ✓ VERIFICADO ]</h2>
            <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '25px' }}>
              Tu identidad ha sido verificada correctamente.<br />
              Ya tienes acceso a todas las funciones premium.
            </p>
            <button className="btn-tactical" onClick={() => navigate(-1)} style={{ padding: '15px 30px' }}>
              VOLVER A AJUSTES
            </button>
          </div>
        )}

        {(status === 'not_submitted' || status === 'rejected') && (
          <>
            <h2>[ ESTADO: {status === 'rejected' ? 'RECHAZADO' : 'PENDIENTE'} ]</h2>

            {status === 'rejected' && adminNotes && (
              <div style={{
                border: '1px solid #ff4444',
                padding: '15px',
                marginBottom: '20px',
                color: '#ff4444',
                fontFamily: 'monospace',
                fontSize: '12px',
                lineHeight: 1.5,
              }}>
                <strong>MOTIVO DEL RECHAZO:</strong><br />
                {adminNotes}
              </div>
            )}

            <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '20px', lineHeight: 1.6 }}>
              Para desbloquear la insignia verificada y aumentar tu límite de ventas, necesitamos validar tu identidad.
            </p>

            <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontFamily: 'monospace' }}>
              TIPO DE DOCUMENTO
            </label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              disabled={submitting}
              style={{ width: '100%', padding: '15px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', fontFamily: 'monospace', marginBottom: '20px' }}
            >
              <option value="id_card">Carnet de Identidad</option>
              <option value="passport">Pasaporte</option>
              <option value="driver_license">Licencia de Conducir</option>
            </select>

            <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontFamily: 'monospace' }}>
              NÚMERO DE DOCUMENTO
            </label>
            <input
              type="text"
              value={docNumber}
              onChange={(e) => setDocNumber(e.target.value)}
              disabled={submitting}
              placeholder="Ej. 85010112345"
              style={{ width: '100%', padding: '15px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', fontFamily: 'monospace', marginBottom: '20px' }}
            />

            <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontFamily: 'monospace' }}>
              FOTO FRONTAL DEL DOCUMENTO
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => pickImage(e, setDocPhoto)}
              disabled={submitting}
              style={{ display: 'block', width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#aaa', fontFamily: 'monospace', fontSize: '12px', marginBottom: '10px' }}
            />
            {docPhoto && (
              <img src={docPhoto} alt="Documento" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', border: '1px solid #333', marginBottom: '20px' }} />
            )}

            <label style={{ display: 'block', fontSize: '11px', color: '#666', marginBottom: '8px', fontFamily: 'monospace' }}>
              SELFIE (Rostro descubierto)
            </label>
            <input
              type="file"
              accept="image/*"
              capture="user"
              onChange={(e) => pickImage(e, setSelfiePhoto)}
              disabled={submitting}
              style={{ display: 'block', width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#aaa', fontFamily: 'monospace', fontSize: '12px', marginBottom: '10px' }}
            />
            {selfiePhoto && (
              <img src={selfiePhoto} alt="Selfie" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', border: '1px solid #333', marginBottom: '20px' }} />
            )}

            {error && (
              <p style={{ color: '#ff4444', fontFamily: 'monospace', fontSize: '12px', marginBottom: '15px' }}>
                [ ERROR ] {error}
              </p>
            )}

            <button
              className="btn-tactical"
              onClick={handleSubmit}
              disabled={submitting}
              style={{ width: '100%', padding: '15px', borderColor: submitting ? '#333' : '#00E5FF', color: submitting ? '#666' : '#00E5FF', cursor: submitting ? 'not-allowed' : 'pointer' }}
            >
              {submitting ? 'ENVIANDO...' : status === 'rejected' ? 'REENVIAR VERIFICACIÓN' : 'ENVIAR VERIFICACIÓN'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
