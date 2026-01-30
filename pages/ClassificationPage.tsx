
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Team } from '../types';

const ClassificationPage: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        // Busca os times ordenando por Pontos (DESC), Vitórias (DESC) e Saldo de Gols (DESC)
        const { data, error } = await supabase
          .from('teams')
          .select('*')
          .order('points', { ascending: false })
          .order('wins', { ascending: false });

        if (error) throw error;
        
        // Ordenação manual adicional para Saldo de Gols (SG) caso as anteriores empatem
        const sortedData = (data as Team[] || []).sort((a, b) => {
          if (a.points !== b.points) return b.points - a.points;
          if (a.wins !== b.wins) return b.wins - a.wins;
          const sgA = a.goals_for - a.goals_against;
          const sgB = b.goals_for - b.goals_against;
          return sgB - sgA;
        });

        setTeams(sortedData);
      } catch (err: any) {
        console.error('Erro ao carregar times:', err);
        setError('Não foi possível carregar a classificação. Verifique a conexão com o banco de dados.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const groups: ('A' | 'B')[] = ['A', 'B'];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <div className="size-16 border-8 border-black border-t-yellow-500 animate-spin mb-4"></div>
        <p className="font-black uppercase italic animate-pulse">Carregando Tabelas...</p>
      </div>
    );
  }

  return (
    <div className="bg-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 border-l-8 border-black pl-8">
          <h2 className="text-5xl font-black uppercase italic tracking-tighter">Classificação</h2>
          <p className="text-xl font-bold text-gray-500 uppercase">Fase de Grupos • Temporada 2024</p>
        </div>

        {error && (
          <div className="bg-red-100 border-4 border-red-600 p-6 mb-12 flex items-center gap-4 shadow-[8px_8px_0_0_#000]">
            <span className="material-symbols-outlined text-red-600 text-4xl">warning</span>
            <p className="font-bold text-red-600">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-12">
          {groups.map((groupLetter) => {
            const groupTeams = teams.filter(t => t.group === groupLetter);

            return (
              <div key={groupLetter} className="border-4 border-black shadow-[12px_12px_0_0_#000] overflow-hidden rounded-xl bg-white flex flex-col">
                <div className="bg-black text-white p-4 flex justify-between items-center">
                  <h3 className="text-2xl font-black uppercase italic">GRUPO {groupLetter}</h3>
                  <span className="text-yellow-500 font-black text-xs uppercase tracking-widest">Zona de Classificação</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[500px]">
                    <thead>
                      <tr className="bg-yellow-500 border-b-4 border-black text-[10px] font-black uppercase tracking-widest text-black">
                        <th className="p-4 w-16">Pos</th>
                        <th className="p-4">Time</th>
                        <th className="p-4 text-center">P</th>
                        <th className="p-4 text-center">J</th>
                        <th className="p-4 text-center">V</th>
                        <th className="p-4 text-center">SG</th>
                      </tr>
                    </thead>
                    <tbody className="font-bold text-sm">
                      {groupTeams.length > 0 ? (
                        groupTeams.map((team, idx) => {
                          const sg = team.goals_for - team.goals_against;
                          return (
                            <tr key={team.id || team.name} className={`border-b-2 border-black/5 hover:bg-yellow-500/10 transition-colors ${idx < 2 ? 'bg-yellow-500/5' : ''}`}>
                              <td className="p-4 font-black text-lg italic">{idx + 1}</td>
                              <td className="p-4 uppercase flex items-center gap-3">
                                {team.logo_url ? (
                                  <img src={team.logo_url} alt={team.name} className="size-8 object-contain border-2 border-black bg-white" />
                                ) : (
                                  <div className="size-8 bg-zinc-200 rounded border-2 border-black flex items-center justify-center">
                                    <span className="material-symbols-outlined text-xs">shield</span>
                                  </div>
                                )}
                                <span className="truncate">{team.name}</span>
                              </td>
                              <td className="p-4 text-center font-black text-lg">{team.points}</td>
                              <td className="p-4 text-center text-zinc-400">{team.played}</td>
                              <td className="p-4 text-center text-zinc-400">{team.wins}</td>
                              <td className={`p-4 text-center ${sg > 0 ? 'text-green-600' : sg < 0 ? 'text-red-600' : 'text-zinc-400'}`}>
                                {sg > 0 ? `+${sg}` : sg}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-10 text-center text-zinc-400 font-bold uppercase tracking-widest italic">
                            Nenhum time cadastrado neste grupo
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                <div className="p-4 bg-zinc-50 border-t-2 border-black mt-auto flex justify-center">
                  <button className="text-[10px] font-black uppercase tracking-widest hover:text-yellow-500 transition-colors">
                    Ver estatísticas detalhadas do Grupo {groupLetter} →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border-4 border-black bg-white">
            <h4 className="font-black uppercase italic text-sm mb-2">Critérios de Desempate</h4>
            <ol className="text-xs font-bold text-zinc-500 space-y-1 list-decimal ml-4">
              <li>Maior número de vitórias</li>
              <li>Maior saldo de gols</li>
              <li>Maior número de gols pró</li>
              <li>Confronto direto</li>
              <li>Sorteio</li>
            </ol>
          </div>
          <div className="p-6 border-4 border-black bg-yellow-500 md:col-span-2 flex items-center justify-between">
            <div>
              <h4 className="font-black uppercase italic text-xl">Sua equipe está fora?</h4>
              <p className="font-bold text-sm">Inscreva seu time para a próxima edição da Copa.</p>
            </div>
            <button className="bg-black text-white px-6 py-3 font-black uppercase text-xs border-2 border-black hover:bg-white hover:text-black transition-all">
              INSCREVER AGORA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassificationPage;
