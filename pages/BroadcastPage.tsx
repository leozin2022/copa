
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Broadcast } from '../types';

const BroadcastPage: React.FC = () => {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBroadcasts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('broadcasts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) console.error('Erro ao buscar transmissões:', error);
      else setBroadcasts(data || []);
      setLoading(false);
    };

    fetchBroadcasts();
  }, []);

  const activeBroadcast = broadcasts.find(b => b.is_active);
  const pastBroadcasts = broadcasts.filter(b => !b.is_active);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="size-16 border-8 border-black border-t-primary animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Live Featured */}
      <div className="px-6 py-12 max-w-7xl mx-auto">
        {activeBroadcast ? (
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 rounded-none border-[6px] border-black bg-yellow-400 p-8 shadow-[12px_12px_0_0_#000] relative overflow-hidden group">
            {/* Background Cover for Page Banner */}
            <div className="absolute inset-0 z-0">
               {activeBroadcast.cover_url && (
                 <img src={activeBroadcast.cover_url} className="w-full h-full object-cover opacity-30 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt="" />
               )}
               <div className="absolute inset-0 bg-yellow-400/60"></div>
            </div>

            <div className="flex items-center gap-6 z-10">
              <div className="flex items-center gap-2 bg-black px-4 py-2 rounded-full animate-pulse shadow-lg">
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                <span className="text-white text-xs font-black tracking-widest uppercase italic">Estamos ao Vivo</span>
              </div>
              <div className="flex flex-col">
                <p className="text-black text-3xl font-black leading-tight uppercase italic">{activeBroadcast.title}</p>
                <p className="text-black/70 text-base font-bold uppercase tracking-tight">Narração: {activeBroadcast.narration}</p>
              </div>
            </div>
            <a 
              href={activeBroadcast.youtube_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex min-w-[240px] cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-none h-16 px-8 bg-black text-white text-xl font-black leading-normal transition-all hover:-translate-y-1 hover:translate-x-1 active:scale-95 shadow-[8px_8px_0_0_rgba(0,0,0,0.3)] group z-10"
            >
              <span className="material-symbols-outlined text-yellow-400 text-4xl group-hover:rotate-12 transition-transform">play_circle</span>
              <span className="truncate uppercase italic">Assistir Agora</span>
            </a>
          </div>
        ) : (
          <div className="py-12 bg-zinc-100 border-4 border-dashed border-black/10 text-center">
             <span className="material-symbols-outlined text-6xl text-zinc-300 mb-4">videocam_off</span>
             <p className="font-black uppercase italic text-zinc-400">Nenhuma transmissão ao vivo no momento</p>
          </div>
        )}
      </div>

      {/* Grid Header */}
      <div className="px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 py-10 border-b-8 border-black mb-10">
          <h2 className="text-black text-4xl font-black leading-tight tracking-tight uppercase italic">Arquivos de Transmissão</h2>
          <div className="h-2 flex-1 bg-yellow-400/20 rounded-full mt-2 relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-32 bg-yellow-400"></div>
          </div>
        </div>

        {/* Video Grid - Fixed with Real Cover Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-20">
          {pastBroadcasts.length > 0 ? pastBroadcasts.map((video, idx) => (
            <a 
              key={video.id || idx} 
              href={video.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col group cursor-pointer bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all"
            >
              <div className="relative w-full aspect-video bg-zinc-900 border-b-[4px] border-black overflow-hidden flex items-center justify-center">
                {video.cover_url ? (
                  <img src={video.cover_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
                ) : (
                  <span className="material-symbols-outlined text-white/20 text-7xl">play_circle</span>
                )}
                
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black text-primary px-6 py-3 border-2 border-primary shadow-2xl font-black uppercase text-xs flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">history</span> Replay Completo
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-black text-primary text-[10px] font-black px-2 py-0.5 uppercase italic">CONCLUÍDO</span>
                  <span className="text-black/60 font-black text-[10px] uppercase tracking-widest">{video.date_info}</span>
                </div>
                <h3 className="text-black text-xl font-black leading-tight mb-1 uppercase italic group-hover:underline">{video.title}</h3>
                <div className="flex items-center gap-2 text-black/50 text-[10px] font-bold uppercase mt-2">
                  <span className="material-symbols-outlined text-xs">location_on</span> {video.location}
                </div>
              </div>
            </a>
          )) : (
            <div className="col-span-full py-20 text-center border-4 border-dashed border-zinc-200 uppercase font-black italic text-zinc-300">
              Nenhum replay disponível no momento.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BroadcastPage;
