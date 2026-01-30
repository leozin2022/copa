
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../supabase';

const Header: React.FC = () => {
  const location = useLocation();
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      const { data } = await supabase.from('site_settings').select('header_logo_url').limit(1).maybeSingle();
      if (data?.header_logo_url) setLogo(data.header_logo_url);
    };
    fetchLogo();
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: 'Início', path: '/' },
    { label: 'Classificação', path: '/classificacao' },
    { label: 'Transmissões', path: '/transmissoes' },
    { label: 'Seleção', path: '/selecao' },
    { label: 'Galeria', path: '/galeria' },
    { label: 'Admin', path: '/admin' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-black text-white border-b-4 border-yellow-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          {logo ? (
            <img src={logo} className="h-14 w-auto object-contain" alt="Logo" />
          ) : (
            <div className="size-10 bg-yellow-500 flex items-center justify-center border-2 border-white rotate-3">
              <span className="material-symbols-outlined text-black font-black text-2xl">sports_soccer</span>
            </div>
          )}
          <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter">
            COPA SERRA <span className="text-yellow-500 italic">DOURADA</span>
          </h1>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`text-[10px] lg:text-xs font-black uppercase tracking-widest hover:text-yellow-500 transition-colors ${
                isActive(item.path) ? 'text-yellow-500 border-b-2 border-yellow-500' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="md:hidden">
            <span className="material-symbols-outlined text-yellow-500">menu</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
