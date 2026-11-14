import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Ticket, Shield, LogOut, Network } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

export default function WebLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const privateNav = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'DASHBOARD' },
    { path: '/integrations', icon: Network, label: 'SESSIONS & API' },
    { path: '/ticketera', icon: Ticket, label: 'TICKETERA' },
    { path: '/kyc', icon: Shield, label: 'KYC / TRUST' },
  ];

  return (
    <div className="min-h-screen bg-brand-dark flex text-gray-300 font-sans">
      <aside className="w-64 border-r border-brand-border flex flex-col hidden md:flex bg-brand-panel">
        <div className="h-16 flex items-center px-6 border-b border-brand-border">
          <span className="text-white font-bold tracking-tighter text-xl">IDKFREE<span className="text-brand-blue">.OS</span></span>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          <p className="px-3 text-[10px] text-gray-600 font-mono mb-4 tracking-widest">MÓDULOS DEL SISTEMA</p>
          {privateNav.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-3 py-3 rounded-md transition-all text-sm font-medium ${
                  isActive ? 'bg-brand-blue/10 text-white border border-brand-blue/20' : 'text-gray-500 hover:text-white hover:bg-brand-border/50'
                }`}
              >
                <item.icon size={18} className={isActive ? 'text-brand-blue' : ''} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-brand-border space-y-4">
          <div className="text-xs font-mono">
            <span className="text-gray-500">OPERADOR:</span> <span className="text-white">{user?.alias || 'GUEST'}</span>
          </div>
          <button onClick={() => { logout(); navigate('/login'); }} className="flex items-center gap-2 text-xs text-red-500 hover:text-red-400 transition-colors">
            <LogOut size={14} /> CERRAR SESIÓN
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-brand-border flex items-center justify-between px-8 bg-brand-dark">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
            <div className="w-2 h-2 bg-brand-blue rounded-full animate-pulse"></div>
            SISTEMA OPERATIVO
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
