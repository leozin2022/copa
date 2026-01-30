
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { Broadcast, TournamentSettings, Match, Team } from '../types';

const HomePage: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const [broadcast, setBroadcast] = useState<Broadcast | null>(null);
  const [settings, setSettings] = useState<TournamentSettings | null>(null);
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: bData } = await supabase.from('broadcasts').select('*').eq('is_active', true).maybeSingle();
      const { data: sData } = await supabase.from('settings').select('*').single();
      const { data: mData } = await supabase.from('matches').select('*, home:home_team_id(name, logo_url), away:away_team_id(name, logo_url)').neq('status', 'finished').order('date').limit(4);
      
      const { data: tData } = await supabase.from('teams').select('*').order('points', { ascending: false }).order('wins', { ascending: false });
      
      if (bData) setBroadcast(bData);
      if (sData) setSettings(sData);
      if (mData) setUpcomingMatches(mData.map(m => ({
        ...m,
        home_team_name: m.home?.name,
        away_team_name: m.away?.name,
        home_logo: m.home?.logo_url,
        away_logo: m.away?.logo_url
      })));
      if (tData) setAllTeams(tData);
      setLoading(false);
    };

    fetchData();
  }, []);

  const renderTable = (group: 'A' | 'B') => {
    const groupTeams = allTeams.filter(t => t.group === group);
    return (
      <div className="border-4 border-black shadow-[10px_10px_0_0_#000] overflow-hidden bg-white">
        <div className="bg-black text-white p-4 flex justify-between items-center">
          <h3 className="text-xl font-black uppercase italic">GRUPO {group}</h3>
          <span className="text-primary font-black text-[10px] uppercase tracking-widest">Fase de Grupos</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-primary border-b-2 border-black text-[9px] font-black uppercase tracking-widest text-black">
                <th className="p-3 w-12">Pos</th>
                <th className="p-3">Time</th>
                <th className="p-3 text-center">P</th>
                <th className="p-3 text-center">J</th>
                <th className="p-3 text-center">SG</th>
              </tr>
            </thead>
            <tbody className="font-black text-xs">
              {groupTeams.map((team, idx) => {
                const sg = team.goals_for - team.goals_against;
                return (
                  <tr key={team.id} className={`border-b border-zinc-100 hover:bg-primary/10 ${idx < 2 ? 'bg-primary/5' : ''}`}>
                    <td className="p-3 font-black italic text-sm">{idx + 1}</td>
                    <td className="p-3 flex items-center gap-2">
                      <img src={team.logo_url} className="size-6 object-contain" alt="" />
                      <span className="truncate uppercase">{team.name}</span>
                    </td>
                    <td className="p-3 text-center text-sm">{team.points}</td>
                    <td className="p-3 text-center text-zinc-400">{team.played}</td>
                    <td className={`p-3 text-center ${sg > 0 ? 'text-green-600' : sg < 0 ? 'text-red-600' : 'text-zinc-400'}`}>
                      {sg > 0 ? `+${sg}` : sg}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white overflow-hidden font-display">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-black tracking-widest uppercase italic">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              Edição 2024 • Acompanhe Tudo
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter uppercase">
              O CAMPO É O <br /> 
              <span className="text-primary italic">NOSSO PALCO.</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-lg leading-relaxed font-medium">
              Resultados em tempo real, classificação atualizada e as melhores transmissões do campeonato rural.
            </p>
            <div className="flex flex-wrap gap-6 pt-4">
              <a href="#tabela" className="bg-primary text-black px-10 py-5 font-black text-xl hover:translate-x-1 hover:-translate-y-1 transition-all shadow-[8px_8px_0_0_#000] border-4 border-black uppercase italic">
                Ver Classificação
              </a>
            </div>
          </div>

          <div className="relative group aspect-[16/10] border-8 border-black shadow-2xl">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200')" }}></div>
            <div 
              className="absolute inset-y-0 left-0 bg-cover bg-center border-r-4 border-primary z-10 grayscale brightness-50" 
              style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1518091043644-c1d445bcc97a?auto=format&fit=crop&q=80&w=1200')",
                width: `${sliderPos}%`
              }}
            ></div>
            <input type="range" min="0" max="100" value={sliderPos} onChange={(e) => setSliderPos(Number(e.target.value))} className="absolute inset-x-0 bottom-0 opacity-0 cursor-ew-resize h-full w-full z-30" />
            <div className="absolute top-1/2 -translate-y-1/2 z-20 pointer-events-none" style={{ left: `${sliderPos}%` }}>
              <div className="bg-primary size-14 -ml-7 rounded-full flex items-center justify-center text-black border-4 border-black"><span className="material-symbols-outlined font-black text-3xl">unfold_more</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Weekend Matches Section (Updated to Full Width) */}
      <section className="max-w-7xl mx-auto px-6 py-20 bg-zinc-50 border-y-8 border-black">
         <div className="space-y-6">
            <div className="flex items-center justify-between border-b-4 border-black pb-4">
               <div className="flex items-center gap-3">
                 <span className="material-symbols-outlined font-black text-primary text-4xl">event_upcoming</span>
                 <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">Jogos do Fim de Semana</h2>
               </div>
               <span className="bg-black text-white px-4 py-1.5 text-xs font-black uppercase italic tracking-[0.2em] hidden sm:block">Matchday Schedule</span>
            </div>
             
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {upcomingMatches.length > 0 ? upcomingMatches.map(match => (
                  <div key={match.id} className="bg-white border-4 border-black p-6 shadow-[10px_10px_0_0_#000] hover:-translate-y-1 transition-all cursor-pointer group">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase mb-6 border-b border-zinc-100 pb-2">
                      <span className="bg-primary text-black px-2">{match.date}</span>
                      <span className="text-zinc-400">{match.time}</span>
                    </div>
                    <div className="flex items-center justify-around gap-2 mb-6">
                      <div className="text-center flex-1">
                        <img src={match.home_logo || 'https://via.placeholder.com/60'} className="size-12 mx-auto object-contain mb-2 group-hover:scale-110 transition-transform" />
                        <p className="font-black uppercase italic text-[10px] truncate">{match.home_team_name}</p>
                      </div>
                      <div className="text-lg font-black text-zinc-200">VS</div>
                      <div className="text-center flex-1">
                        <img src={match.away_logo || 'https://via.placeholder.com/60'} className="size-12 mx-auto object-contain mb-2 group-hover:scale-110 transition-transform" />
                        <p className="font-black uppercase italic text-[10px] truncate">{match.away_team_name}</p>
                      </div>
                    </div>
                    <button className="w-full h-10 bg-zinc-50 border-2 border-black text-black font-black uppercase text-[9px] group-hover:bg-primary transition-colors">Súmula</button>
                  </div>
                )) : (
                  <div className="col-span-full py-16 text-center border-4 border-dashed border-zinc-200 uppercase font-black italic text-zinc-300">
                    Aguardando definição da tabela...
                  </div>
                )}
            </div>
         </div>
      </section>

      {/* CLASSIFICAÇÃO COMPLETA (NO FEED) */}
      <section id="tabela" className="max-w-7xl mx-auto px-6 py-20 bg-white">
        <div className="mb-12 border-l-8 border-black pl-8">
          <h2 className="text-5xl font-black uppercase italic tracking-tighter">Classificação Oficial</h2>
          <p className="text-xl font-bold text-gray-400 uppercase">Fase de Grupos • Temporada 2024</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {renderTable('A')}
          {renderTable('B')}
        </div>
      </section>

      {/* Chegue até nós Section */}
      <section className="bg-black py-24 px-6 border-b-8 border-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#FFD700 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 z-10">
            <h2 className="text-6xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-[0.85]">
              CHEGUE <br /> ATÉ <span className="text-primary underline decoration-white decoration-4 underline-offset-8">NÓS.</span>
            </h2>
            <p className="text-xl text-white/60 font-medium leading-relaxed max-w-md">
              O palco da emoção está pronto para te receber no <span className="text-primary font-black uppercase">{settings?.stadium_name || 'Estádio Principal'}</span>.
            </p>
            <div className="flex flex-col gap-4">
               <a href={settings?.location_url || '#'} target="_blank" className="inline-flex items-center justify-center gap-4 bg-primary text-black font-black px-12 py-6 text-2xl hover:bg-white transition-all shadow-[0_20px_50px_rgba(255,215,0,0.3)] border-4 border-black uppercase italic group">
                 TRAÇAR ROTA NO GPS
                 <span className="material-symbols-outlined font-black group-hover:translate-x-2 transition-transform">near_me</span>
               </a>
            </div>
          </div>
          <div className="relative z-10">
             <div className="bg-zinc-900 border-8 border-primary shadow-[30px_30px_0_0_rgba(255,215,0,0.1)] aspect-video md:aspect-square flex items-center justify-center group">
                <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800')] bg-cover grayscale"></div>
                <div className="relative text-center p-12 bg-black/90 border-4 border-primary backdrop-blur-md">
                   <span className="material-symbols-outlined text-primary text-8xl mb-4 block animate-bounce">location_on</span>
                   <h4 className="text-white text-3xl font-black uppercase italic tracking-tighter">{settings?.stadium_name || 'CAMPO DA SERRA'}</h4>
                   <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mt-2">Ponto de Encontro Oficial</p>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
