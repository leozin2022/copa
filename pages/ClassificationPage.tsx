
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';

const ClassificationPage: React.FC = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('teams')
        .select('*')
        .order('points', { ascending: false });

      if (data) setTeams(data);
      setLoading(false);
    };
    fetchTeams();
  }, []);

  const groups = ['A', 'B'];

  if (loading) return <div className="p-20 text-center font-black uppercase italic">Carregando Classificação...</div>;

  return (
    <div className="bg-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-black uppercase italic mb-12 border-l-8 border-black pl-8">Classificação Completa</h2>
        
        <div className="grid lg:grid-cols-2 gap-12">
          {groups.map((group) => (
            <div key={group} className="border-4 border-black shadow-[12px_12px_0_0_#000] bg-white overflow-hidden">
              <div className="bg-black text-white p-4 font-black uppercase italic">GRUPO {group}</div>
              <table className="w-full text-left">
                <thead className="bg-primary border-b-4 border-black text-[10px] font-black uppercase">
                  <tr>
                    <th className="p-4">Time</th>
                    <th className="p-4 text-center">P</th>
                    <th className="p-4 text-center">J</th>
                    <th className="p-4 text-center">SG</th>
                  </tr>
                </thead>
                <tbody className="font-bold text-sm">
                  {teams.filter(t => t.group === group).length > 0 ? (
                    teams.filter(t => t.group === group).map((team, idx) => (
                      <tr key={team.id} className="border-b-2 border-black/5">
                        <td className="p-4 flex items-center gap-3 uppercase">
                          <img src={team.logo_url} className="size-8 object-contain" alt="" />
                          {team.name}
                        </td>
                        <td className="p-4 text-center font-black">{team.points}</td>
                        <td className="p-4 text-center opacity-40">{team.played}</td>
                        <td className="p-4 text-center">{team.goals_for - team.goals_against}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={4} className="p-8 text-center text-zinc-300 italic">Nenhuma equipe cadastrada</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassificationPage;
