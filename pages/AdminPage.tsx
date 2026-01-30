
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

const AdminPage: React.FC = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [password, setPassword] = useState('');
  const [activeSection, setActiveSection] = useState<'matches' | 'teams' | 'sponsors' | 'settings' | 'broadcasts'>('matches');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [teams, setTeams] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  
  // Edit States
  const [editingBroadcastId, setEditingBroadcastId] = useState<string | null>(null);

  // Forms
  const [teamForm, setTeamForm] = useState({ name: '', logo_url: '', group: 'A' });
  const [matchForm, setMatchForm] = useState({ 
    home_team_id: '', away_team_id: '', home_score: 0, away_score: 0, 
    date: '', time: '', status: 'scheduled', group: 'A', location: 'Baixa do Mel' 
  });
  const [sponsorForm, setSponsorForm] = useState({ name: '', logo_url: '' });
  const [broadcastForm, setBroadcastForm] = useState({ 
    title: '', team_a: '', team_b: '', date_info: '', youtube_url: '', narration: '', is_active: false, location: 'Baixa do Mel', cover_url: '' 
  });
  const [siteLogos, setSiteLogos] = useState({ header_logo_url: '', footer_logo_url: '' });
  const [locationForm, setLocationForm] = useState({ map_url: '', image_url: '', stadium_name: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: tData } = await supabase.from('teams').select('*').order('name', { ascending: true });
      const { data: mData } = await supabase.from('matches').select('*, Mandante:home_team_id(name, logo_url), Visitante:away_team_id(name, logo_url)').order('date', { ascending: false });
      const { data: spData } = await supabase.from('sponsors').select('*').order('created_at', { ascending: false });
      const { data: bData } = await supabase.from('broadcasts').select('*').order('created_at', { ascending: false });
      
      const { data: stData } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();
      const { data: lcData } = await supabase.from('location_settings').select('*').limit(1).maybeSingle();

      if (tData) setTeams(tData);
      if (mData) setMatches(mData);
      if (spData) setSponsors(spData);
      if (bData) setBroadcasts(bData);
      if (stData) setSiteLogos({ header_logo_url: stData.header_logo_url, footer_logo_url: stData.footer_logo_url });
      if (lcData) setLocationForm({ map_url: lcData.map_url, image_url: lcData.image_url, stadium_name: lcData.stadium_name });

    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLogged) fetchData();
  }, [isLogged]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>, bucketName: string) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return null;
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error: any) {
      alert('Erro no Upload: ' + error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const genericSave = async (table: string, payload: any, resetForm: () => void) => {
    setLoading(true);
    const { error } = await supabase.from(table).insert(payload);
    if (error) {
      alert("Erro ao salvar: " + error.message);
    } else {
      resetForm();
      fetchData();
    }
    setLoading(false);
  };

  const deleteItem = async (table: string, id: string) => {
    if (!confirm('Deseja realmente deletar este registro?')) return;
    setLoading(true);
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) alert("Erro ao deletar: " + error.message);
    fetchData();
    setLoading(false);
  };

  const handleSaveBroadcast = async () => {
    if (!broadcastForm.title || !broadcastForm.youtube_url) {
      alert("Título e URL do YouTube são obrigatórios!");
      return;
    }

    setLoading(true);
    try {
      if (editingBroadcastId) {
        // Lógica de Update explícita
        const { error } = await supabase
          .from('broadcasts')
          .update({
            title: broadcastForm.title,
            team_a: broadcastForm.team_a,
            team_b: broadcastForm.team_b,
            date_info: broadcastForm.date_info,
            youtube_url: broadcastForm.youtube_url,
            narration: broadcastForm.narration,
            is_active: broadcastForm.is_active,
            location: broadcastForm.location,
            cover_url: broadcastForm.cover_url // Garante que a capa está no payload
          })
          .eq('id', editingBroadcastId);
        
        if (error) throw error;
        alert("Transmissão atualizada com sucesso!");
      } else {
        // Lógica de Insert
        const { error } = await supabase.from('broadcasts').insert([broadcastForm]);
        if (error) throw error;
        alert("Nova transmissão criada com sucesso!");
      }
      
      cancelEditBroadcast();
      fetchData();
    } catch (error: any) {
      alert("Erro ao salvar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const startEditBroadcast = (b: any) => {
    setEditingBroadcastId(b.id);
    setBroadcastForm({
      title: b.title || '',
      team_a: b.team_a || '',
      team_b: b.team_b || '',
      date_info: b.date_info || '',
      youtube_url: b.youtube_url || '',
      narration: b.narration || '',
      is_active: b.is_active || false,
      location: b.location || 'Baixa do Mel',
      cover_url: b.cover_url || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEditBroadcast = () => {
    setEditingBroadcastId(null);
    setBroadcastForm({
      title: '', team_a: '', team_b: '', date_info: '', 
      youtube_url: '', narration: '', is_active: false, 
      location: 'Baixa do Mel', cover_url: ''
    });
  };

  const toggleBroadcastStatus = async (id: string, current: boolean) => {
    setLoading(true);
    const { error } = await supabase.from('broadcasts').update({ is_active: !current }).eq('id', id);
    if (error) alert(error.message);
    fetchData();
    setLoading(false);
  };

  const saveSettings = async (table: string, form: any, label: string) => {
    setLoading(true);
    const current = await supabase.from(table).select('id').limit(1).maybeSingle();
    const { error } = await supabase.from(table).upsert({
      id: current.data?.id,
      ...form
    });
    setLoading(false);
    if (!error) alert(`${label} atualizado com sucesso!`);
    else alert(`Erro ao atualizar ${label}: ` + error.message);
  };

  if (!isLogged) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-black border-8 border-primary p-10 shadow-[20px_20px_0_0_#000]">
          <h2 className="text-white text-3xl font-black uppercase italic mb-8 text-center tracking-tighter">Acesso Admin</h2>
          <form onSubmit={(e) => { e.preventDefault(); if(password === '220611') setIsLogged(true); else alert('Senha Incorreta'); }} className="space-y-6">
            <input type="password" placeholder="SENHA" className="bee-input h-16 text-center text-xl uppercase" value={password} onChange={e => setPassword(e.target.value)} />
            <button className="w-full bg-primary text-black h-16 font-black uppercase text-xl hover:translate-x-1 hover:translate-y-1 transition-transform active:shadow-none">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white font-display overflow-hidden text-black">
      <aside className="w-64 bg-black flex flex-col p-6 shrink-0 border-r-4 border-black overflow-y-auto">
        <div className="text-primary font-black italic text-xl mb-10 tracking-tighter uppercase">Painel CSD</div>
        <nav className="flex flex-col gap-2 flex-grow">
          {[
            { id: 'matches', label: 'Partidas', icon: 'sports_soccer' },
            { id: 'teams', label: 'Equipes', icon: 'shield' },
            { id: 'broadcasts', label: 'Transmissões', icon: 'live_tv' },
            { id: 'sponsors', label: 'Patrocinadores', icon: 'handshake' },
            { id: 'settings', label: 'Configurações', icon: 'settings' },
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => { setActiveSection(item.id as any); cancelEditBroadcast(); }} 
              className={`flex items-center gap-3 px-4 py-3 border-2 uppercase font-black text-[10px] transition-all ${activeSection === item.id ? 'bg-primary text-black border-black translate-x-1 shadow-[4px_4px_0_0_#fff]' : 'text-white/70 border-transparent hover:bg-white/10'}`}
            >
              <span className="material-symbols-outlined text-[18px]">{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>
        
        <button 
          onClick={() => setIsLogged(false)}
          className="mt-auto flex items-center gap-3 px-4 py-3 border-2 border-red-600 text-red-600 uppercase font-black text-[10px] hover:bg-red-600 hover:text-white transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>Sair do Admin
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto p-12 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto space-y-12 pb-20">
          
          {activeSection === 'broadcasts' && (
            <div className="space-y-10">
              <div className="flex justify-between items-end border-b-8 border-black pb-2">
                <h2 className="text-5xl font-black uppercase italic">{editingBroadcastId ? 'Editando Transmissão' : 'Transmissões ao Vivo'}</h2>
                {editingBroadcastId && (
                  <button onClick={cancelEditBroadcast} className="bg-zinc-200 text-black px-4 py-2 font-black uppercase text-[10px] border-2 border-black hover:bg-black hover:text-white transition-all">Cancelar Edição</button>
                )}
              </div>

              <div className="bee-card !bg-white">
                <div className="grid md:grid-cols-2 gap-8 mb-6">
                  <div className="space-y-6">
                    <div>
                      <label className="block font-black uppercase text-[10px] mb-1">Título da Live</label>
                      <input className="bee-input" placeholder="Ex: Grande Final ou Rodada 05" value={broadcastForm.title} onChange={e => setBroadcastForm({...broadcastForm, title: e.target.value})} />
                    </div>
                    <div>
                      <label className="block font-black uppercase text-[10px] mb-1">Link do YouTube</label>
                      <input className="bee-input" placeholder="https://youtube.com/live/..." value={broadcastForm.youtube_url} onChange={e => setBroadcastForm({...broadcastForm, youtube_url: e.target.value})} />
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="block font-black uppercase text-[10px] mb-1">Capa da Transmissão {uploading && <span className="text-primary animate-pulse ml-2">(SUBINDO...)</span>}</label>
                    <div className="flex-1 flex flex-col items-center justify-center border-4 border-dashed border-black/20 p-4 bg-zinc-50 relative min-h-[160px] overflow-hidden group">
                       {broadcastForm.cover_url ? (
                         <img src={broadcastForm.cover_url} className="absolute inset-0 w-full h-full object-cover" />
                       ) : (
                         <span className="material-symbols-outlined text-4xl opacity-20">image_search</span>
                       )}
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                          <p className="text-[10px] font-black uppercase text-white bg-black/60 px-4 py-2 border border-white">Alterar Capa</p>
                       </div>
                       <input 
                        type="file" 
                        className="absolute inset-0 opacity-0 cursor-pointer z-20" 
                        onChange={async (e) => { 
                          const url = await handleUpload(e, 'teams'); 
                          if(url) setBroadcastForm(prev => ({...prev, cover_url: url})); 
                        }} 
                       />
                    </div>
                    <p className="text-[9px] font-bold text-zinc-400 mt-2 uppercase tracking-widest">Recomendado: 1280x720px (16:9)</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block font-black uppercase text-[10px] mb-1">Equipe A</label>
                    <input className="bee-input" value={broadcastForm.team_a} onChange={e => setBroadcastForm({...broadcastForm, team_a: e.target.value})} />
                  </div>
                  <div>
                    <label className="block font-black uppercase text-[10px] mb-1">Equipe B</label>
                    <input className="bee-input" value={broadcastForm.team_b} onChange={e => setBroadcastForm({...broadcastForm, team_b: e.target.value})} />
                  </div>
                  <div>
                    <label className="block font-black uppercase text-[10px] mb-1">Narrador / Transmissão por:</label>
                    <input className="bee-input" value={broadcastForm.narration} onChange={e => setBroadcastForm({...broadcastForm, narration: e.target.value})} />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block font-black uppercase text-[10px] mb-1">Data e Horário (Informação)</label>
                    <input className="bee-input" placeholder="Sábado, 15:30h" value={broadcastForm.date_info} onChange={e => setBroadcastForm({...broadcastForm, date_info: e.target.value})} />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-3 cursor-pointer bg-zinc-100 p-3 w-full border-2 border-black font-black uppercase text-[10px] hover:bg-zinc-200 transition-colors">
                      <input type="checkbox" checked={broadcastForm.is_active} onChange={e => setBroadcastForm({...broadcastForm, is_active: e.target.checked})} className="size-5 border-2 border-black text-primary focus:ring-0" />
                      Ativar no Feed Principal agora
                    </label>
                  </div>
                </div>
                <button 
                  onClick={handleSaveBroadcast} 
                  className={`bee-btn-black w-full ${(loading || uploading) ? 'opacity-50 cursor-not-allowed' : ''}`} 
                  disabled={loading || uploading}
                >
                  {(loading || uploading) ? 'PROCESSANDO...' : (editingBroadcastId ? 'SALVAR ALTERAÇÕES NA LIVE' : 'PUBLICAR NOVA TRANSMISSÃO')}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {broadcasts.map(b => (
                  <div key={b.id} className={`bg-white border-4 border-black flex flex-col shadow-[6px_6px_0_0_#000] relative overflow-hidden group transition-all ${b.id === editingBroadcastId ? 'ring-4 ring-yellow-500 scale-[1.02]' : ''}`}>
                    <div className="h-32 bg-zinc-900 relative overflow-hidden">
                       {b.cover_url ? (
                         <img src={b.cover_url} className="w-full h-full object-cover" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center italic text-white/20 uppercase text-[10px] font-black">Sem Capa Visual</div>
                       )}
                       <div className="absolute top-2 right-2 flex gap-1">
                          <button 
                            onClick={() => toggleBroadcastStatus(b.id, b.is_active)}
                            className={`px-3 py-1 font-black uppercase text-[9px] border-2 border-black transition-colors ${b.is_active ? 'bg-primary text-black' : 'bg-black text-white'}`}
                          >
                            {b.is_active ? 'AO VIVO' : 'OFFLINE'}
                          </button>
                          <button onClick={() => startEditBroadcast(b)} className="bg-white text-black size-8 flex items-center justify-center border-2 border-black hover:bg-primary transition-colors">
                            <span className="material-symbols-outlined text-sm">edit</span>
                          </button>
                          <button onClick={() => deleteItem('broadcasts', b.id)} className="bg-red-600 text-white size-8 flex items-center justify-center border-2 border-black hover:bg-black transition-colors">
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                       </div>
                    </div>
                    <div className="p-4 bg-white">
                      <p className="font-black uppercase italic text-sm truncate">{b.title}</p>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase mt-1">{b.team_a} x {b.team_b} | {b.date_info}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'teams' && (
            <div className="space-y-10">
              <h2 className="text-5xl font-black uppercase italic border-b-8 border-black pb-2">Gerenciar Equipes</h2>
              <div className="bee-card !bg-white grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="block font-black uppercase text-[10px] mb-1">Nome da Equipe</label>
                    <input className="bee-input" value={teamForm.name} onChange={e => setTeamForm({...teamForm, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block font-black uppercase text-[10px] mb-1">Grupo</label>
                    <select className="bee-input" value={teamForm.group} onChange={e => setTeamForm({...teamForm, group: e.target.value as 'A' | 'B'})}>
                      <option value="A">Grupo A</option>
                      <option value="B">Grupo B</option>
                    </select>
                  </div>
                  <button onClick={() => genericSave('teams', teamForm, () => setTeamForm({name:'', logo_url:'', group:'A'}))} className="bee-btn-black w-full" disabled={loading}>Salvar Equipe</button>
                </div>
                <div className="flex flex-col items-center justify-center border-4 border-dashed border-black/20 p-4 bg-zinc-50 relative min-h-[160px]">
                   {teamForm.logo_url ? <img src={teamForm.logo_url} className="h-24 object-contain" /> : <span className="material-symbols-outlined text-4xl opacity-20">add_photo_alternate</span>}
                   <p className="text-[9px] font-black uppercase opacity-40 mt-2">Clique para subir escudo</p>
                   <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async (e) => { const url = await handleUpload(e, 'teams'); if(url) setTeamForm({...teamForm, logo_url: url}); }} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {teams.map(t => (
                  <div key={t.id} className="bg-white border-4 border-black p-4 flex flex-col items-center text-center relative shadow-[6px_6px_0_0_#000]">
                    <img src={t.logo_url} className="h-16 w-16 object-contain mb-3" />
                    <p className="font-black uppercase text-xs truncate w-full">{t.name}</p>
                    <p className="text-[10px] bg-black text-primary px-2 py-0.5 mt-1 font-black uppercase">Grupo {t.group}</p>
                    <button onClick={() => deleteItem('teams', t.id)} className="absolute -top-2 -right-2 bg-red-600 text-white size-6 flex items-center justify-center border-2 border-black hover:bg-black transition-colors">
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'matches' && (
            <div className="space-y-10">
              <h2 className="text-5xl font-black uppercase italic border-b-8 border-black pb-2">Gerenciar Partidas</h2>
              <div className="bee-card !bg-white">
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block font-black uppercase text-[10px] mb-1">Mandante</label>
                    <select className="bee-input" value={matchForm.home_team_id} onChange={e => setMatchForm({...matchForm, home_team_id: e.target.value})}>
                      <option value="">Selecione...</option>
                      {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col items-center justify-center pt-6">
                    <span className="font-black italic text-2xl">VS</span>
                  </div>
                  <div>
                    <label className="block font-black uppercase text-[10px] mb-1">Visitante</label>
                    <select className="bee-input" value={matchForm.away_team_id} onChange={e => setMatchForm({...matchForm, away_team_id: e.target.value})}>
                      <option value="">Selecione...</option>
                      {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <div>
                    <label className="block font-black uppercase text-[10px] mb-1">Placar Mandante</label>
                    <input type="number" className="bee-input" value={matchForm.home_score} onChange={e => setMatchForm({...matchForm, home_score: parseInt(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block font-black uppercase text-[10px] mb-1">Placar Visitante</label>
                    <input type="number" className="bee-input" value={matchForm.away_score} onChange={e => setMatchForm({...matchForm, away_score: parseInt(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block font-black uppercase text-[10px] mb-1">Data</label>
                    <input type="date" className="bee-input" value={matchForm.date} onChange={e => setMatchForm({...matchForm, date: e.target.value})} />
                  </div>
                  <div>
                    <label className="block font-black uppercase text-[10px] mb-1">Horário</label>
                    <input type="time" className="bee-input" value={matchForm.time} onChange={e => setMatchForm({...matchForm, time: e.target.value})} />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <label className="block font-black uppercase text-[10px] mb-1">Status</label>
                    <select className="bee-input" value={matchForm.status} onChange={e => setMatchForm({...matchForm, status: e.target.value as any})}>
                      <option value="scheduled">Agendado</option>
                      <option value="live">Ao Vivo</option>
                      <option value="finished">Finalizado</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-black uppercase text-[10px] mb-1">Grupo</label>
                    <select className="bee-input" value={matchForm.group} onChange={e => setMatchForm({...matchForm, group: e.target.value as any})}>
                      <option value="A">Grupo A</option>
                      <option value="B">Grupo B</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-black uppercase text-[10px] mb-1">Local</label>
                    <input className="bee-input" value={matchForm.location} onChange={e => setMatchForm({...matchForm, location: e.target.value})} />
                  </div>
                </div>

                <button onClick={() => genericSave('matches', matchForm, () => setMatchForm({
                  home_team_id: '', away_team_id: '', home_score: 0, away_score: 0, 
                  date: '', time: '', status: 'scheduled', group: 'A', location: 'Baixa do Mel'
                }))} className="bee-btn-black w-full">Publicar Partida</button>
              </div>

              <div className="space-y-4">
                {matches.map(m => (
                  <div key={m.id} className="bg-white border-4 border-black p-4 flex items-center justify-between shadow-[4px_4px_0_0_#000]">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="text-right flex-1">
                        <span className="font-black uppercase text-xs">{m.Mandante?.name}</span>
                      </div>
                      <div className="bg-black text-primary px-3 py-1 font-black min-w-[60px] text-center">
                        {m.home_score} x {m.away_score}
                      </div>
                      <div className="flex-1">
                        <span className="font-black uppercase text-xs">{m.Visitante?.name}</span>
                      </div>
                    </div>
                    <div className="px-6 border-l-2 border-black/10 text-[10px] font-bold uppercase text-zinc-400">
                      {m.date} | {m.time}
                    </div>
                    <button onClick={() => deleteItem('matches', m.id)} className="bg-red-600 text-white size-10 flex items-center justify-center border-2 border-black hover:bg-black">
                       <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'sponsors' && (
            <div className="space-y-8">
              <h2 className="text-5xl font-black uppercase italic border-b-8 border-black pb-2">Patrocinadores</h2>
              <div className="bee-card !bg-white grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block font-black uppercase text-[10px]">Nome do Patrocinador</label>
                  <input className="bee-input" placeholder="Ex: Supermercado X" value={sponsorForm.name} onChange={e => setSponsorForm({...sponsorForm, name: e.target.value})} />
                  <button onClick={() => genericSave('sponsors', sponsorForm, () => setSponsorForm({name:'', logo_url:''}))} className="bee-btn-black w-full" disabled={uploading || loading}>Adicionar Patrocinador</button>
                </div>
                <div className="flex flex-col items-center justify-center border-4 border-dashed border-black/20 p-4 bg-zinc-50 relative min-h-[160px]">
                   {sponsorForm.logo_url ? <img src={sponsorForm.logo_url} className="h-24 object-contain" /> : <span className="material-symbols-outlined text-4xl opacity-20">add_photo_alternate</span>}
                   <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async (e) => { const url = await handleUpload(e, 'sponsors'); if(url) setSponsorForm({...sponsorForm, logo_url: url}); }} />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {sponsors.map(s => (
                  <div key={s.id} className="bg-white border-4 border-black p-4 text-center relative shadow-[6px_6px_0_0_#000]">
                    <img src={s.logo_url} className="h-16 mx-auto object-contain mb-2" />
                    <p className="text-[10px] font-black uppercase truncate">{s.name}</p>
                    <button onClick={() => deleteItem('sponsors', s.id)} className="absolute -top-2 -right-2 bg-red-600 text-white size-6 flex items-center justify-center border-2 border-black">
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="space-y-16">
              <div className="space-y-6">
                <h2 className="text-4xl font-black uppercase italic border-b-4 border-black pb-2">Logotipos do Site</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bee-card !bg-white space-y-4">
                    <p className="font-black uppercase text-xs">Logotipo Início (Cabeçalho)</p>
                    <div className="border-2 border-dashed border-black/20 relative aspect-video flex items-center justify-center overflow-hidden bg-black">
                       {siteLogos.header_logo_url ? <img src={siteLogos.header_logo_url} className="max-h-full max-w-full object-contain" /> : <span className="material-symbols-outlined text-4xl text-white/20">logo_dev</span>}
                       <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async (e) => { const url = await handleUpload(e, 'teams'); if(url) setSiteLogos({...siteLogos, header_logo_url: url}); }} />
                    </div>
                  </div>
                  <div className="bee-card !bg-white space-y-4">
                    <p className="font-black uppercase text-xs">Logotipo Final (Rodapé)</p>
                    <div className="border-2 border-dashed border-black/20 relative aspect-video flex items-center justify-center overflow-hidden bg-black">
                       {siteLogos.footer_logo_url ? <img src={siteLogos.footer_logo_url} className="max-h-full max-w-full object-contain" /> : <span className="material-symbols-outlined text-4xl text-white/20">logo_dev</span>}
                       <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async (e) => { const url = await handleUpload(e, 'teams'); if(url) setSiteLogos({...siteLogos, footer_logo_url: url}); }} />
                    </div>
                  </div>
                </div>
                <button onClick={() => saveSettings('site_settings', siteLogos, 'Logotipos')} className="bee-btn-black">Salvar Logotipos</button>
              </div>

              <div className="space-y-6">
                <h2 className="text-4xl font-black uppercase italic border-b-4 border-black pb-2">Configuração do Mapa</h2>
                <div className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <label className="block font-black uppercase text-[10px]">Nome do Estádio</label>
                      <input className="bee-input" value={locationForm.stadium_name} onChange={e => setLocationForm({...locationForm, stadium_name: e.target.value})} />
                      <label className="block font-black uppercase text-[10px]">URL Google Maps</label>
                      <input className="bee-input" value={locationForm.map_url} placeholder="https://goo.gl/maps/..." onChange={e => setLocationForm({...locationForm, map_url: e.target.value})} />
                   </div>
                   <div className="bee-card !bg-white space-y-4">
                    <p className="font-black uppercase text-xs">Foto do Estádio</p>
                    <div className="border-2 border-dashed border-black/20 relative aspect-video flex items-center justify-center overflow-hidden">
                       {locationForm.image_url ? <img src={locationForm.image_url} className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-4xl opacity-20">stadium</span>}
                       <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async (e) => { const url = await handleUpload(e, 'teams'); if(url) setLocationForm({...locationForm, image_url: url}); }} />
                    </div>
                  </div>
                </div>
                <button onClick={() => saveSettings('location_settings', locationForm, 'Localização')} className="bee-btn-black">Salvar Mapa</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
