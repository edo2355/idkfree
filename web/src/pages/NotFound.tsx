import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';

export function NotFound() {
  return (
    <Layout>
      <div style={{ textAlign: 'center', padding: 60 }}>
        <p style={{ fontSize: 72 }}>🌾</p>
        <h1 style={{ fontSize: 24, marginTop: 16 }}>Página no encontrada</h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: 8 }}>
          Esta parte de Aldea no existe (todavía).
        </p>
        <div style={{ marginTop: 24 }}>
          <Link to="/">Volver al feed</Link>
        </div>
      </div>
    </Layout>
  );
}