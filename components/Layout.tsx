import React from 'react';
import { Home, Feather, Circle, ScrollText } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: <Home size={20} strokeWidth={1.5} />, label: 'Path', path: '/' },
    { icon: <Circle size={20} strokeWidth={1.5} />, label: 'Ritual', path: '/ritual' },
    { icon: <Feather size={20} strokeWidth={1.5} />, label: 'Practice', path: '/action' }, // Feather/Brush concept
    { icon: <ScrollText size={20} strokeWidth={1.5} />, label: 'Scroll', path: '/journal' },
  ];

  return (
    <div className="min-h-screen bg-zen-paper text-zen-ink flex flex-col relative">
      {/* Top Header - Minimalist */}
      <header className="px-6 py-6 flex justify-between items-center sticky top-0 bg-zen-paper/90 backdrop-blur-sm z-20 border-b border-transparent transition-colors duration-300">
        <div className="flex flex-col">
            <h1 className="font-serif text-xl font-bold tracking-tight text-zen-ink">MUSHA SHUGYO</h1>
            <span className="text-[10px] uppercase tracking-[0.2em] text-zen-mist font-ui">The Warrior's Pilgrimage</span>
        </div>
        <div className="w-8 h-8 rounded-full border border-zen-stone flex items-center justify-center opacity-50">
           {/* Placeholder for a minimal user mon/crest if needed */}
           <div className="w-2 h-2 bg-zen-red rounded-full"></div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-32 px-6 pt-4 max-w-md mx-auto w-full relative z-10">
        {children}
      </main>

      {/* Bottom Nav - Floating Ink Style */}
      <nav className="fixed bottom-6 left-6 right-6 z-30 max-w-md mx-auto">
        <div className="bg-zen-ink/5 backdrop-blur-md border border-white/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] px-6 py-4 flex justify-between items-center">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 transition-all duration-500 ${
                  isActive ? 'text-zen-red -translate-y-1' : 'text-zen-mist hover:text-zen-ink'
                }`}
              >
                <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                    {item.icon}
                </div>
                <span className={`text-[9px] uppercase tracking-widest font-ui font-medium transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                    {item.label}
                </span>
                {/* Active Dot (Sun) */}
                {isActive && <div className="w-1 h-1 bg-zen-red rounded-full mt-1 animate-pulse"></div>}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};