import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { Layout } from '../components/Layout';
import './Create.css';

export function Create() {
  const navigate = useNavigate();
  const [body, setBody] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    
    setFile(selected);
    setIsVideo(selected.type.startsWith('video/'));
    setPreviewUrl(URL.createObjectURL(selected));
  }

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() && !file) return;

    setPublishing(true);
    try {
      let mediaUrl = null;

      if (file) {
        setUploading(true);
        const uploadRes = await api.uploads.upload(file);
        mediaUrl = uploadRes.url;
        setUploading(false);
      }

      await api.posts.create({
        body: body.trim() || null,
        imageUrl: mediaUrl && !isVideo ? mediaUrl : null,
        videoUrl: mediaUrl && isVideo ? mediaUrl : null,
        visibility: 'public'
      });

      navigate('/');
    } catch (err: any) {
      alert('Error al publicar: ' + err.message);
    } finally {
      setPublishing(false);
      setUploading(false);
    }
  }

  return (
    <Layout>
      <div className="create-container">
        <h1>Crear Publicación</h1>
        <form onSubmit={handlePublish} className="create-form">
          
          <div className="create-preview-area">
            {previewUrl ? (
              isVideo ? (
                <video src={previewUrl} controls className="preview-media" />
              ) : (
                <img src={previewUrl} alt="Preview" className="preview-media" />
              )
            ) : (
              <label className="file-upload-label">
                <span className="upload-icon">📸</span>
                <span>Toca aquí para subir una foto o video</span>
                <input 
                  type="file" 
                  accept="image/*,video/*" 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>

          {previewUrl && (
            <button 
              type="button" 
              onClick={() => { setFile(null); setPreviewUrl(null); }}
              className="remove-file-btn"
            >
              Quitar archivo
            </button>
          )}

          <textarea 
            placeholder="Escribe un pie de foto o comentario..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={500}
            className="create-textarea"
          />

          <button 
            type="submit" 
            className="create-submit-btn" 
            disabled={(!body.trim() && !file) || publishing}
          >
            {publishing ? (uploading ? 'Subiendo archivo...' : 'Publicando...') : 'Publicar'}
          </button>
        </form>
      </div>
    </Layout>
  );
}
