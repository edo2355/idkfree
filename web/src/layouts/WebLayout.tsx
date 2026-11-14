import { Outlet, Link } from 'react-router-dom';
import { Shield, LayoutDashboard, Users, Ticket } from 'lucide-react';

export default function WebLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 hidden md:block">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xl mb-8">
          <Shield /> IDKfree.OS
        </div>
        <nav className="space-y-2">
          <Link to="/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/waitlist" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
            <Users size={20} /> Waitlist
          </Link>
          <Link to="/ticketera" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 transition-colors">
            <Ticket size={20} /> Ticketera
          </Link>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
