
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-black text-white border-b-4 border-yellow-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="size-10 bg-yellow-500 flex items-center justify-center border-2 border-white rotate-3">
            <span className="material-symbols-outlined text-black font-black text-2xl">sports_soccer</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter">
            COPA SERRA <span className="text-yellow-500 italic">DOURADA</span>
          </h1>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: 'Início', path: '/' },
            { label: 'Classificação', path: '/classificacao' },
            { label: 'Transmissões', path: '/transmissoes' },
            { label: 'Seleção', path: '/selecao' },
            { label: 'Admin', path: '/admin' },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-black uppercase tracking-widest hover:text-yellow-500 transition-colors ${
                isActive(item.path) ? 'text-yellow-500 border-b-2 border-yellow-500' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button className="bg-yellow-500 hover:bg-white text-black px-6 py-2 border-2 border-black font-black text-sm transition-all uppercase italic shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
          ASSISTIR AO VIVO
        </button>
      </div>
    </header>
  );
};

export default Header;
