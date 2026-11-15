import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LogOut, Search, Bell, Sun, Moon, Menu, X, 
  LayoutDashboard, ShoppingBag, Ticket, Code, 
  Home, Zap, MessageSquare, User, Settings
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import { useUIStore } from '../stores/uiStore';

export default function WebLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { toast } = useUIStore();
  
  // Estado para controlar el sidebar en móvil
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);

  // Estructura del Sidebar (Estilo Cloudflare)
  const navGroups = [
    {
      title: 'SOCIAL',
      links: [
        { path: '/feed', icon: Home, label: 'Timeline' },
        { path: '/buzz', icon: Zap, label: 'Event Buzz' },
        { path: '/messages', icon: MessageSquare, label: 'Mensajes' },
      ]
    },
    {
      title: 'PLATAFORMA',
      links: [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Panel de Control' },
        { path: '/catalog', icon: ShoppingBag, label: 'Catálogo / Shop' },
        { path: '/ticketera', icon: Ticket, label: 'Eventos / Ticketera' },
      ]
    },
    {
      title: 'DESARROLLADORES',
      links: [
        { path: '/developer', icon: Code, label: 'Developer API' },
        { path: '/integrations', icon: Settings, label: 'Sesiones & Redes' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-gray-300 font-sans flex transition-colors duration-300">
      
      {/* TOAST */}
      {toast && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-lg font-mono text-sm shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300 ${
          toast.type === 'error' ? 'bg-red-600 text-white' : 
          toast.type === 'success' ? 'bg-green-600 text-white' : 
          'bg-brand-blue text-white'
        }`}>
          {toast.message}
        </div>
      )}

      {/* OVERLAY OSCURO (Solo Móvil cuando el sidebar está abierto) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}

      {/* SIDEBAR VERTICAL (Colapsable en Móvil, Fijo en Desktop) */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-64 bg-white dark:bg-[#0a0a0a] border-r border-gray-200 dark:border-[#1a1a1a] flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo y Botón de Cerrar (Móvil) */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-[#1a1a1a]">
          <Link to="/feed" className="text-gray-900 dark:text-white font-bold tracking-tighter text-xl flex items-center gap-2" onClick={closeSidebar}>
            <div className="w-6 h-6 bg-brand-blue rounded-sm flex items-center justify-center text-white"><Zap size={14} /></div>
            IDK<span className="text-brand-blue">MEDIA</span>
          </Link>
          <button onClick={closeSidebar} className="lg:hidden text-gray-500 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Links del Sidebar */}
        <div className="flex-1 py-6 px-4 space-y-6 overflow-y-auto">
          {navGroups.map((group, i) => (
            <div key={i}>
              <p className="px-3 text-[10px] text-gray-400 dark:text-gray-600 font-mono mb-2 tracking-widest uppercase">{group.title}</p>
              <div className="space-y-1">
                {group.links.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link 
                      key={item.path} 
                      to={item.path} 
                      onClick={closeSidebar}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all text-sm font-medium ${
                        isActive 
                          ? 'bg-brand-blue/10 text-brand-blue' 
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1a1a1a]'
                      }`}
                    >
                      <item.icon size={18} /> {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Perfil de Usuario (Abajo) */}
        <div className="p-4 border-t border-gray-200 dark:border-[#1a1a1a]">
          <Link to="/profile" onClick={closeSidebar} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors mb-2">
            <div className="w-8 h-8 bg-brand-blue/20 border border-brand-blue rounded-full flex items-center justify-center text-xs font-bold text-brand-blue">
              {user?.alias?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.alias || 'Usuario'}</p>
              <p className="text-[10px] text-gray-500 font-mono truncate">Ver Perfil</p>
            </div>
          </Link>
          <button onClick={() => { logout(); navigate('/login'); }} className="w-full flex items-center justify-center gap-2 text-xs text-red-500 hover:text-red-400 py-2 border border-red-500/20 rounded hover:bg-red-500/10 transition-colors">
            <LogOut size={14} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL (A la derecha del Sidebar) */}
      <div className="flex-1 flex flex-col h-screen lg:ml-64 overflow-hidden transition-all duration-300">
        
        {/* TOP BARRA (Búsqueda, Modo Oscuro, Notificaciones) */}
        <header className="h-16 border-b border-gray-200 dark:border-[#1a1a1a] bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 transition-colors flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Botón Hamburguesa (Solo Móvil) */}
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white">
              <Menu size={24} />
            </button>
            
            {/* Buscador Global */}
            <div className="hidden md:flex items-center bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-[#1a1a1a] rounded-full px-4 py-1.5 focus-within:border-brand-blue transition-colors">
              <Search size={16} className="text-gray-500 mr-2" />
              <input type="text" placeholder="Buscar en IDKMEDIA..." className="bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white w-48 xl:w-64" />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={toggleTheme} className="p-2 text-gray-500 hover:text-brand-blue transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-[#1a1a1a]">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="p-2 text-gray-500 hover:text-brand-blue transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-[#1a1a1a] relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* ÁREA DE TRABAJO */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
}
