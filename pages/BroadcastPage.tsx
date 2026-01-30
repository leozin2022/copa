
import React from 'react';

const BroadcastPage: React.FC = () => {
  const pastBroadcasts = [
    { title: 'Final: Goiás EC vs Vila Nova', date: '12 Out 2023', duration: '2:15:00', views: '14.5k', thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPhlT-xdmk1iYVg3blJT7XjC_qukdaGldx94NA7puk-Pihv2uLcWR3yzYB5J0qTzbBrpriH7DT_opCxJHh6MXD4MpV2ruXAiExb9DK2-rIFrbtY3SWZAeIed7Nvuy5fIKtWUPEwd1dIoI4wgDsUOdG1tnb6ZMlAR-V9WzSc7GOqjPQ6t4sS8crpU2RCJtooDFscUQY3Ua35ax-PUEvf__DxqvusqElZS53pPWPcTCm45JEs3NqBR6iJQunrUj_hFl8cv1QWa0f_WFE' },
    { title: 'Semi: Serraria vs Independente', date: '10 Out 2023', duration: '1:55:20', views: '8.2k', thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3xtvbWY3PRy92lUtQA_AdK1LSjvfdJad63zja8ppZcmN-B0ug_w3BJq60foDDvLXz3YmURn9sMRWg1QFjLlSN79R-7BgUXp5bVJ1I38vpVxSIkcBJWyL0JhgOnoUaK1aGfjBFkNnchb2D93Akppb55Rs9TbEhPRIA6sp-gDQiREeaURpSx_Ud2JNrd82wlJpCifpxkIPyYy2v-KiS1cIOHWN8a48ZTfvjim0z-S4gSJhCh5xE5GeX_4eGuz7huR6G4Vn69lwXObR_' },
    { title: 'Quartas: Goiânia vs Anápolis', date: '08 Out 2023', duration: '2:01:10', views: '5.1k', thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCB3xH05LLLV8jf-Ju9eqCkTJ2LBaB2xR6pbtvl_9UM04ldv2R9ajOnee2NEzRsVz0QLHpBQArqtDloFRtns3kZePnCT6yzi3zxw3C5EJjw58ZR_erxQ0VzrwbX2j87aePyE2MnralTVyoImu-zH2XT66r5xVkSTnsJ39D-7wUMdOQcKZ4Js4Gc88GJk-y-yMW3UCl9bVVODie3DRKPlxSYMiyWinuSRNiOnOxaP1fIZKKj1v2NeDPZm8fxxtFFRV2Ml2aa2ZomUZVA' },
    { title: 'Rodada 3: Morrinhos vs Grêmio', date: '05 Out 2023', duration: '1:44:00', views: '3.9k', thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqNCGFqHIIUXJl7-V-jcUFVpWTaiRZacwivYpb2OKx8lgmj0k3lG5pXNVJlQFdNeX33hqFMIq49AljsnksBI0wP-MkFfUDBkLO3c-zdc_gczVHtRwDf4zl8Dlu3PjE_XVWCmqztoeIHtSuCpz-1Tl1wZ1_3Ii2uS9Z_oy_Lf6Lwxh1TK4YIExamjDCXULEVvN3CQbUnoXUhr101Va8Vk0r1WhUJGBXhiK6dBGbIISpJRLG1Z4mmzelQTRp29wxeoD1tHVwox7ew4YW' },
    { title: 'Rodada 2: Jataiense vs Inhumas', date: '03 Out 2023', duration: '1:58:30', views: '2.5k', thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0TwysW4ihaWXw0-4g7zNpaH9PWsD2VQzVQ0s2pShDB1McHnBZbq8DiDofv4_MTMKDatSNJ9_tYF2Vr7HTtZjx6heeL1MDmNy5PnXYZN-TOcWbYFLsKM2mDuoeKX32VmsReKDOHjCQGbniAgniu9fam1XLrVWiTw0I_DALQ_Qkad6Ty6xtgXXHPoXOYnG53t4NRdwjWPuVQwAywzH3dhJWfjTX4hAFq0zn-ZYa9Hp85_h5VLrxu6v0cFvHWbENSqPKVelxrd7TRfdL' },
    { title: 'Abertura: Destaques Oficiais', date: '01 Out 2023', duration: '0:45:00', views: '1.2k', thumb: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRgrfCqQiLxTu1AWM-9nXIOeHZbqMQ8ifC1ygMj1X-5L5NmzqKvAtATdPY-HLN1FSft8CrGi2ysx0a9H2vpF7Yah_YE4K1oUaxDMw6W-FkAHpuKAF9IPXZGhNj_zZamKXI5veq5SAsGERGssdhcOIDjQQL2t9fJMIPR-gtwFhsvN8XoTPC8tqAbcTJyhfZHsXPCfR67mHriFQI3Ziyxsv2Yyvmbf95B4Cr75PRLVCsZD8Cb8sRCRUY_61uB6c4zTeEbXolG_5Z09tI' },
  ];

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Live Featured */}
      <div className="px-6 py-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 rounded-2xl border-[6px] border-black bg-yellow-400 p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-20 bg-black rotate-45 translate-x-1/2 -translate-y-1/2 opacity-5"></div>
          <div className="flex items-center gap-6 z-10">
            <div className="flex items-center gap-2 bg-black px-4 py-2 rounded-full animate-pulse shadow-lg">
              <div className="w-3 h-3 bg-red-600 rounded-full"></div>
              <span className="text-white text-xs font-black tracking-widest uppercase italic">Estamos ao Vivo</span>
            </div>
            <div className="flex flex-col">
              <p className="text-black text-3xl font-black leading-tight uppercase italic">FINAL: GOIÁS EC vs VILA NOVA</p>
              <p className="text-black/70 text-base font-bold uppercase tracking-tight">Narração Especial: Acompanhe o maior clássico regional!</p>
            </div>
          </div>
          <a className="flex min-w-[240px] cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-xl h-16 px-8 bg-black text-white text-xl font-black leading-normal transition-all hover:scale-105 active:scale-95 shadow-xl group z-10" href="#">
            <span className="material-symbols-outlined text-yellow-400 text-4xl group-hover:rotate-12 transition-transform">play_circle</span>
            <span className="truncate uppercase italic">Assistir Agora</span>
          </a>
        </div>
      </div>

      {/* Grid Header */}
      <div className="px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 py-10 border-b-8 border-black mb-10">
          <h2 className="text-bee-black text-4xl font-black leading-tight tracking-tight uppercase italic">Transmissões Anteriores</h2>
          <div className="h-2 flex-1 bg-yellow-400/20 rounded-full mt-2 relative overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-32 bg-yellow-400"></div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 pb-20">
          {pastBroadcasts.map((video, idx) => (
            <div key={idx} className="flex flex-col group cursor-pointer bg-yellow-400 rounded-2xl overflow-hidden border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
              <div className="relative w-full aspect-video bg-cover bg-center border-b-[4px] border-black overflow-hidden" style={{ backgroundImage: `url(${video.thumb})` }}>
                <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors"></div>
                <div className="absolute bottom-2 right-2 bg-black px-3 py-1 rounded-lg text-[10px] font-black text-white italic border border-yellow-400/50">{video.duration}</div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black text-white px-6 py-3 rounded-xl font-black uppercase text-sm flex items-center gap-2 border-2 border-yellow-400 shadow-2xl">
                    <span className="material-symbols-outlined">play_arrow</span> Replay Completo
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-black text-yellow-400 text-[10px] font-black px-2 py-0.5 rounded uppercase italic">REPLAY</span>
                  <span className="text-black/60 font-black text-[10px] uppercase tracking-widest">{video.date}</span>
                </div>
                <h3 className="text-black text-xl font-black leading-tight mb-1 uppercase italic group-hover:underline">{video.title}</h3>
                <div className="flex items-center gap-2 text-black/50 text-[10px] font-bold uppercase mt-2">
                  <span className="material-symbols-outlined text-xs">visibility</span> {video.views} visualizações
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BroadcastPage;
