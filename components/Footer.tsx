
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Sponsor } from '../types';

const Footer: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);

  useEffect(() => {
    const fetchSponsors = async () => {
      const { data } = await supabase.from('sponsors').select('*').order('name');
      if (data) setSponsors(data);
    };
    fetchSponsors();
  }, []);

  // Triplicamos os itens para garantir que o scroll infinito não tenha gaps
  const scrollItems = [...sponsors, ...sponsors, ...sponsors];

  const getCardTheme = (index: number) => {
    const themes = [
      'bg-black border-primary shadow-[6px_6px_0_0_#FFD700]', // Preto com Amarelo
      'bg-primary border-black shadow-[6px_6px_0_0_#000]',    // Amarelo com Preto
      'bg-white border-black shadow-[6px_6px_0_0_#FFD700]',   // Branco com Preto
    ];
    return themes[index % themes.length];
  };

  return (
    <footer className="bg-white text-black border-t-[12px] border-black">
      {/* Dynamic Marquee Section */}
      <div className="py-20 bg-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="flex items-center gap-4">
             <h3 className="font-black text-3xl uppercase italic tracking-tighter">Nossos Parceiros</h3>
             <div className="h-1 flex-1 bg-black"></div>
          </div>
        </div>

        <div className="relative flex whitespace-nowrap overflow-hidden">
          <div className="flex animate-scroll hover:pause gap-12 px-6">
            {scrollItems.length > 0 ? scrollItems.map((sponsor, idx) => (
              <div 
                key={`${sponsor.id}-${idx}`} 
                className={`min-w-[280px] h-32 p-6 border-4 flex items-center justify-center transition-transform hover:scale-105 ${getCardTheme(idx)}`}
              >
                <img 
                  src={sponsor.logo_url} 
                  className={`max-h-full max-w-full object-contain ${idx % 3 === 0 ? 'brightness-0 invert' : ''}`} 
                  alt={sponsor.name} 
                />
              </div>
            )) : (
              [1,2,3,4,5].map(i => (
                <div key={i} className="min-w-[280px] h-32 border-4 border-dashed border-zinc-200 bg-zinc-50 flex items-center justify-center font-black uppercase italic text-zinc-300">Espaço Disponível</div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Corporate Info */}
      <div className="bg-black text-white py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-6">
            <div className="size-16 bg-primary flex items-center justify-center border-4 border-white rotate-6">
              <span className="material-symbols-outlined text-black font-black text-4xl italic">sports_soccer</span>
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">Copa Serra Dourada</h2>
              <p className="text-primary font-bold text-xs uppercase tracking-[0.2em]">Onde nascem as lendas do interior</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-6">
            <div className="flex gap-4">
              {['facebook', 'instagram', 'youtube'].map(social => (
                <button key={social} className="size-12 border-2 border-white/20 flex items-center justify-center hover:bg-primary hover:text-black transition-all">
                  <span className="material-symbols-outlined">share</span>
                </button>
              ))}
            </div>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">© 2024 • Portal Oficial • Gestão de Torneios</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
