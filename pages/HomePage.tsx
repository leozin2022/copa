
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(50);

  const matches = [
    {
      id: 1,
      time: 'Ontem • 15:00',
      status: 'FINALIZADO',
      team1: { name: 'Independente', color: 'blue' },
      team2: { name: 'Goiás Rural', color: 'red' },
      score: '2 - 1',
      scorers: '⚽ J. Santos 22\' | ⚽ M. Lima 88\''
    },
    {
      id: 2,
      time: 'Hoje • 16:30',
      status: 'EM BREVE',
      isFeatured: true,
      team1: { name: 'União FC', color: 'slate' },
      team2: { name: 'Serraria', color: 'yellow' },
      score: 'VS'
    },
    {
      id: 3,
      time: 'Amanhã • 09:00',
      status: 'PROGRAMADO',
      team1: { name: 'Cruzeiro', color: 'slate' },
      team2: { name: 'Real Matuto', color: 'slate' },
      score: 'VS',
      location: 'ESTÁDIO BOM JESUS'
    }
  ];

  return (
    <div className="bg-pitch-texture">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 md:py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-black tracking-widest uppercase italic">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              Temporada 2024 • Edição Especial
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter uppercase">
              TRADIÇÃO QUE <br /> 
              <span className="text-primary italic">FAZ HISTÓRIA.</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-lg leading-relaxed font-medium">
              O coração do futebol rural bate aqui. Acompanhe a evolução do campeonato que une a nossa região em torno da paixão pela bola.
            </p>
            <div className="flex flex-wrap gap-6 pt-4">
              <Link to="/classificacao" className="bg-primary text-background-dark px-10 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all flex items-center gap-3 shadow-[0_10px_30px_rgba(242,185,13,0.3)]">
                VER TABELA COMPLETA
                <span className="material-symbols-outlined font-black">leaderboard</span>
              </Link>
              <button className="bg-white/5 border border-white/10 hover:bg-white/10 px-10 py-5 rounded-2xl font-bold text-xl transition-all">
                Próximos Jogos
              </button>
            </div>
          </div>

          {/* Before/After Slider */}
          <div className="relative group aspect-[16/10] rounded-3xl overflow-hidden border-4 border-white/5 shadow-2xl">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200')" }}></div>
            <div 
              className="absolute inset-y-0 left-0 bg-cover bg-center border-r-4 border-primary z-10 grayscale brightness-50 transition-none" 
              style={{ 
                backgroundImage: "url('https://images.unsplash.com/photo-1518091043644-c1d445bcc97a?auto=format&fit=crop&q=80&w=1200')",
                width: `${sliderPos}%`
              }}
            ></div>
            <input 
              type="range" 
              min="0" max="100" 
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute inset-x-0 bottom-0 opacity-0 cursor-ew-resize h-full w-full z-30"
            />
            <div className="absolute top-1/2 -translate-y-1/2 z-20 pointer-events-none" style={{ left: `${sliderPos}%` }}>
              <div className="bg-primary size-14 -ml-7 rounded-full flex items-center justify-center text-background-dark shadow-[0_0_40px_rgba(242,185,13,0.8)] border-4 border-background-dark">
                <span className="material-symbols-outlined font-black text-3xl">unfold_more</span>
              </div>
            </div>
            <div className="absolute bottom-6 right-6 bg-background-dark/80 backdrop-blur-md px-6 py-2.5 rounded-xl text-xs font-black tracking-widest text-white z-20 uppercase italic border border-white/10">
              DESLIZE PARA COMPARAR A HISTÓRIA
            </div>
          </div>
        </div>
      </section>

      {/* Live Now Banner */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-primary p-[2px] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(220,38,38,0.2)]">
          <div className="bg-background-dark p-8 rounded-[calc(1.5rem-1px)] flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-8">
              <div className="relative w-56 aspect-video rounded-2xl overflow-hidden bg-slate-800 border-2 border-white/5">
                <img alt="Live Stream" className="w-full h-full object-cover opacity-60" src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-white opacity-90 animate-pulse">play_circle</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-red-600 text-[10px] font-black px-3 py-1 rounded-full text-white tracking-widest uppercase">AO VIVO</span>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-widest">
                    <span className="size-2 bg-red-600 rounded-full animate-pulse"></span>
                    Narração de Carlos Mendes
                  </div>
                </div>
                <h3 className="text-3xl font-black uppercase italic leading-none">Vila Nova FC vs Juventude Rural</h3>
                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Estádio Municipal de Serra Dourada • 2º Tempo</p>
              </div>
            </div>
            <div className="flex items-center gap-10 w-full md:w-auto border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-10">
              <div className="text-center">
                <div className="text-4xl font-black text-white leading-none">1.4k</div>
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Espectadores</div>
              </div>
              <button className="flex-1 md:flex-none bg-white text-background-dark font-black px-10 py-4 rounded-2xl hover:bg-primary hover:text-background-dark transition-all text-lg shadow-xl uppercase italic">
                ABRIR NO YOUTUBE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Champion Spotlight */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-3 gap-16 items-center">
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-primary font-black italic tracking-tighter text-4xl uppercase leading-none">
            O Time a ser <br /> 
            <span className="text-white text-7xl">BATIDO</span>
          </h2>
          <p className="text-xl text-slate-400 leading-relaxed font-medium">
            O Esporte Clube Serraria defende o título pelo segundo ano consecutivo. Com uma defesa sólida e o artilheiro do campeonato, eles são os favoritos da temporada.
          </p>
          <div className="grid grid-cols-1 gap-4 pt-4">
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl">
              <span className="material-symbols-outlined text-primary text-3xl">trophy</span>
              <span className="text-lg font-black uppercase italic">Bi-Campeão (2022-2023)</span>
            </div>
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl">
              <span className="material-symbols-outlined text-primary text-3xl">military_tech</span>
              <span className="text-lg font-black uppercase italic">12 Vitórias Invictas</span>
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="relative rounded-[2.5rem] overflow-hidden group border-4 border-white/10">
            <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-transparent to-transparent z-10"></div>
            <img alt="Current Champion" className="w-full aspect-[21/10] object-cover transition-transform duration-[2s] group-hover:scale-110" src="https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&q=80&w=1200" />
            <div className="absolute bottom-10 left-10 z-20">
              <div className="text-primary font-black text-8xl italic leading-none tracking-tighter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">SERRARIA FC</div>
              <div className="text-white font-black text-2xl uppercase tracking-widest mt-2 flex items-center gap-3">
                <span className="w-12 h-1 bg-primary"></span>
                ATUAL CAMPEÃO DA COPA
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Match Day Timeline */}
      <section className="bg-accent-green/20 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-16">
            <div className="space-y-2">
              <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter">Próximas <span className="text-primary italic">Batalhas</span></h2>
              <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-sm">Rodada 8 • Fase de Grupos • Temporada 2024</p>
            </div>
            <div className="hidden md:flex gap-3">
              <button className="size-14 rounded-2xl bg-background-dark border border-white/10 flex items-center justify-center hover:bg-primary transition-all group">
                <span className="material-symbols-outlined text-white group-hover:text-background-dark font-black">chevron_left</span>
              </button>
              <button className="size-14 rounded-2xl bg-background-dark border border-white/10 flex items-center justify-center hover:bg-primary transition-all group">
                <span className="material-symbols-outlined text-white group-hover:text-background-dark font-black">chevron_right</span>
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {matches.map((match) => (
              <div key={match.id} className={`bg-background-dark/60 backdrop-blur-md border rounded-3xl p-8 transition-all hover:scale-[1.02] ${match.isFeatured ? 'border-primary ring-4 ring-primary/20' : 'border-white/5'}`}>
                {match.isFeatured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-background-dark text-[10px] font-black px-6 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-xl">
                    DESTAQUE DA RODADA
                  </div>
                )}
                <div className="flex justify-between items-center mb-10">
                  <span className={`text-xs font-black uppercase tracking-widest ${match.isFeatured ? 'text-primary' : 'text-slate-500'}`}>{match.time}</span>
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${match.isFeatured ? 'bg-primary/20 text-primary animate-pulse' : 'bg-white/5 text-slate-400'}`}>
                    {match.status}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-6 mb-10">
                  <div className="flex flex-col items-center gap-4 flex-1">
                    <div className={`size-20 rounded-2xl bg-slate-800/50 flex items-center justify-center border-2 ${match.team1.color === 'blue' ? 'border-blue-500/30' : 'border-white/10'}`}>
                      <span className={`material-symbols-outlined text-4xl ${match.team1.color === 'blue' ? 'text-blue-400' : 'text-slate-400'}`}>shield</span>
                    </div>
                    <span className="text-xs font-black uppercase tracking-tighter text-center">{match.team1.name}</span>
                  </div>
                  <div className={`text-5xl font-black italic tracking-tighter ${match.score === 'VS' ? 'text-slate-700' : 'text-white'}`}>
                    {match.score.split('-').map((s, i) => (
                      <span key={i}>{s}{i === 0 && match.score !== 'VS' ? <span className="text-primary mx-1">-</span> : ''}</span>
                    ))}
                  </div>
                  <div className="flex flex-col items-center gap-4 flex-1">
                    <div className={`size-20 rounded-2xl bg-slate-800/50 flex items-center justify-center border-2 ${match.team2.color === 'red' ? 'border-red-500/30' : match.team2.color === 'yellow' ? 'border-primary/30' : 'border-white/10'}`}>
                      <span className={`material-symbols-outlined text-4xl ${match.team2.color === 'red' ? 'text-red-400' : match.team2.color === 'yellow' ? 'text-primary' : 'text-slate-400'}`}>shield</span>
                    </div>
                    <span className="text-xs font-black uppercase tracking-tighter text-center">{match.team2.name}</span>
                  </div>
                </div>
                {match.scorers && (
                  <div className="border-t border-white/5 pt-6 text-[10px] font-black uppercase text-slate-500 tracking-widest text-center leading-relaxed italic">
                    {match.scorers}
                  </div>
                )}
                {match.isFeatured && (
                  <button className="w-full py-4 rounded-2xl bg-primary text-background-dark font-black text-xs uppercase tracking-widest italic hover:bg-white transition-all shadow-xl">
                    LEMBRETE DA PARTIDA
                  </button>
                )}
                {match.location && (
                  <div className="text-center text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mt-2">
                    {match.location}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Get to Us Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="bg-accent-green rounded-[3rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl border-4 border-white/5">
          <div className="lg:w-1/2 p-16 space-y-10">
            <div>
              <h2 className="text-5xl font-black uppercase tracking-tighter mb-4">Como <span className="text-primary italic">Chegar?</span></h2>
              <p className="text-xl text-slate-300 font-medium leading-relaxed">Nossa arena está localizada no coração da Serra. Estradas asfaltadas até a entrada principal com amplo estacionamento para torcedores.</p>
            </div>
            <div className="space-y-6">
              <div className="flex gap-6 items-start">
                <div className="size-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                  <span className="material-symbols-outlined text-primary text-3xl">location_on</span>
                </div>
                <div>
                  <h4 className="font-black uppercase italic text-xl">Arena Serra Dourada</h4>
                  <p className="text-sm text-slate-400 font-bold tracking-widest mt-1 uppercase">Fazenda Boa Vista, KM 45, Serra Dourada - GO</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="size-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                  <span className="material-symbols-outlined text-primary text-3xl">schedule</span>
                </div>
                <div>
                  <h4 className="font-black uppercase italic text-xl">Horário de Funcionamento</h4>
                  <p className="text-sm text-slate-400 font-bold tracking-widest mt-1 uppercase">Sábados e Domingos das 08h às 19h</p>
                </div>
              </div>
            </div>
            <button className="bg-primary text-background-dark font-black px-10 py-5 rounded-2xl flex items-center gap-4 hover:shadow-[0_20px_40px_rgba(242,185,13,0.3)] transition-all text-xl italic uppercase">
              CALCULAR ROTA
              <span className="material-symbols-outlined font-black">directions_car</span>
            </button>
          </div>
          <div className="lg:w-1/2 h-96 lg:h-auto overflow-hidden grayscale contrast-125 hover:grayscale-0 transition-all duration-1000">
            <img alt="Map Location" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1544919982-b61976f0ba43?auto=format&fit=crop&q=80&w=1200" />
          </div>
        </div>
      </section>

      {/* Sponsors Carousel */}
      <section className="pb-24 overflow-hidden border-t-4 border-white/5 pt-12">
        <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
          <p className="text-xs font-black tracking-[0.4em] text-slate-600 uppercase">Empresas que fortalecem o esporte rural</p>
        </div>
        <div className="relative flex overflow-x-hidden group">
          <div className="py-12 whitespace-nowrap flex sponsor-scroll">
            <div className="flex items-center gap-32 px-16">
              {['AGRO-MIL', 'GOIÁS-TRATORES', 'SEED-MAX', 'BATERIAS-FORÇA', 'VALE-ALIMENTOS', 'ARENA-BET'].map((sponsor, i) => (
                <span key={i} className="text-4xl font-black text-white/10 hover:text-primary transition-all cursor-pointer uppercase italic tracking-tighter hover:scale-110">
                  {sponsor}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-32 px-16">
              {['AGRO-MIL', 'GOIÁS-TRATORES', 'SEED-MAX', 'BATERIAS-FORÇA', 'VALE-ALIMENTOS', 'ARENA-BET'].map((sponsor, i) => (
                <span key={i} className="text-4xl font-black text-white/10 hover:text-primary transition-all cursor-pointer uppercase italic tracking-tighter hover:scale-110">
                  {sponsor}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
