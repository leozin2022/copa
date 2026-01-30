
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Team, Match, Player, TournamentSettings, Sponsor, Craque, SelectionRecord, SelectionPlayer } from '../types';

const AdminPage: React.FC = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [password, setPassword] = useState('');
  const [activeSection, setActiveSection] = useState<'jogos' | 'artilharia' | 'campeonato' | 'craque' | 'selecao' | 'config' | 'sponsors' | 'classificacao'>('jogos');
  const [loading, setLoading] = useState(false);

  // Data States
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [craques, setCraques] = useState<Craque[]>([]);
  const [selections, setSelections] = useState<SelectionRecord[]>([]);
  const [settings, setSettings] = useState<TournamentSettings>({
    id: 'default', location_url: '', stadium_name: '', contact_email: '', is_registration_open: false
  });

  // Form States
  const [matchForm, setMatchForm] = useState<Partial<Match>>({
    home_team_id: '', away_team_id: '', date: '', time: '', location: '', group: 'A', status: 'scheduled', home_score: 0, away_score: 0
  });
  const [teamForm, setTeamForm] = useState<Partial<Team>>({
    name: '', logo_url: '', group: 'A', points: 0, played: 0, wins: 0, draws: 0, losses: 0, goals_for: 0, goals_against: 0
  });
  const [playerForm, setPlayerForm] = useState<Partial<Player>>({
    name: '', team_id: '', goals: 0, yellow_cards: 0, red_cards: 0
  });
  const [sponsorForm, setSponsorForm] = useState({ name: '', logo_url: '' });
  const [craqueForm, setCraqueForm] = useState<Craque>({ name: '', team: '', position: '', match_desc: '', photo_url: '', round: 'Rodada 01' });
  const [selectionForm, setSelectionForm] = useState<{ round: string, players: SelectionPlayer[] }>({
    round: 'Rodada 01',
    players: Array(11).fill(null).map(() => ({ name: '', team_name: '', photo_url: '', position: '' }))
  });

  const fetchData = async () => {
    setLoading(true);
    const { data: tData } = await supabase.from('teams').select('*').order('points', { ascending: false });
    const { data: mData } = await supabase.from('matches').select('*, home:home_team_id(name), away:away_team_id(name)').order('date', { ascending: false });
    const { data: pData } = await supabase.from('players').select('*, team:team_id(name)').order('goals', { ascending: false });
    const { data: spData } = await supabase.from('sponsors').select('*').order('created_at', { ascending: false });
    const { data: crData } = await supabase.from('craques').select('*').order('created_at', { ascending: false });
    const { data: selData } = await supabase.from('selections').select('*').order('created_at', { ascending: false });
    const { data: setts } = await supabase.from('settings').select('*').single();
    
    if (tData) setTeams(tData);
    if (mData) setMatches(mData.map(m => ({ ...m, home_team_name: m.home?.name, away_team_name: m.away?.name })));
    if (pData) setPlayers(pData.map(p => ({ ...p, team_name: p.team?.name })));
    if (spData) setSponsors(spData);
    if (crData) setCraques(crData);
    if (selData) setSelections(selData);
    if (setts) setSettings(setts);
    setLoading(false);
  };

  useEffect(() => {
    if (isLogged) fetchData();
  }, [isLogged]);

  // Actions
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => callback(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const saveTeam = async () => {
    if (!teamForm.name) return alert('Nome do time é obrigatório');
    setLoading(true);
    await supabase.from('teams').insert([teamForm]);
    setTeamForm({ name: '', logo_url: '', group: 'A', points: 0, played: 0, wins: 0, draws: 0, losses: 0, goals_for: 0, goals_against: 0 });
    fetchData();
  };

  const savePlayer = async () => {
    if (!playerForm.name || !playerForm.team_id) return alert('Preencha nome e time');
    setLoading(true);
    await supabase.from('players').insert([playerForm]);
    setPlayerForm({ name: '', team_id: '', goals: 0, yellow_cards: 0, red_cards: 0 });
    fetchData();
  };

  const saveMatch = async () => {
    if (!matchForm.home_team_id || !matchForm.away_team_id) return alert('Selecione os times');
    setLoading(true);
    await supabase.from('matches').insert([matchForm]);
    setMatchForm({ home_team_id: '', away_team_id: '', date: '', time: '', location: '', group: 'A', status: 'scheduled', home_score: 0, away_score: 0 });
    fetchData();
  };

  const saveSponsor = async () => {
    if (!sponsorForm.name || !sponsorForm.logo_url) return alert('Preencha nome e logo');
    setLoading(true);
    await supabase.from('sponsors').insert([sponsorForm]);
    setSponsorForm({ name: '', logo_url: '' });
    fetchData();
  };

  const saveCraque = async () => {
    if (!craqueForm.name || !craqueForm.photo_url) return alert('Preencha nome e foto');
    setLoading(true);
    await supabase.from('craques').insert([craqueForm]);
    setCraqueForm({ name: '', team: '', position: '', match_desc: '', photo_url: '', round: 'Rodada 01' });
    fetchData();
  };

  const saveSelection = async () => {
    if (!selectionForm.round) return alert('Defina a rodada');
    setLoading(true);
    await supabase.from('selections').insert([selectionForm]);
    alert('Seleção da Rodada salva!');
    fetchData();
  };

  const saveSettings = async () => {
    setLoading(true);
    await supabase.from('settings').upsert([settings]);
    alert('Configurações salvas!');
    fetchData();
  };

  const deleteItem = async (table: string, id: string) => {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    setLoading(true);
    await supabase.from(table).delete().eq('id', id);
    fetchData();
  };

  const updateSelectionPlayer = (index: number, field: keyof SelectionPlayer, value: string) => {
    const newPlayers = [...selectionForm.players];
    newPlayers[index] = { ...newPlayers[index], [field]: value };
    setSelectionForm({ ...selectionForm, players: newPlayers });
  };

  if (!isLogged) {
    return (
      <div className="min-h-screen bg-workspace flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-black border-8 border-primary p-10 shadow-[20px_20px_0_0_#000]">
          <h2 className="text-white text-3xl font-black uppercase italic mb-8 text-center tracking-tighter">Portal Admin</h2>
          <form onSubmit={(e) => { e.preventDefault(); if(password === '220611') setIsLogged(true); else alert('Senha Incorreta'); }} className="space-y-6">
            <input type="password" placeholder="SENHA" className="bee-input h-16 text-center text-xl" value={password} onChange={e => setPassword(e.target.value)} />
            <button className="w-full bg-primary text-black h-16 font-black uppercase text-xl shadow-[5px_5px_0_0_#555]">Acessar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white font-display">
      <aside className="w-72 bg-black border-r-4 border-black flex flex-col justify-between p-6 shrink-0 z-50 overflow-y-auto">
        <div className="flex flex-col gap-6">
          <div className="flex gap-3 items-center">
            <div className="bg-primary border-2 border-black size-10 flex items-center justify-center text-black rotate-6 shadow-[2px_2px_0_0_#fff]"><span className="material-symbols-outlined font-black">settings</span></div>
            <h1 className="text-white text-base font-black uppercase tracking-tighter leading-none text-left">Painel de<br/><span className="text-primary italic">Controle</span></h1>
          </div>
          <nav className="flex flex-col gap-1">
            {[
              { id: 'jogos', label: 'Jogos & Súmula', icon: 'sports_soccer' },
              { id: 'classificacao', label: 'Classificação', icon: 'table_rows' },
              { id: 'artilharia', label: 'Artilharia', icon: 'format_list_numbered' },
              { id: 'campeonato', label: 'Gestão de Times', icon: 'leaderboard' },
              { id: 'craque', label: 'Craque do Jogo', icon: 'stars' },
              { id: 'selecao', label: 'Seleção da Rodada', icon: 'groups' },
              { id: 'sponsors', label: 'Patrocinadores', icon: 'ads_click' },
              { id: 'config', label: 'Configurações', icon: 'settings' },
            ].map((item) => (
              <button key={item.id} onClick={() => setActiveSection(item.id as any)} className={`flex items-center gap-3 px-4 py-3 border-2 uppercase font-black text-[10px] transition-all ${activeSection === item.id ? 'bg-primary text-black border-black translate-x-1 shadow-[4px_4px_0_0_#fff]' : 'text-white/70 border-transparent hover:bg-white/10'}`}>
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>{item.label}
              </button>
            ))}
          </nav>
        </div>
        <button onClick={() => setIsLogged(false)} className="bee-btn-black !bg-red-600 !mt-8">SAIR</button>
      </aside>

      <main className="flex-1 overflow-y-auto p-12 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* SEÇÃO: JOGOS */}
          {activeSection === 'jogos' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <header className="border-b-8 border-black pb-4"><h2 className="text-5xl font-black uppercase italic tracking-tighter">Jogos & Resultados</h2></header>
              <div className="bee-card bg-white space-y-6">
                 <h3 className="font-black uppercase italic text-xl border-b-2 border-black pb-2">Agendar Partida</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <select className="bee-input" value={matchForm.home_team_id} onChange={e => setMatchForm({...matchForm, home_team_id: e.target.value})}>
                      <option value="">Mandante...</option>
                      {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <div className="flex items-center justify-center font-black italic text-3xl">X</div>
                    <select className="bee-input" value={matchForm.away_team_id} onChange={e => setMatchForm({...matchForm, away_team_id: e.target.value})}>
                      <option value="">Visitante...</option>
                      {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="date" className="bee-input" value={matchForm.date} onChange={e => setMatchForm({...matchForm, date: e.target.value})} />
                    <input type="time" className="bee-input" value={matchForm.time} onChange={e => setMatchForm({...matchForm, time: e.target.value})} />
                    <input className="bee-input" placeholder="Local" value={matchForm.location} onChange={e => setMatchForm({...matchForm, location: e.target.value})} />
                 </div>
                 <button onClick={saveMatch} disabled={loading} className="w-full bee-btn-black !bg-primary !text-black shadow-[4px_4px_0_0_#000]">ADICIONAR JOGO</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matches.map(m => (
                  <div key={m.id} className="bg-white border-4 border-black p-4 flex justify-between items-center shadow-[6px_6px_0_0_#000]">
                    <div>
                      <p className="text-[10px] font-black uppercase text-zinc-400">{m.date} - {m.time}</p>
                      <h4 className="font-black uppercase italic">{m.home_team_name} vs {m.away_team_name}</h4>
                    </div>
                    <button onClick={() => deleteItem('matches', m.id)} className="text-red-600 font-black">EXCLUIR</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEÇÃO: TIMES */}
          {activeSection === 'campeonato' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <header className="border-b-8 border-black pb-4"><h2 className="text-5xl font-black uppercase italic tracking-tighter">Gestão de Times</h2></header>
              <div className="bee-card bg-white space-y-6">
                 <h3 className="font-black uppercase italic text-xl border-b-2 border-black pb-2">Novo Clube</h3>
                 <div className="grid md:grid-cols-2 gap-6">
                    <input className="bee-input" placeholder="Nome do Time" value={teamForm.name} onChange={e => setTeamForm({...teamForm, name: e.target.value})} />
                    <select className="bee-input" value={teamForm.group} onChange={e => setTeamForm({...teamForm, group: e.target.value as any})}>
                      <option value="A">Grupo A</option>
                      <option value="B">Grupo B</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase">Logo do Clube (URL ou Upload)</label>
                    <input type="file" onChange={(e) => handleImageUpload(e, (url) => setTeamForm({...teamForm, logo_url: url}))} className="text-xs w-full file:bg-black file:text-white file:border-0 file:px-4 file:py-2 border-2 border-black p-2" />
                 </div>
                 <button onClick={saveTeam} disabled={loading} className="w-full bee-btn-black !bg-primary !text-black shadow-[4px_4px_0_0_#000]">CADASTRAR TIME</button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {teams.map(t => (
                  <div key={t.id} className="bg-white border-4 border-black p-4 text-center relative group shadow-[6px_6px_0_0_#000]">
                    <img src={t.logo_url} className="h-16 mx-auto object-contain mb-2" />
                    <p className="font-black uppercase italic text-sm">{t.name}</p>
                    <span className="text-[10px] bg-black text-white px-2 py-0.5">GRUPO {t.group}</span>
                    <button onClick={() => deleteItem('teams', t.id)} className="absolute top-2 right-2 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"><span className="material-symbols-outlined">delete</span></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEÇÃO: ARTILHARIA */}
          {activeSection === 'artilharia' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <header className="border-b-8 border-black pb-4"><h2 className="text-5xl font-black uppercase italic tracking-tighter">Artilharia</h2></header>
              <div className="bee-card bg-white space-y-6">
                 <h3 className="font-black uppercase italic text-xl border-b-2 border-black pb-2">Cadastrar Atleta</h3>
                 <div className="grid md:grid-cols-2 gap-4">
                    <input className="bee-input" placeholder="Nome Completo" value={playerForm.name} onChange={e => setPlayerForm({...playerForm, name: e.target.value})} />
                    <select className="bee-input" value={playerForm.team_id} onChange={e => setPlayerForm({...playerForm, team_id: e.target.value})}>
                      <option value="">Vínculo com Time...</option>
                      {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                 </div>
                 <div className="grid grid-cols-3 gap-4">
                    <input type="number" className="bee-input" placeholder="Gols" value={playerForm.goals} onChange={e => setPlayerForm({...playerForm, goals: parseInt(e.target.value)})} />
                    <input type="number" className="bee-input" placeholder="CA" value={playerForm.yellow_cards} onChange={e => setPlayerForm({...playerForm, yellow_cards: parseInt(e.target.value)})} />
                    <input type="number" className="bee-input" placeholder="CV" value={playerForm.red_cards} onChange={e => setPlayerForm({...playerForm, red_cards: parseInt(e.target.value)})} />
                 </div>
                 <button onClick={savePlayer} disabled={loading} className="w-full bee-btn-black !bg-primary !text-black shadow-[4px_4px_0_0_#000]">SALVAR ATLETA</button>
              </div>

              <div className="bg-white border-4 border-black shadow-[10px_10px_0_0_#000] overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-black text-white text-[10px] font-black uppercase">
                    <tr><th className="p-4">Nome</th><th className="p-4">Time</th><th className="p-4 text-center">Gols</th><th className="p-4 text-center">Ações</th></tr>
                  </thead>
                  <tbody className="font-bold text-sm">
                    {players.map(p => (
                      <tr key={p.id} className="border-b-2 border-zinc-100">
                        <td className="p-4 uppercase italic">{p.name}</td>
                        <td className="p-4 uppercase text-xs text-zinc-400">{p.team_name}</td>
                        <td className="p-4 text-center font-black">{p.goals}</td>
                        <td className="p-4 text-center"><button onClick={() => deleteItem('players', p.id)} className="text-red-600"><span className="material-symbols-outlined">delete</span></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SEÇÃO: CRAQUE */}
          {activeSection === 'craque' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <header className="border-b-8 border-black pb-4"><h2 className="text-5xl font-black uppercase italic tracking-tighter">Craque do Jogo</h2></header>
              <div className="grid lg:grid-cols-3 gap-12">
                <div className="bee-card bg-white space-y-4 h-fit">
                   <h3 className="font-black uppercase italic text-xl border-b-2 border-black pb-2">Eleger Destaque</h3>
                   <input className="bee-input" placeholder="Nome" value={craqueForm.name} onChange={e => setCraqueForm({...craqueForm, name: e.target.value})} />
                   <div className="grid grid-cols-2 gap-4">
                      <input className="bee-input" placeholder="Time" value={craqueForm.team} onChange={e => setCraqueForm({...craqueForm, team: e.target.value})} />
                      <input className="bee-input" placeholder="Posição" value={craqueForm.position} onChange={e => setCraqueForm({...craqueForm, position: e.target.value})} />
                   </div>
                   <textarea className="bee-input !h-24 py-2" placeholder="Descrição" value={craqueForm.match_desc} onChange={e => setCraqueForm({...craqueForm, match_desc: e.target.value})} />
                   <input type="file" onChange={(e) => handleImageUpload(e, (url) => setCraqueForm({...craqueForm, photo_url: url}))} className="text-xs w-full file:bg-black file:text-white border-2 border-black p-2" />
                   <button onClick={saveCraque} disabled={loading} className="w-full bee-btn-black !bg-primary !text-black shadow-[4px_4px_0_0_#000]">SALVAR CRAQUE</button>
                </div>
                <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
                  {craques.map(c => (
                    <div key={c.id} className="bg-yellow-500 border-4 border-black p-4 flex gap-4 shadow-[6px_6px_0_0_#000] relative group">
                      <img src={c.photo_url} className="size-20 object-cover border-2 border-black" />
                      <div><h5 className="font-black uppercase italic">{c.name}</h5><p className="text-[10px] uppercase">{c.round}</p></div>
                      <button onClick={() => deleteItem('craques', c.id!)} className="absolute top-2 right-2 text-red-600 opacity-0 group-hover:opacity-100"><span className="material-symbols-outlined">delete</span></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SEÇÃO: SELEÇÃO */}
          {activeSection === 'selecao' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <header className="border-b-8 border-black pb-4"><h2 className="text-5xl font-black uppercase italic tracking-tighter">Seleção da Rodada</h2></header>
              <div className="bee-card bg-white space-y-6">
                <input className="bee-input" placeholder="Título (Ex: 1ª Rodada)" value={selectionForm.round} onChange={e => setSelectionForm({...selectionForm, round: e.target.value})} />
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                   {selectionForm.players.map((p, idx) => (
                     <div key={idx} className="bg-zinc-50 border-2 border-black p-2 space-y-1">
                        <input className="bee-input !h-8 !text-[9px]" placeholder="Nome" value={p.name} onChange={e => updateSelectionPlayer(idx, 'name', e.target.value)} />
                        <input className="bee-input !h-8 !text-[9px]" placeholder="URL Foto" value={p.photo_url} onChange={e => updateSelectionPlayer(idx, 'photo_url', e.target.value)} />
                     </div>
                   ))}
                </div>
                <button onClick={saveSelection} disabled={loading} className="w-full bee-btn-black !bg-primary !text-black shadow-[4px_4px_0_0_#000]">PUBLICAR SELEÇÃO</button>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {selections.map(s => (
                  <div key={s.id} className="bg-black text-white p-4 border-4 border-primary flex justify-between items-center">
                    <span className="font-black italic uppercase">{s.round}</span>
                    <button onClick={() => deleteItem('selections', s.id!)} className="text-red-500">EXCLUIR</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEÇÃO: PATROCINADORES */}
          {activeSection === 'sponsors' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <header className="border-b-8 border-black pb-4"><h2 className="text-5xl font-black uppercase italic tracking-tighter">Patrocinadores</h2></header>
              <div className="bee-card bg-white space-y-6">
                 <input className="bee-input" placeholder="Nome do Patrocinador" value={sponsorForm.name} onChange={e => setSponsorForm({...sponsorForm, name: e.target.value})} />
                 <input type="file" onChange={(e) => handleImageUpload(e, (url) => setSponsorForm({...sponsorForm, logo_url: url}))} className="text-xs w-full file:bg-black file:text-white border-2 border-black p-2" />
                 <button onClick={saveSponsor} disabled={loading} className="w-full bee-btn-black !bg-primary !text-black shadow-[4px_4px_0_0_#000]">ADICIONAR MARCA</button>
              </div>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-6">
                {sponsors.map(s => (
                  <div key={s.id} className="bg-white border-4 border-black p-2 relative group flex flex-col items-center">
                    <img src={s.logo_url} className="h-12 object-contain" />
                    <button onClick={() => deleteItem('sponsors', s.id)} className="absolute top-1 right-1 text-red-600 opacity-0 group-hover:opacity-100"><span className="material-symbols-outlined text-[14px]">delete</span></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SEÇÃO: CONFIG */}
          {activeSection === 'config' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <header className="border-b-8 border-black pb-4"><h2 className="text-5xl font-black uppercase italic tracking-tighter">Configurações</h2></header>
              <div className="bee-card bg-white space-y-6">
                 <div className="space-y-4">
                    <input className="bee-input" placeholder="Nome do Estádio Principal" value={settings.stadium_name} onChange={e => setSettings({...settings, stadium_name: e.target.value})} />
                    <input className="bee-input" placeholder="URL Google Maps" value={settings.location_url} onChange={e => setSettings({...settings, location_url: e.target.value})} />
                    <input className="bee-input" placeholder="E-mail de Contato" value={settings.contact_email} onChange={e => setSettings({...settings, contact_email: e.target.value})} />
                 </div>
                 <button onClick={saveSettings} disabled={loading} className="w-full bee-btn-black !bg-primary !text-black shadow-[4px_4px_0_0_#000]">SALVAR CONFIGURAÇÕES</button>
              </div>
            </div>
          )}

          {/* SEÇÃO: CLASSIFICACAO (VISTA RÁPIDA) */}
          {activeSection === 'classificacao' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <header className="border-b-8 border-black pb-4"><h2 className="text-5xl font-black uppercase italic tracking-tighter">Classificação Atual</h2></header>
              <div className="grid lg:grid-cols-2 gap-8">
                {['A', 'B'].map(g => (
                  <div key={g} className="bg-white border-4 border-black shadow-[8px_8px_0_0_#000] overflow-hidden">
                    <div className="bg-black text-white p-3 font-black uppercase italic">Grupo {g}</div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[10px] text-left">
                        <thead className="bg-zinc-100 font-black uppercase"><tr><th className="p-2">Time</th><th className="p-2 text-center">P</th><th className="p-2 text-center">J</th><th className="p-2 text-center">SG</th></tr></thead>
                        <tbody>
                          {teams.filter(t => t.group === g).map(t => (
                            <tr key={t.id} className="border-b border-zinc-100">
                              <td className="p-2 font-bold uppercase">{t.name}</td>
                              <td className="p-2 text-center font-black">{t.points}</td>
                              <td className="p-2 text-center">{t.played}</td>
                              <td className="p-2 text-center">{t.goals_for - t.goals_against}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default AdminPage;
