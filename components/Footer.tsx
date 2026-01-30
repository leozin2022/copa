
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';

const Footer: React.FC = () => {
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [logo, setLogo] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: spData } = await supabase.from('sponsors').select('*').order('name');
      const { data: stData } = await supabase.from('site_settings').select('footer_logo_url').limit(1).maybeSingle();
      
      if (spData) {
        const validSponsors = spData.filter(s => s.logo_url && s.logo_url !== 'EMPTY' && s.logo_url !== '');
        setSponsors(validSponsors);
      }
      if (stData?.footer_logo_url) setLogo(stData.footer_logo_url);
    };
    fetchData();
  }, []);

  const scrollItems = sponsors.length > 0 ? [...sponsors, ...sponsors, ...sponsors, ...sponsors] : [];

  return (
    <footer className="bg-white text-black border-t-[12px] border-black">
      <div className="py-24 bg-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <div className="flex items-center gap-6">
             <h3 className="font-black text-4xl uppercase italic tracking-tighter whitespace-nowrap">
               Patrocinadores <span className="text-primary bg-black px-2 not-italic">Oficiais</span>
             </h3>
             <div className="h-2 flex-1 bg-black"></div>
          </div>
        </div>

        <div className="relative flex whitespace-nowrap overflow-hidden py-10">
          <div className="flex animate-scroll hover:pause gap-16 px-8 items-center">
            {scrollItems.length > 0 ? scrollItems.map((sponsor, idx) => (
              <div 
                key={`${sponsor.id}-${idx}`} 
                className={`
                  pulse-card min-w-[300px] h-36 p-8 bg-white border-8 flex items-center justify-center transition-all
                  ${idx % 2 === 0 ? 'border-black' : 'border-[#CCAC00]'}
                  shadow-[10px_10px_0_0_#000]
                `}
              >
                <img src={sponsor.logo_url} className="max-h-full max-w-full object-contain" alt={sponsor.name} />
              </div>
            )) : (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="min-w-[300px] h-36 border-8 border-dashed border-zinc-200 bg-zinc-50 flex items-center justify-center font-black uppercase italic text-zinc-300">
                  Espaço para Parceiro
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-black text-white py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-6">
            {logo ? (
              <img src={logo} className="h-20 w-auto object-contain" alt="Logo Footer" />
            ) : (
              <div className="size-16 bg-primary flex items-center justify-center border-4 border-white rotate-6">
                <span className="material-symbols-outlined text-black font-black text-4xl italic">sports_soccer</span>
              </div>
            )}
            <div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">Copa Serra Dourada</h2>
              <p className="text-primary font-bold text-xs uppercase tracking-[0.1em]">Onde o futebol raiz do interior e a tradição se encontram</p>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">@1982 - Portal Oficial da Copa Serra Dourada</p>
            <div className="flex gap-4">
               <span className="material-symbols-outlined text-primary text-sm">verified</span>
               <span className="material-symbols-outlined text-primary text-sm">shield</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
