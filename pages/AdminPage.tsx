
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Team } from '../types';

const AdminPage: React.FC = () => {
  const [isLogged, setIsLogged] = useState(false);
  const [password, setPassword] = useState('');
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Partial<Team> | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Team>>({
    name: '',
    group: 'A',
    logo_url: '',
    points: 0,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goals_for: 0,
    goals_against: 0,
  });

  const fetchTeams = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('teams').select('*').order('name');
    if (error) console.error('Error fetching teams:', error);
    else setTeams(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (isLogged) {
      fetchTeams();
    }
  }, [isLogged]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsLogged(true);
    } else {
      alert('Acesso Negado');
    }
  };

  const handleSaveTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.from('teams').upsert({
      ...formData,
      id: editingTeam?.id || undefined
    });

    if (error) {
      alert('Erro ao salvar time: ' + error.message);
    } else {
      alert('Time salvo com sucesso!');
      setEditingTeam(null);
      setFormData({
        name: '',
        group: 'A',
        logo_url: '',
        points: 0,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goals_for: 0,
        goals_against: 0,
      });
      fetchTeams();
    }
    setLoading(false);
  };

  const handleDeleteTeam = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este time?')) return;
    
    setLoading(true);
    const { error } = await supabase.from('teams').delete().eq('id', id);
    if (error) alert('Erro ao excluir: ' + error.message);
    else fetchTeams();
    setLoading(false);
  };

  const startEdit = (team: Team) => {
    setEditingTeam(team);
    setFormData(team);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingTeam(null);
    setFormData({
      name: '',
      group: 'A',
      logo_url: '',
      points: 0,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goals_for: 0,
      goals_against: 0,
    });
  };

  if (!isLogged) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center honeycomb-pattern p-6">
        <div className="w-full max-w-md bg-black border-4 border-yellow-500 p-10 shadow-[15px_15px_0_0_#000]">
          <div className="flex flex-col items-center mb-10">
            <span className="material-symbols-outlined text-yellow-500 text-6xl mb-4">lock_person</span>
            <h2 className="text-white text-3xl font-black uppercase italic">Painel de Gestão</h2>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-2">Área Restrita a Organizadores</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password" 
              placeholder="Digite a Senha" 
              className="w-full h-14 bg-zinc-900 border-2 border-yellow-500 text-white px-5 focus:outline-none focus:ring-4 focus:ring-yellow-500/20 font-bold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="w-full bg-yellow-500 text-black h-14 font-black uppercase text-lg hover:bg-white transition-all shadow-[4px_4px_0_0_#fff]">
              ACESSAR AGORA
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-7xl mx-auto bg-white min-h-screen">
      <div className="flex flex-wrap justify-between items-end gap-6 mb-12 border-b-4 border-black pb-8">
        <div>
          <h2 className="text-5xl font-black uppercase italic tracking-tighter">Painel Administrativo</h2>
          <p className="font-bold text-zinc-500 uppercase tracking-widest text-sm">Controle de Equipes e Estatísticas</p>
        </div>
        <div className="flex gap-4">
           <button onClick={() => setIsLogged(false)} className="bg-white text-red-600 px-8 py-3 font-black uppercase border-2 border-red-600 hover:bg-red-600 hover:text-white transition-all italic">Sair</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* FORM SECTION */}
        <div className="lg:col-span-5">
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_#EAB308] sticky top-24">
            <h3 className="text-2xl font-black uppercase italic mb-6">
              {editingTeam ? 'Editar Equipe' : 'Adicionar Nova Equipe'}
            </h3>
            <form onSubmit={handleSaveTeam} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nome da Equipe</label>
                  <input 
                    required
                    type="text" 
                    className="w-full border-2 border-black h-12 px-4 mt-1 font-bold" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Grupo</label>
                  <select 
                    className="w-full border-2 border-black h-12 px-4 mt-1 font-bold bg-white"
                    value={formData.group}
                    onChange={e => setFormData({...formData, group: e.target.value as 'A' | 'B'})}
                  >
                    <option value="A">Grupo A</option>
                    <option value="B">Grupo B</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">URL do Logo</label>
                  <input 
                    type="text" 
                    className="w-full border-2 border-black h-12 px-4 mt-1 font-bold text-xs" 
                    placeholder="https://..."
                    value={formData.logo_url}
                    onChange={e => setFormData({...formData, logo_url: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t-2 border-black/10 pt-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Pontos</label>
                  <input type="number" className="w-full border-2 border-black h-10 px-2 mt-1 font-bold" value={formData.points} onChange={e => setFormData({...formData, points: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Jogos</label>
                  <input type="number" className="w-full border-2 border-black h-10 px-2 mt-1 font-bold" value={formData.played} onChange={e => setFormData({...formData, played: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Vitórias</label>
                  <input type="number" className="w-full border-2 border-black h-10 px-2 mt-1 font-bold" value={formData.wins} onChange={e => setFormData({...formData, wins: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Empates</label>
                  <input type="number" className="w-full border-2 border-black h-10 px-2 mt-1 font-bold" value={formData.draws} onChange={e => setFormData({...formData, draws: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Derrotas</label>
                  <input type="number" className="w-full border-2 border-black h-10 px-2 mt-1 font-bold" value={formData.losses} onChange={e => setFormData({...formData, losses: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Gols Pró</label>
                  <input type="number" className="w-full border-2 border-black h-10 px-2 mt-1 font-bold" value={formData.goals_for} onChange={e => setFormData({...formData, goals_for: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Gols Sofr.</label>
                  <input type="number" className="w-full border-2 border-black h-10 px-2 mt-1 font-bold" value={formData.goals_against} onChange={e => setFormData({...formData, goals_against: parseInt(e.target.value)})} />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  disabled={loading}
                  type="submit" 
                  className="flex-grow bg-black text-white h-14 font-black uppercase text-lg border-2 border-black hover:bg-yellow-500 hover:text-black transition-all disabled:opacity-50"
                >
                  {loading ? 'Processando...' : editingTeam ? 'Salvar Alterações' : 'Cadastrar Equipe'}
                </button>
                {editingTeam && (
                  <button 
                    type="button"
                    onClick={resetForm}
                    className="bg-white text-black px-6 h-14 font-black uppercase border-2 border-black hover:bg-zinc-100"
                  >
                    X
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* LIST SECTION */}
        <div className="lg:col-span-7">
          <div className="bg-black text-white p-6 border-4 border-black flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black uppercase italic">Equipes Cadastradas</h3>
            <span className="bg-yellow-500 text-black px-3 py-1 text-xs font-black uppercase">{teams.length} TIMES</span>
          </div>

          <div className="space-y-4">
            {loading && teams.length === 0 ? (
              <div className="p-20 text-center font-black uppercase italic text-zinc-300">Carregando equipes...</div>
            ) : teams.length === 0 ? (
              <div className="p-20 border-4 border-dashed border-zinc-200 text-center font-black uppercase italic text-zinc-400">
                Nenhuma equipe encontrada no banco de dados.
              </div>
            ) : (
              teams.map((team) => (
                <div key={team.id} className="bg-white border-4 border-black p-4 flex items-center justify-between group hover:shadow-[4px_4px_0_0_#000] transition-all">
                  <div className="flex items-center gap-4">
                    <div className="size-12 border-2 border-black bg-zinc-100 flex items-center justify-center overflow-hidden">
                      {team.logo_url ? (
                        <img src={team.logo_url} alt={team.name} className="size-full object-contain" />
                      ) : (
                        <span className="material-symbols-outlined text-zinc-400">shield</span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-black uppercase italic leading-none">{team.name}</h4>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                        Grupo {team.group} • {team.points} Pts • {team.wins}V/{team.draws}E/{team.losses}D
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => startEdit(team)}
                      className="size-10 bg-black text-white flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteTeam(team.id)}
                      className="size-10 bg-white text-red-600 border-2 border-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
