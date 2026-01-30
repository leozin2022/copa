
import React from 'react';

const Footer: React.FC = () => {
  const sponsors = [
    'AGRO-MIL', 'GOIÁS-TRATORES', 'SEED-MAX', 'BATERIAS-FORÇA', 'VALE-ALIMENTOS', 'ARENA-BET'
  ];

  return (
    <footer className="bg-black text-white border-t-8 border-yellow-500">
      <div className="py-8 bg-black">
        <p className="text-center font-black text-white/40 uppercase tracking-[0.4em] text-xs mb-6">Patrocinadores Oficiais</p>
        <div className="relative overflow-hidden whitespace-nowrap">
          <div className="flex animate-scroll gap-12 px-6">
            {[...sponsors, ...sponsors].map((sponsor, idx) => (
              <div key={idx} className="bg-white text-black px-8 py-4 font-black text-2xl border-4 border-black hover:bg-yellow-500 transition-all rotate-1 cursor-pointer">
                {sponsor}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/10">
        <div className="flex items-center gap-4">
          <div className="size-12 bg-yellow-500 flex items-center justify-center border-2 border-white">
            <span className="material-symbols-outlined text-black font-black text-3xl">sports_soccer</span>
          </div>
          <div>
            <h2 className="text-xl font-black uppercase italic leading-none">Copa Serra Dourada</h2>
            <p className="text-white/40 text-[10px] font-bold uppercase mt-1 tracking-widest">O maior campeonato rural do estado</p>
          </div>
        </div>
        <p className="text-white/50 text-xs font-black uppercase tracking-widest text-center md:text-left">
          © 2024 Copa Serra Dourada. Todos os direitos reservados.
        </p>
        <div className="flex gap-4">
          <button className="size-10 bg-zinc-900 border border-white/20 flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all">
            <span className="material-symbols-outlined">share</span>
          </button>
          <button className="size-10 bg-zinc-900 border border-white/20 flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all">
            <span className="material-symbols-outlined">mail</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
