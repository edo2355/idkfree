import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Ticket, Shield, LogOut, Code2, Network } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export default function WebLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const privateNav = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'DASHBOARD' },
    { path: '/integrations', icon: Network, label: 'SESSIONS & API' },
    { path: '/ticketera', icon: Ticket, label: 'TICKETERA' },
    { path: '/kyc', icon: Shield, label: 'KYC / TRUST' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] flex text-slate-300 font-sans">
      
      <aside className="w-64 border-r border-[#1a1a1a] flex flex-col hidden md:flex bg-[#0a0a0a]">
        <div className="h-16 flex items-center px-6 border-b border-[#1a1a1a]">
          <span className="text-white font-bold tracking-tighter text-xl">IDKFREE<span className="text-orange-500">.OS</span></span>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2">
          <p className="px-3 text-[10px] text-gray-600 font-mono mb-4 tracking-widest">MÓDULOS ACTIVOS</p>
          {privateNav.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-3 py-3 rounded-md transition-all text-sm font-medium ${
                  isActive ? 'bg-[#1a1a1a] text-white' : 'text-gray-500 hover:text-white hover:bg-[#111]'
                }`}
              >
                <item.icon size={18} className={isActive ? 'text-orange-500' : ''} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#1a1a1a] space-y-4">
          <div className="text-xs font-mono">
            <span className="text-gray-500">USER:</span> <span className="text-white">{user?.alias || 'GUEST'}</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-xs text-red-500 hover:text-red-400 transition-colors">
            <LogOut size={14} /> CERRAR SESIÓN
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-[#1a1a1a] flex items-center justify-between px-8 bg-[#050505]">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            SYSTEM ONLINE
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
