import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Search, Bell, Sun, Moon, Home, Ticket, MessageSquare, User, Zap } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';

export default function WebLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const navItems = [
    { path: '/feed', label: 'TIMELINE' },
    { path: '/buzz', label: 'EVENT BUZZ' },
    { path: '/ticketera', label: 'EVENTOS' },
    { path: '/dashboard', label: 'DASHBOARD' },
    { path: '/integrations', label: 'INTEGRACIONES' },
    { path: '/kyc', label: 'KYC' },
  ];

  const mobileNav = [
    { path: '/feed', icon: Home },
    { path: '/buzz', icon: Zap },
    { path: '/ticketera', icon: Ticket },
    { path: '/messages', icon: MessageSquare },
    { path: '/profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-brand-dark text-gray-900 dark:text-gray-300 font-sans flex flex-col transition-colors duration-300">
      
      {/* TOP NAVBAR */}
      <header className="h-16 border-b border-gray-200 dark:border-brand-border bg-white dark:bg-brand-panel sticky top-0 z-50 px-4 md:px-6 transition-colors">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          
          <Link to="/feed" className="text-gray-900 dark:text-white font-bold tracking-tighter text-xl flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-blue rounded-sm"></div>
            IDKFREE<span className="text-brand-blue">.OS</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-xs font-mono font-bold transition-colors ${
                    isActive ? 'text-brand-blue bg-brand-blue/10' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:flex items-center bg-gray-100 dark:bg-[#000] border border-gray-300 dark:border-brand-border rounded-md px-2 py-1">
              <Search size={14} className="text-gray-500 mr-2" />
              <input type="text" placeholder="Buscar..." className="bg-transparent border-none outline-none text-xs text-gray-900 dark:text-white w-32 md:w-48" />
            </div>
            
            <button onClick={toggleTheme} className="p-2 text-gray-500 hover:text-brand-blue transition-colors">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="p-2 text-gray-500 hover:text-brand-blue transition-colors"><Bell size={18} /></button>
            
            <div className="flex items-center gap-2 md:gap-3 border-l border-gray-300 dark:border-brand-border pl-2 md:pl-4">
              <Link to="/profile" className="flex items-center gap-2 hover:opacity-80">
                <div className="w-8 h-8 bg-brand-blue/20 border border-brand-blue rounded-full flex items-center justify-center text-xs font-bold text-brand-blue">
                  {user?.alias?.charAt(0) || 'U'}
                </div>
                <span className="text-xs font-mono hidden md:block text-gray-900 dark:text-white">{user?.alias || 'USER'}</span>
              </Link>
              <button onClick={() => { logout(); navigate('/login'); }} className="text-red-500 hover:text-red-400 ml-1 md:ml-2">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 pb-20 md:pb-8">
        <Outlet />
      </main>

      {/* BOTTOM NAVIGATION (Solo Móvil) */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white dark:bg-brand-panel border-t border-gray-200 dark:border-brand-border flex justify-around items-center h-16 z-50 transition-colors">
        {mobileNav.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className={`p-2 ${isActive ? 'text-brand-blue' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}>
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
