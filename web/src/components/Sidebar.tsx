import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import './Sidebar.css';

export function Sidebar() {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Inicio', icon: '🏠' },
    { path: '/search', label: 'Explorar', icon: '🔍' },
    { path: '/reels', label: 'Reels', icon: '🎬' },
    { path: '/chats', label: 'Mensajes', icon: '💬' },
    { path: `/u/${user?.alias}`, label: 'Perfil', icon: '👤' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">IDKFREE</div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
        <Link to="/create" className="sidebar-btn">
          Crear
        </Link>
      </nav>
    </div>
  );
}
