import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Search, Bell, Sun, Moon, Home, Ticket, User, Zap, ShoppingBag, LayoutDashboard, Code, Network } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { useUIStore } from '../stores/uiStore';

export default function WebLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { toast } = useUIStore();

  // Módulos Sociales (Top Nav)
  const topNav = [
    { path: '/feed', label: 'TIMELINE' },
    { path: '/buzz', label: 'EVENT BUZZ' },
    { path: '/messages', label: 'MENSAJES' },
  ];

  // Módulos de Negocio (Sidebar Vertical)
  const sidebarNav = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Panel de Control' },
    { path: '/catalog', icon: ShoppingBag, label: 'Catálogo (Shop)' },
    { path: '/ticketera', icon: Ticket, label: 'Gestión de Eventos' },
    { path: '/integrations', icon: Network, label: 'Sesiones & Redes' },
    { path: '/developer', icon: Code, label: 'Developer API' },
    { path: '/kyc', icon: User, label: 'Identidad (KYC)' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-gray-900 dark:text-gray-300 font-sans flex transition-colors duration-300">
      
      {/* TOAST */}
      {toast && (
        <div className={`fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full font-mono text-sm shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300 ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 
          toast.type === 'success' ? 'bg-green-600 text-white' : 
          'bg-brand-blue text-white'
        }`}>
          {toast.message}
        </div>
      )}

      {/* SIDEBAR VERTICAL (Solo Desktop) */}
      <aside className="w-64 border-r border-gray-200 dark:border-[#1a1a1a] bg-gray-50 dark:bg-[#0a0a0a] flex flex-col hidden lg:flex transition-colors">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-[#1a1a1a]">
          <Link to="/feed" className="text-gray-900 dark:text-white font-bold tracking-tighter text-xl flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-blue rounded-sm flex items-center justify-center text-white"><Zap size={14} /></div>
            IDK<span className="text-brand-blue">MEDIA</span>
          </Link>
        </div>

        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-[10px] text-gray-400 dark:text-gray-600 font-mono mb-4 tracking-widest uppercase">Gestión de Negocio</p>
          {sidebarNav.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all text-sm font-medium ${isActive ? 'bg-brand-blue/10 text-brand-blue' : 'text-gray-600 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-[#1a1a1a]'}`}>
                <item.icon size={18} /> {item.label}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-[#1a1a1a]">
          <Link to="/profile" className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-[#1a1a1a] transition-colors">
            <div className="w-8 h-8 bg-brand-blue/20 border border-brand-blue rounded-full flex items-center justify-center text-xs font-bold text-brand-blue">
              {user?.alias?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.alias || 'Usuario'}</p>
              <p className="text-[10px] text-gray-500 font-mono truncate">Ver Perfil</p>
            </div>
          </Link>
          <button onClick={() => { logout(); navigate('/login'); }} className="mt-2 w-full flex items-center justify-center gap-2 text-xs text-red-500 hover:text-red-400 py-2 border border-red-500/20 rounded hover:bg-red-500/10 transition-colors">
            <LogOut size={14} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL (Derecha) */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOP NAVBAR (Social) */}
        <header className="h-16 border-b border-gray-200 dark:border-[#1a1a1a] bg-white dark:bg-[#050505] sticky top-0 z-50 px-4 md:px-6 transition-colors">
          <div className="h-full flex items-center justify-between">
            
            {/* Logo solo visible en móvil (porque en desktop está en el sidebar) */}
            <Link to="/feed" className="lg:hidden text-gray-900 dark:text-white font-bold tracking-tighter text-xl flex items-center gap-2">
              <div className="w-6 h-6 bg-brand-blue rounded-sm flex items-center justify-center text-white"><Zap size={14} /></div>
              IDK<span className="text-brand-blue">MEDIA</span>
            </Link>

            {/* Links Sociales */}
            <nav className="hidden md:flex items-center gap-1 lg:ml-4">
              {topNav.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path} className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-colors ${isActive ? 'text-brand-blue bg-brand-blue/10' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1a1a1a]'}`}>
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Acciones Globales */}
            <div className="flex items-center gap-2 md:gap-4">
              <div className="hidden md:flex items-center bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-[#1a1a1a] rounded-full px-3 py-1.5 focus-within:border-brand-blue transition-colors">
                <Search size={14} className="text-gray-500 mr-2" />
                <input type="text" placeholder="Buscar..." className="bg-transparent border-none outline-none text-xs text-gray-900 dark:text-white w-32 xl:w-48" />
              </div>
              <button onClick={toggleTheme} className="p-2 text-gray-500 hover:text-brand-blue transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-[#1a1a1a]">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button className="p-2 text-gray-500 hover:text-brand-blue transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-[#1a1a1a]"><Bell size={18} /></button>
            </div>
          </div>
        </header>

        {/* ÁREA DE TRABAJO */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 bg-gray-50 dark:bg-[#020202] transition-colors">
          <Outlet />
        </main>
      </div>

      {/* BOTTOM NAV (Solo Móvil) */}
      <nav className="lg:hidden fixed bottom-0 w-full bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-[#1a1a1a] flex justify-around items-center h-16 z-50 transition-colors">
        <Link to="/feed" className={`p-2 ${location.pathname === '/feed' ? 'text-brand-blue' : 'text-gray-500'}`}><Home size={24} /></Link>
        <Link to="/buzz" className={`p-2 ${location.pathname === '/buzz' ? 'text-brand-blue' : 'text-gray-500'}`}><Zap size={24} /></Link>
        <Link to="/catalog" className={`p-2 ${location.pathname === '/catalog' ? 'text-brand-blue' : 'text-gray-500'}`}><ShoppingBag size={24} /></Link>
        <Link to="/ticketera" className={`p-2 ${location.pathname === '/ticketera' ? 'text-brand-blue' : 'text-gray-500'}`}><Ticket size={24} /></Link>
        <Link to="/dashboard" className={`p-2 ${location.pathname === '/dashboard' ? 'text-brand-blue' : 'text-gray-500'}`}><LayoutDashboard size={24} /></Link>
      </nav>
    </div>
  );
}
