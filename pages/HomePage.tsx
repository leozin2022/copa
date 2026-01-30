
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { SliderSettings, LocationSettings, Match, Broadcast } from '../types';

const HomePage: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const [allTeams, setAllTeams] = useState<any[]>([]);
  const [matchesFeed, setMatchesFeed] = useState<any[]>([]);
  const [activeBroadcast, setActiveBroadcast] = useState<Broadcast | null>(null);
  const [sliderData, setSliderData] = useState<SliderSettings | null>(null);
  const [locationData, setLocationData] = useState<LocationSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: tData } = await supabase.from('teams').select('*').order('points', { ascending: false });
        
        const { data: mData } = await supabase.from('matches').select('*, Mandante:home_team_id(name, logo_url), Visitante:away_team_id(name, logo_url)');
        
        const { data: bData } = await supabase.from('broadcasts').select('*').eq('is_active', true).limit(1).maybeSingle();

        if (mData) {
          const sortedMatches = [...mData].sort((a, b) => {
            const priority = { 'live': 0, 'scheduled': 1, 'finished': 2 };
            if (priority[a.status] !== priority[b.status]) {
              return priority[a.status] - priority[b.status];
            }
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          });
          setMatchesFeed(sortedMatches);
        }

        const { data: slData } = await supabase.from('slider_settings').select('*').limit(1).maybeSingle();
        const { data: lcData } = await supabase.from('location_settings').select('*').limit(1).maybeSingle();
        
        if (tData) setAllTeams(tData);
        if (bData) setActiveBroadcast(bData);
        if (slData) setSliderData(slData);
        if (lcData) setLocationData(lcData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderTable = (group: 'A' | 'B') => {
    const groupTeams = allTeams.filter(t => t.group === group);
    return (
      <div className="border-4 border-black shadow-[10px_10px_0_0_#000] overflow-hidden bg-white">
        <div className="bg-black text-white p-4 flex justify-between items-center">
          <h3 className="text-xl font-black uppercase italic">GRUPO {group}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-primary border-b-2 border-black text-[9px] font-black uppercase tracking-widest text-black">
                <th className="p-3 w-12">Pos</th>
                <th className="p-3">Time</th>
                <th className="p-3 text-center">P</th>
                <th className="p-3 text-center">J</th>
              </tr>
            </thead>
            <tbody className="font-black text-xs">
              {groupTeams.length > 0 ? groupTeams.map((team, idx) => (
                <tr key={team.id} className="border-b border-zinc-100">
                  <td className="p-3 font-black italic text-sm">{idx + 1}</td>
                  <td className="p-3 flex items-center gap-2 uppercase">
                    <img src={team.logo_url} className="size-6 object-contain" alt="" />
                    {team.name}
                  </td>
                  <td className="p-3 text-center text-sm">{team.points}</td>
                  <td className="p-3 text-center text-zinc-400">{team.played}</td>
                </tr>
              )) : (
                <tr>
                    <td colSpan={4} className="p-10 text-center opacity-30 italic">Sem dados registrados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white overflow-hidden font-display">
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-black">
            <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter uppercase">
              Desde 1982, de geração em geração, <br /> 
              <span className="text-primary italic">o mais tradicional da região</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed font-bold uppercase">
              Onde o futebol raiz do interior e a tradição se encontram
            </p>
          </div>
          
          <div className="relative group aspect-[16/10] border-8 border-black shadow-2xl overflow-hidden bg-zinc-200 cursor-ew-resize select-none">
            {sliderData ? (
              <>
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${sliderData.after_image_url}')` }}>
                  <div className="absolute top-2 right-2 bg-black text-primary px-2 py-0.5 font-black uppercase italic border border-primary z-20 text-[10px] shadow-md">Em Geração</div>
                </div>
                <div className="absolute inset-0 bg-cover bg-center z-10 transition-all" style={{ backgroundImage: `url('${sliderData.before_image_url}')`, clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
                  <div className="absolute top-2 left-2 bg-primary text-black px-2 py-0.5 font-black uppercase italic border border-black z-20 text-[10px] shadow-md">De Geração</div>
                </div>
                <div className="absolute inset-y-0 z-20 w-1.5 bg-primary shadow-[0_0_15px_rgba(255,215,0,0.5)] flex items-center justify-center" style={{ left: `${sliderPos}%` }}>
                  <div className="size-8 bg-black border-2 border-primary rounded-full flex items-center justify-center shadow-xl">
                    <span className="material-symbols-outlined text-primary text-[10px] font-black">unfold_more</span>
                  </div>
                </div>
                <input type="range" min="0" max="100" value={sliderPos} onChange={(e) => setSliderPos(Number(e.target.value))} className="absolute inset-0 opacity-0 cursor-ew-resize z-40 w-full h-full" />
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-400 font-black uppercase italic">Slider não configurado</div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-zinc-50 py-16 border-y-4 border-black/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-6 mb-8">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter shrink-0">Jogos e <span className="text-primary bg-black px-3 not-italic">Resultados</span></h2>
            <div className="h-1 flex-1 bg-black/10"></div>
          </div>

          {/* Banner de Transmissão Ativa - Atualizado com Capa Visual */}
          {activeBroadcast && (
            <div className="mb-12 relative border-4 border-black shadow-[10px_10px_0_0_#000] overflow-hidden group">
               {/* Background Cover */}
               <div className="absolute inset-0 z-0">
                  {activeBroadcast.cover_url ? (
                    <img src={activeBroadcast.cover_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Capa Live" />
                  ) : (
                    <div className="w-full h-full bg-black"></div>
                  )}
                  {/* Gradient Overlay for Text Visibility */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
               </div>

               <div className="relative z-10 p-8 flex flex-col md:flex-row items-center justify-between gap-6 min-h-[200px]">
                  <div className="flex items-center gap-6">
                    <div className="size-20 bg-primary border-4 border-black flex items-center justify-center shrink-0 rotate-3 shadow-xl">
                      <span className="material-symbols-outlined text-black text-5xl animate-pulse">live_tv</span>
                    </div>
                    <div className="text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-red-600 px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase">AO VIVO</span>
                        <span className="text-primary font-black uppercase text-[10px] italic">{activeBroadcast.location || 'BAIXA DO MEL'}</span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-black uppercase italic leading-none tracking-tighter mb-2">{activeBroadcast.title}</h3>
                      <div className="backdrop-blur-md bg-white/10 border border-white/20 p-3 rounded-sm inline-block">
                        <p className="text-xs font-black uppercase tracking-widest">
                          <span className="text-primary">{activeBroadcast.team_a}</span> 
                          <span className="mx-2 opacity-40">X</span> 
                          <span className="text-primary">{activeBroadcast.team_b}</span>
                        </p>
                        <p className="text-[9px] font-bold text-white/60 uppercase mt-1">Sintonize agora: {activeBroadcast.narration}</p>
                      </div>
                    </div>
                  </div>
                  <a 
                    href={activeBroadcast.youtube_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bee-btn-black !bg-primary !text-black !border-black hover:!bg-white !px-10 !h-16 shrink-0 group shadow-2xl"
                  >
                    ASSISTIR NO YOUTUBE
                    <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">play_circle</span>
                  </a>
               </div>
            </div>
          )}
          
          <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide px-2">
            {matchesFeed.length > 0 ? matchesFeed.map((match) => (
              <div 
                key={match.id} 
                className={`
                  min-w-[420px] bg-white border-4 border-black p-4 shadow-[6px_6px_0_0_#000] flex flex-col gap-3 relative transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none
                  ${match.status === 'live' ? 'ring-4 ring-red-500 ring-offset-4 ring-offset-zinc-50' : ''}
                `}
              >
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-zinc-100 pb-2">
                  <div className="flex items-center gap-2">
                    {match.status === 'live' && <span className="size-2 bg-red-600 rounded-full animate-pulse"></span>}
                    {match.status === 'live' ? 'AO VIVO AGORA' : match.date}
                  </div>
                  <span>{match.location || 'BAIXA DO MEL'}</span>
                </div>
                
                <div className="flex items-center justify-between gap-4 py-2">
                  <div className="flex flex-col items-center gap-1.5 flex-[2] overflow-hidden">
                    <img src={match.Mandante?.logo_url} className="size-10 object-contain" alt="" />
                    <span className="text-[10px] font-black uppercase truncate w-full text-center leading-none">{match.Mandante?.name}</span>
                  </div>
                  
                  <div className="flex flex-col items-center flex-1">
                    <div className="bg-black text-primary px-4 py-2 font-black text-xl flex items-center gap-3 border-2 border-black min-w-[100px] justify-center">
                      {match.status === 'scheduled' ? (
                        <span className="text-sm tracking-widest">{match.time}</span>
                      ) : (
                        <>
                          <span>{match.home_score}</span>
                          <span className="text-xs opacity-50">X</span>
                          <span>{match.away_score}</span>
                        </>
                      )}
                    </div>
                    {match.status === 'finished' && (
                      <span className="text-[8px] font-black uppercase text-zinc-400 mt-1 italic tracking-widest">Encerrado</span>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-1.5 flex-[2] overflow-hidden">
                    <img src={match.Visitante?.logo_url} className="size-10 object-contain" alt="" />
                    <span className="text-[10px] font-black uppercase truncate w-full text-center leading-none">{match.Visitante?.name}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="w-full py-12 text-center border-4 border-dashed border-zinc-200 text-zinc-300 font-black uppercase italic">
                Nenhuma partida registrada no sistema
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="tabela" className="max-w-7xl mx-auto px-6 py-20 bg-white">
        <div className="mb-12 border-l-8 border-black pl-8 text-black">
          <h2 className="text-5xl font-black uppercase italic tracking-tighter">Classificação</h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-12">
          {renderTable('A')}
          {renderTable('B')}
        </div>
      </section>

      <section className="bg-black text-white py-24">
         <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 relative">
               <div className="absolute -top-4 -left-4 w-full h-full border-4 border-primary"></div>
               <div className="relative border-4 border-white aspect-video overflow-hidden">
                  {locationData?.image_url ? (
                    <img src={locationData.image_url} className="w-full h-full object-cover" alt="Estádio" />
                  ) : (
                    <div className="bg-zinc-800 w-full h-full flex items-center justify-center italic text-zinc-500">Foto do Estádio</div>
                  )}
               </div>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
               <h2 className="text-6xl font-black italic uppercase tracking-tighter">Chegue até <span className="text-primary">nós.</span></h2>
               <p className="text-white/60 text-lg uppercase font-bold">{locationData?.stadium_name || 'Estádio Serra Dourada'}</p>
               <p className="text-white/40 max-w-md">Clique no botão abaixo e cheguei até nós, desde 1982 o mais antigo e tradicional da região 🌵☀️</p>
               {locationData?.map_url && (
                 <a href={locationData.map_url} target="_blank" rel="noopener noreferrer" className="inline-flex bee-btn-black !bg-primary !text-black !border-primary hover:!bg-white hover:!border-white group">
                    <span className="material-symbols-outlined group-hover:rotate-12 transition-transform">map</span>
                    CALCULAR ROTA AGORA
                 </a>
               )}
            </div>
         </div>
      </section>
    </div>
  );
};

export default HomePage;
