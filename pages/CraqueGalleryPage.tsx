
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Craque } from '../types';

const CraqueGalleryPage: React.FC = () => {
  const [craques, setCraques] = useState<Craque[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRound, setActiveRound] = useState('Todas as Rodadas');

  const rounds = [
    'Todas as Rodadas', 
    'Rodada 01', 
    'Rodada 02', 
    'Rodada 03', 
    'Rodada 04', 
    'Quartas', 
    'Semi', 
    'Final'
  ];

  useEffect(() => {
    const fetchCraques = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('craques').select('*').order('created_at', { ascending: false });
      if (error) console.error('Error fetching craques:', error);
      else setCraques(data || []);
      setLoading(false);
    };
    fetchCraques();
  }, []);

  const filteredCraques = activeRound === 'Todas as Rodadas' 
    ? craques 
    : craques.filter(c => c.round === activeRound);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="size-20 border-8 border-black border-t-yellow-500 animate-spin mx-auto mb-4"></div>
          <p className="font-black uppercase italic tracking-widest">Carregando Galeria...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Heading */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16 border-b-8 border-black pb-8">
          <div className="space-y-4">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85]">
              GALERIA <span className="text-yellow-500 underline decoration-black decoration-8 underline-offset-8 italic">CRAQUES</span> <br /> DA PARTIDA
            </h2>
            <p className="text-zinc-500 font-black text-xs md:text-sm uppercase tracking-[0.3em]">Histórico oficial dos melhores em campo</p>
          </div>
          <div className="hidden md:block">
             <div className="bg-black text-yellow-500 px-6 py-4 font-black uppercase text-xs italic border-4 border-black">
                {filteredCraques.length} Craques Encontrados
             </div>
          </div>
        </div>

        {/* Round Selector */}
        <div className="mb-12 border-y-4 border-black py-6">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {rounds.map((round) => (
              <button 
                key={round}
                onClick={() => setActiveRound(round)}
                className={`px-8 py-3 rounded-full flex items-center gap-2 shrink-0 font-black uppercase text-xs transition-all border-2 border-black ${activeRound === round ? 'bg-black text-white' : 'bg-zinc-100 text-black hover:bg-yellow-500'}`}
              >
                {round}
              </button>
            ))}
          </div>
        </div>

        {/* Player Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
          {filteredCraques.length > 0 ? filteredCraques.map((craque, idx) => (
            <div 
              key={craque.id || idx} 
              className={`bg-yellow-500 border-4 border-black relative overflow-hidden group hover:-translate-y-2 transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}
            >
              <div className="absolute inset-0 pointer-events-none opacity-10" style={{ backgroundImage: 'radial-gradient(black 1px, transparent 0)', backgroundSize: '10px 10px' }}></div>
              <div className="p-2 bg-black text-white text-center font-black uppercase text-[10px] tracking-[0.2em] italic flex justify-between px-4">
                <span>Craque do Jogo</span>
                <span>{craque.round}</span>
              </div>
              <div className="w-full aspect-[4/5] bg-zinc-900 relative overflow-hidden border-b-4 border-black">
                <img 
                  src={craque.photo_url} 
                  alt={craque.name} 
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                />
                <div className="absolute bottom-0 left-0 bg-black text-yellow-500 px-4 py-1 font-black text-xl italic border-t-4 border-r-4 border-black">
                  {craque.position || 'ST'}
                </div>
              </div>
              <div className="p-6 flex flex-col gap-1 relative z-10 bg-yellow-500">
                <h3 className="text-3xl font-black leading-[0.85] uppercase italic break-words">{craque.name}</h3>
                <p className="text-[10px] font-black uppercase tracking-widest mt-2 text-black/60">{craque.team}</p>
                <div className="mt-4 pt-4 border-t-2 border-black/20">
                  <p className="text-[10px] font-black uppercase opacity-60">Destaque em:</p>
                  <p className="text-sm font-black uppercase italic">{craque.match_desc}</p>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 border-4 border-dashed border-zinc-200 text-center text-zinc-400 font-black uppercase italic">
              Nenhum craque registrado para "{activeRound}" ainda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CraqueGalleryPage;
