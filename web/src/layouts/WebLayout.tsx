import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { 
  Home, Search, MessageSquare, Video, User, Settings, 
  LogOut, Menu, X, Radio
} from 'lucide-react';
import './WebLayout.css';

export default function WebLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { path: '/home', name: 'INICIO', icon: <Home size={20} /> },
    { path: '/search', name: 'BUSCAR', icon: <Search size={20} /> },
    { path: '/chats', name: 'MENSAJES', icon: <MessageSquare size={20} /> },
    { path: '/reels', name: 'REELS', icon: <Video size={20} /> },
    { path: '/golive', name: 'TRANSMITIR', icon: <Radio size={20} className="live-icon" /> },
    { path: `/u/${user?.alias}`, name: 'PERFIL', icon: <User size={20} /> },
    { path: '/settings', name: 'AJUSTES', icon: <Settings size={20} /> },
  ];

  return (
    <div className="web-layout-container">
      {/* HEADER MÓVIL (Oculto en PC) */}
      <header className="mobile-header">
        <button className="icon-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="logo-mobile">IDK<span>.</span>FREE</div>
        <div style={{ width: 24 }}></div> {/* Espaciador */}
      </header>

      {/* SIDEBAR (PC y Móvil desplegable) */}
      <aside className={`sidebar glass-panel ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <h1>IDK</h1>
          <h2>FREE</h2>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`nav-item ${active ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">
              {user?.alias?.charAt(0).toUpperCase()}
              <div className="status-dot"></div>
            </div>
            <div className="user-details">
              <p className="user-name">{user?.name || user?.alias}</p>
              <p className="user-status">ONLINE</p>
            </div>
          </div>
          <button onClick={() => { clearAuth(); navigate('/'); }} className="logout-btn">
            <LogOut size={16} /> DESCONECTAR
          </button>
        </div>
      </aside>

      {/* OVERLAY MÓVIL (Fondo oscuro al abrir menú) */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* CONTENIDO PRINCIPAL */}
      <main className="main-content">
        <div className="content-panel glass-panel">
          <Outlet />
        </div>
      </main>

      {/* BOTTOM NAV (Solo Móvil) */}
      <nav className="mobile-bottom-nav glass-panel">
        {menuItems.slice(0, 4).map((item) => (
          <Link key={item.path} to={item.path} className={`bottom-nav-item ${location.pathname === item.path ? 'active' : ''}`}>
            {item.icon}
          </Link>
        ))}
        <Link to={`/u/${user?.alias}`} className={`bottom-nav-item ${location.pathname.includes('/u/') ? 'active' : ''}`}>
          <User size={20} />
        </Link>
      </nav>
    </div>
  );
}
