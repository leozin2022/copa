
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { SelectionRecord } from '../types';

const SelectionPage: React.FC = () => {
  const [selections, setSelections] = useState<SelectionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSelections = async () => {
      setLoading(true);
      const { data } = await supabase.from('selections').select('*').order('created_at', { ascending: false });
      if (data) setSelections(data);
      setLoading(false);
    };
    fetchSelections();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin size-12 border-4 border-black border-t-primary"></div>
    </div>
  );

  const currentSelection = selections[0];
  const history = selections.slice(1);

  return (
    <div className="bg-zinc-50 min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b-8 border-black pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-black uppercase text-sm tracking-widest bg-black px-3 py-1 inline-block italic">
              DESTAQUE DA SEMANA
            </div>
            <h2 className="text-6xl font-black italic uppercase leading-none">{currentSelection?.round || 'Seleção da Rodada'}</h2>
            <p className="text-zinc-500 font-bold max-w-lg uppercase text-xs">Os melhores atletas que brilharam nos gramados da Serra Dourada.</p>
          </div>
        </header>

        {currentSelection ? (
          <div className="relative w-full aspect-[4/3] md:aspect-[16/9] bg-green-900 rounded-3xl border-[6px] border-black shadow-2xl overflow-hidden mb-24">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'repeating-linear-gradient(90deg, #14532d, #14532d 50px, #064e3b 50px, #064e3b 100px)' }}></div>
            <div className="absolute inset-4 border-2 border-white/20 pointer-events-none rounded-sm">
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-white/40"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-32 md:size-48 border-2 border-white/40 rounded-full"></div>
            </div>

            <div className="relative h-full w-full p-8 flex flex-wrap justify-center items-center gap-4 md:gap-8">
              {currentSelection.players.map((p, idx) => (
                <div key={idx} className="group flex flex-col items-center transition-transform hover:scale-110">
                  <div className="size-14 md:size-20 rounded-full border-4 border-primary bg-black overflow-hidden shadow-2xl">
                    <img src={p.photo_url} alt={p.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0" />
                  </div>
                  <div className="mt-2 bg-black text-white px-2 py-0.5 rounded text-[8px] md:text-[10px] font-black border border-primary uppercase italic shadow-lg">
                    {p.name || '---'} ({p.position})
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-20 text-center border-4 border-dashed border-zinc-200 uppercase font-black italic text-zinc-300">Nenhuma seleção publicada ainda.</div>
        )}

        {history.length > 0 && (
          <div className="space-y-12">
            <h3 className="text-3xl font-black uppercase italic border-l-8 border-black pl-6">Histórico de Seleções</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {history.map((sel) => (
                <div key={sel.id} className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_0_#000]">
                  <div className="flex justify-between items-center mb-4 border-b-2 border-black pb-2">
                    <span className="font-black uppercase italic text-xl">{sel.round}</span>
                    <span className="text-[10px] font-bold opacity-40">{new Date(sel.created_at!).toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sel.players.slice(0, 5).map((p, i) => (
                      <div key={i} className="size-8 rounded-full border-2 border-black overflow-hidden bg-zinc-100">
                        <img src={p.photo_url} className="w-full h-full object-cover" />
                      </div>
                    ))}
                    <div className="size-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black">+6</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectionPage;
