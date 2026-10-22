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
    <div className="clean-bg" style={{ display: 'flex', minHeight: '100vh', padding: '20px', gap: '20px' }}>
      
      {/* SIDEBAR FLOTANTE */}
      <aside className="glass-panel" style={{ 
        width: '260px', padding: '30px 20px', display: 'flex', flexDirection: 'column', 
        position: 'fixed', top: '20px', bottom: '20px', left: '20px', zIndex: 10,
        borderRadius: '16px'
      }}>
        
        {/* Logo */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '4px', color: '#fff', margin: 0 }}>IDK</h1>
          <h2 style={{ fontSize: '10px', fontWeight: '400', letterSpacing: '6px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>FREE</h2>
        </div>

        {/* Menú */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} style={{
                display: 'flex', alignItems: 'center', gap: '15px', padding: '12px 16px', borderRadius: '6px',
                backgroundColor: active ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                color: active ? 'var(--accent-blue)' : 'var(--text-muted)',
                borderLeft: active ? '2px solid var(--accent-blue)' : '2px solid transparent',
                transition: 'all 0.2s ease', textDecoration: 'none'
              }}>
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                <span style={{ fontSize: '12px', fontFamily: 'Space Mono', letterSpacing: '1px', fontWeight: active ? '600' : '400' }}>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Perfil y Estado */}
        <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
             {/* Puntito verde de conexión */}
             <div style={{ position: 'relative' }}>
               <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff' }}>
                  {user?.alias?.charAt(0).toUpperCase()}
               </div>
               <div style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--status-green)', border: '2px solid var(--bg-base)' }}></div>
             </div>
             <div style={{ overflow: 'hidden' }}>
                <p style={{ fontSize: '13px', fontWeight: '500', margin: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.name || user?.alias}</p>
                <p style={{ fontSize: '10px', color: 'var(--status-green)', margin: '2px 0 0 0', fontFamily: 'Space Mono' }}>ONLINE</p>
             </div>
          </div>
          
          <button 
            onClick={() => { clearAuth(); navigate('/'); }}
            className="btn-tactical"
            style={{ padding: '10px', fontSize: '10px' }}
          >
            DESCONECTAR
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <main style={{ marginLeft: '280px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="glass-panel" style={{ flex: 1, padding: '30px', minHeight: 'calc(100vh - 40px)', borderRadius: '16px' }}>
          <Outlet />
        </div>
      </main>

    </div>
  );
}
