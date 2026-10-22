import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function WebLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();

  const menuItems = [
    { path: '/home', name: 'INICIO', icon: '⌂' },
    { path: '/search', name: 'BUSCAR', icon: '⌕' },
    { path: '/chats', name: 'MENSAJES', icon: '✉' },
    { path: '/reels', name: 'REELS', icon: '▶' },
    { path: `/u/${user?.alias}`, name: 'PERFIL', icon: '◉' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', padding: '20px', gap: '20px' }}>
      
      {/* SIDEBAR FLOTANTE CON EFECTO CRISTAL */}
      <aside className="glass-panel" style={{ 
        width: '260px', 
        padding: '30px 20px', 
        display: 'flex', 
        flexDirection: 'column', 
        position: 'fixed', 
        top: '20px', 
        bottom: '20px', 
        left: '20px',
        zIndex: 10
      }}>
        
        {/* Logo Táctico */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '4px', color: 'var(--text-main)' }}>
            IDK<span style={{ color: 'var(--accent-warm)' }}>FREE</span>
          </h1>
          <div style={{ width: '40px', height: '2px', background: 'var(--accent-warm)', margin: '10px auto 0' }} />
        </div>

        {/* Menú */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} style={{
                display: 'flex', alignItems: 'center', gap: '15px', padding: '14px 20px', borderRadius: '12px',
                backgroundColor: active ? 'rgba(255, 87, 34, 0.1)' : 'transparent',
                color: active ? 'var(--accent-warm)' : 'var(--text-muted)',
                fontWeight: active ? '600' : '400',
                border: active ? '1px solid rgba(255, 87, 34, 0.3)' : '1px solid transparent',
                transition: 'all 0.2s ease'
              }}>
                <span style={{ fontSize: '18px', opacity: active ? 1 : 0.7 }}>{item.icon}</span>
                <span style={{ fontSize: '13px', fontFamily: 'Space Mono', letterSpacing: '1px' }}>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Perfil y Salir */}
        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '0 10px' }}>
             <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-warm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {user?.alias?.charAt(0).toUpperCase()}
             </div>
             <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: '14px', fontWeight: '600', margin: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.name || user?.alias}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, fontFamily: 'Space Mono' }}>@{user?.alias}</p>
             </div>
          </div>
          <button 
            onClick={() => { clearAuth(); navigate('/'); }}
            style={{ width: '100%', background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', padding: '12px', borderRadius: '10px', fontSize: '12px', fontFamily: 'Space Mono', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#fff'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
          >
            DESCONECTAR_
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <main style={{ marginLeft: '280px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="glass-panel" style={{ flex: 1, padding: '30px', minHeight: 'calc(100vh - 40px)' }}>
          <Outlet />
        </div>
      </main>

    </div>
  );
}
