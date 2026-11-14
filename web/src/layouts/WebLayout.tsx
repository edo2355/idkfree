import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, User, Search, Bell } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export default function WebLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const navItems = [
    { path: '/feed', label: 'TIMELINE' },
    { path: '/buzz', label: 'EVENT BUZZ' },
    { path: '/ticketera', label: 'EVENTOS' },
    { path: '/dashboard', label: 'DASHBOARD' },
    { path: '/integrations', label: 'INTEGRACIONES' },
    { path: '/kyc', label: 'KYC' },
  ];

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col text-gray-300 font-sans">
      
      {/* TOP NAVBAR */}
      <header className="h-16 border-b border-brand-border bg-brand-panel sticky top-0 z-50 px-6">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/feed" className="text-white font-bold tracking-tighter text-xl flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-blue rounded-sm"></div>
            IDKFREE<span className="text-brand-blue">.OS</span>
          </Link>

          {/* Links Centrales */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-xs font-mono font-bold transition-colors ${
                    isActive ? 'text-white bg-brand-blue/10' : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Buscador y Perfil */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-[#000] border border-brand-border rounded-md px-2 py-1">
              <Search size={14} className="text-gray-500 mr-2" />
              <input type="text" placeholder="Buscar eventos, usuarios..." className="bg-transparent border-none outline-none text-xs text-white w-48" />
            </div>
            <button className="text-gray-400 hover:text-white"><Bell size={18} /></button>
            <div className="flex items-center gap-3 border-l border-brand-border pl-4">
              <Link to="/profile" className="flex items-center gap-2 hover:opacity-80">
                <div className="w-8 h-8 bg-brand-blue/20 border border-brand-blue rounded-full flex items-center justify-center text-xs font-bold text-brand-blue">
                  {user?.alias?.charAt(0) || 'U'}
                </div>
                <span className="text-xs font-mono hidden md:block">{user?.alias || 'USER'}</span>
              </Link>
              <button onClick={() => { logout(); navigate('/login'); }} className="text-red-500 hover:text-red-400 ml-2">
                <LogOut size={16} />
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
