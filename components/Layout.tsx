
import React, { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const isAdmin = user?.email?.endsWith('@nexushub.admin') || user?.email === 'nexus-admin@example.com' || (user?.user_metadata?.role === 'admin');

  const navItems = [
    { path: '/dashboard', icon: 'fa-shapes', label: 'Dashboard' },
    { path: '/study-buddy', icon: 'fa-comments', label: 'Study Buddy' },
    { path: '/create', icon: 'fa-cloud-arrow-up', label: 'Upload Content' },
    { path: '/profile', icon: 'fa-book-bookmark', label: 'Study Library' },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 sidebar-gradient text-white fixed h-full z-40">
        <div className="p-8">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-indigo-500/20 transition-transform group-hover:scale-110">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <div>
              <span className="text-xl font-black tracking-tight block">NexusHub</span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 block -mt-1 opacity-80">Back to Landing</span>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 mt-4 px-4 space-y-1.5">
          <div className="px-4 mb-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 opacity-60">Main Menu</p>
          </div>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                location.pathname === item.path 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                  : 'hover:bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-6 text-lg ${location.pathname === item.path ? 'text-white' : 'text-slate-500'}`}></i>
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
            </Link>
          ))}

          {isAdmin && (
            <>
              <div className="px-4 mt-8 mb-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 opacity-60">Administration</p>
              </div>
              <Link
                to="/admin"
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  location.pathname === '/admin' 
                    ? 'bg-slate-800 text-white shadow-lg border border-white/10' 
                    : 'hover:bg-indigo-500/10 text-indigo-300 hover:text-white'
                }`}
              >
                <i className={`fa-solid fa-shield-halved w-6 text-lg ${location.pathname === '/admin' ? 'text-indigo-400' : 'text-indigo-500/50'}`}></i>
                <span className="font-black text-xs uppercase tracking-widest">Admin Panel</span>
              </Link>
            </>
          )}
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="bg-white/5 rounded-2xl p-4 mb-6">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-lg font-black text-indigo-400">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold truncate text-white">{user?.email?.split('@')[0]}</p>
                <div className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <p className="text-[9px] text-slate-500 uppercase font-black">
                    {isAdmin ? 'System Overseer' : 'Verified Member'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-3 p-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all text-xs font-black uppercase tracking-widest border border-white/5"
          >
            <i className="fa-solid fa-power-off"></i>
            <span>Secure Logoff</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Nav */}
      <header className="md:hidden flex items-center justify-between p-4 bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
        <Link to="/" className="text-xl font-bold text-indigo-400 flex items-center space-x-2">
          <i className="fa-solid fa-graduation-cap"></i>
          <span className="tracking-tighter">NexusHub</span>
        </Link>
        <button onClick={handleLogout} className="text-lg text-slate-400">
          <i className="fa-solid fa-right-from-bracket"></i>
        </button>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-72 min-h-screen">
        <main className="flex-1 bg-transparent">
          <div className="max-w-7xl mx-auto p-4 md:p-10">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 px-2 z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center text-[10px] space-y-1 font-bold tracking-tighter ${
              location.pathname === item.path ? 'text-indigo-600' : 'text-slate-400'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-lg`}></i>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
