
import React from 'react';

const SelectionPage: React.FC = () => {
  const players = [
    { name: 'Alisson', pos: 'GK', grid: 'col-start-1 col-span-1 row-start-3 row-span-2', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBm_sxZmJMFy3oBQN6JD6mxUN9tzH6d_Ebci7aCluGr83rLKgTWKmQelqtlS9Dp7qwlDH2gNE66V1I5wKckkY2GkO5f6j0FW2uGAFKw1tlV3lkte_vC80V9sAcBthPYhtbZb_APOj1psa1RiOQnMIqUmdTABYbLBKCi9v6zQAuc8unpNYzUBuUMnA-MALb7IaJY2wSOnFf_xl_KAB15Ufsg9QunCc4DQaTZmdRevuhQE9evudScdfjTd_AxQOy4u8T1kYZuuaC3ixxK' },
    { name: 'Lodi', pos: 'LB', grid: 'col-start-3 col-span-1 row-start-1 row-span-2 flex items-end', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWm6OtP_M6Du-kNvQi93mQp4YKC-qFFMomxqw_hhRS59kGOL6YgW0WiuG0bocnG-UM53egdoqyrHSM6Nng0pBIc4cEHmjttvkHWEC5p2Dnwn6pfWUMjQLmiEYbsWz1G7kgAN0y1gbpDFxVjLCbqq0vsQwRDbci2U-HWQJNTghqa36OtSGVX5kbzdJO8-UGuwKB_73RI8-PGJxcvD--jjMvJzTJn0sxyxpSVhkYw9_ggwC2M62QOsTe-HfrMRrz0vJFobtVBhj75vdk' },
    { name: 'Marquinhos', pos: 'CB', grid: 'col-start-3 col-span-1 row-start-2 row-span-2', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDq-Fkw_qQjhJ5J6UpCwfOH9Dj9XFB3Guyi8Bt85hrAZY-nftOHcAsh0_JHV0kzqChNxFpNw_5W7ZuUd1A0cU-j3Pbn1ZOwsgz7RIU42WORAzv_Un3YEgYlldKxLodFBHrYu4ci0TaqVOqflbIIsn-tUVaX7-kyeLjMyy9NMAO1LsVQ8jlXf3vqo7np4aTBQHE1LhHBdfiTGPu7gwIgLhSFJC1l61yyM0Qzz8mzWHjEVgXiQ5hQUpfDWguHyZO5HyDYX7OLPY2pQqfG' },
    { name: 'Thiago', pos: 'CB', grid: 'col-start-3 col-span-1 row-start-4 row-span-2', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4BiR0aDHjuifLJ7hGA5aqtbfcXU6lhYdbrUjjWYf9pWI4aqORCLiP8ibYM4lbVO26c8l5n0-YKN4bTHI1WUgfGrefJchJ106xVy8aIu5_icSISKiigMK7rBrXUPW-PRkFJJE_xH7mpjygyVtLdDdjOfZ-kEjrJbAzsmefcDqQouK4fC2W1dPupRDyc6bUV8ehknuJ17X7tY8FM8DZzpcCkeuWp1DSKwFgOLyqP_n7cF7HtioHleX0lG6T1Pq6WxyS79ZuOFFWXJRP' },
    { name: 'Danilo', pos: 'RB', grid: 'col-start-3 col-span-1 row-start-5 row-span-2 flex items-start', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvGoprGY9-VeVCWA86u6EUA7GtTy3gmliThiRTbty1Q5SylWTyOnwpLEvgwFBpb9HtBR-d17kZHnOaAPTwQyQly19gkk-j1kooSTgFhWealQfDb6ENMh0Z1_76hjO2NR7JWUsyLtvkQDty8dLgmDEQankTe9pB5cPZ0JC0UWZzc52NXzVL84GicxEemvQdvtx54Y-rmSllWeLmch3iAPmbzhjAJabnOanKmHd8fkAlq0MPmcugD0Pm8cu1TIGQ6GovuHecyL-GDeoc' },
    { name: 'Paquetá', pos: 'CM', grid: 'col-start-6 col-span-1 row-start-1 row-span-3', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAuKga6E6z6BgSsxJyoXhyBPojfqBVbk4UeO7GHYMjT8AdCgrC-VQ5dUd-uhVA7MBNFV88xXawMGRcQw2dQw9e7-oQJ5h_DsW9F4lXiIEIR4HekvDIXjnxj_okoElAfXIMBBUaJRgqxT84Gji3EDpZXWGMPvrD7GssoSSq4mATsNr285R7qWvIbeNufSRX14dup3txLHlBt8UXuLgauqp6peNyZhBwH3rWWeFzdYkpTPg7B0lvzfoqmicjQCB1tny0giae6N-37Y1wS' },
    { name: 'Casemiro', pos: 'CDM', grid: 'col-start-6 col-span-1 row-start-2 row-span-3', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBncdEUv16yo5D3Co3SmPL0pbuH1n4fLzVXezbztyG_rOZDuMClIwbDXXAOKtD0z2zhDN_TrJfz5QMAEJ6Up3W6fA3b8ch_gh63EU0u71eXtte_b1xtkheo3ZyBpEoiz02z5Dk9WuziOpvfDJ2BjPjNVYY7QhmPzfwVwYMw6hwOVEv_oxtRrD-BvnKCAkULfC1F5ptXOPOCeSQ4sfZgda4zd0pWDXwkvKJB3SUgQT058QZ_dkVT3vQ7FZvXrTS6R97CbFhMagkckjJh' },
    { name: 'Neymar', pos: 'CAM', grid: 'col-start-6 col-span-1 row-start-4 row-span-3', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz-FrXo_kResaun-OuaArvwRl9Lq7hbPLIXeOSqEYPwbI3ulRAWSBejk-_I5zdK-bICkhFSc61BCuranh5Q7jaYkduOihgLGxVskNe71k8h6V5B4Zgk_cqch2h0mwXGqPk_qfgO0z432n7easGdIx8YibFnNeZHhLFFaCX2ubCgqUTuHFAQpMgfIIf-4-XceVQ15RUFRD8T2LM_MJuUzyZLmZXCtCqRk2pJ673vND5WC6aZFZ8tpsmPVjrLehyZhXVJiwld0eMYj51' },
    { name: 'Vinícius', pos: 'LW', grid: 'col-start-10 col-span-1 row-start-1 row-span-2 flex items-end', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCM58JwvJxG1e1Z_U7o5nYXkufflpVvNd0BwkqwMyRE7ae7CiZiUOeuT65lcWCyyvEdvtAmScDnQnoT4PWUx9MR8M5yMAQBDaMMlTpCuRfMAkf1vQqRq_33krhc1LixSM52sIZ2M5wRWCENMPSSmsif-tVy8puuaIfUfqPmfvWdXxjIeuTBdL8ZInSRqMjWRgKBFMcRO-Iap139EJbmwdZh7iFWWOt-VnqiQrJshLRHCA8N2vkr3JV1ZkGg1GYWsMIiaO0kLsS9YAuM' },
    { name: 'Richarlison', pos: 'ST', grid: 'col-start-10 col-span-1 row-start-3 row-span-2', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDeXcK9-bwC2e-mXQfkPTFc0Kp6VAaN5o9IlLnXiGTE0TfWwYaay8TbwBpZEQ_uC97f9bF_K4QJzl_P4G_Xm3-X84zPW1pYN6BoJGnvI0aUso5XTwspxt62Yw6yXP7wQdAQBrsE_nyQI2bC3OR4kABiRy2T09nbqOfYuN20RcpAXZIknWt60cgTENWRdn9WaybP9JxNiGN2B3kqeKKllEmZzOmw4-1-VOkDrOb2WjabLFk51XLx88G3mU0NWawr5hxCX_nefecfPvWx' },
    { name: 'Raphinha', pos: 'RW', grid: 'col-start-10 col-span-1 row-start-5 row-span-2 flex items-start', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgzF_COMmFRjrl2SLgyi0FTS9T4J-zkaVzYN8szcF0NEZu19511Dv7k3WulVQeLCm2U8kkizPch_arHoqZOD5VjIpOSxxiJrLaBDjXO3PXxGjabJpUBp52opf9vhlGhqm03k-EiAyhglzbFETbmYp3XboSbg5SXB0aA4-Xp7I0O1kko17qyQCzFytJELaeaa4mTeiIICHVphPcaybIhDbYQsrYMPNebJ1YO1LAIT563xefcOcNJm6omKgMsiYBrqPnvQgvlLV1KDu7' },
  ];

  return (
    <div className="bg-zinc-50 min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b-8 border-black pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-600 font-black uppercase text-sm tracking-widest">
              <span className="w-8 h-1 bg-green-600 rounded-full"></span>
              Rodada 12
            </div>
            <h2 className="text-6xl font-black italic uppercase leading-none">Seleção da Rodada</h2>
            <p className="text-zinc-500 font-bold max-w-lg uppercase text-xs">Os melhores atletas que brilharam nos gramados da Serra Dourada nesta última semana.</p>
          </div>
          
          <div className="flex flex-wrap items-end gap-4 w-full md:w-auto">
            <div className="flex flex-col gap-2 min-w-[200px]">
              <span className="text-[10px] font-black uppercase text-zinc-400">Esquema Tático</span>
              <div className="relative">
                <select className="w-full bg-white border-4 border-black px-4 py-3 font-black uppercase text-xs appearance-none focus:ring-yellow-500 focus:border-yellow-500">
                  <option>4-3-3 Atacante</option>
                  <option>4-4-2 Diamante</option>
                  <option>3-5-2 Ofensivo</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none font-black">expand_more</span>
              </div>
            </div>
            <button className="bg-yellow-500 text-black border-4 border-black px-8 py-4 font-black uppercase flex items-center gap-2 hover:translate-y-[-4px] transition-transform shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0">
              <span className="material-symbols-outlined">download</span>
              Exportar
            </button>
          </div>
        </div>

        {/* Pitch Container */}
        <div className="relative w-full aspect-[4/3] md:aspect-[16/9] bg-green-800 rounded-3xl border-[6px] border-black shadow-2xl overflow-hidden mb-16">
          {/* Pitch Lines and Grass Texture */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: 'repeating-linear-gradient(90deg, #2d5a27, #2d5a27 50px, #274e22 50px, #274e22 100px)' }}></div>
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
          
          <div className="absolute inset-4 border-2 border-white/40 pointer-events-none rounded-sm">
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-white/40"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-32 md:size-48 border-2 border-white/40 rounded-full"></div>
            <div className="absolute top-1/4 bottom-1/4 left-0 w-24 md:w-40 border-r-2 border-y-2 border-white/40"></div>
            <div className="absolute top-1/4 bottom-1/4 right-0 w-24 md:w-40 border-l-2 border-y-2 border-white/40"></div>
          </div>

          {/* Players Grid */}
          <div className="relative h-full w-full p-12 grid grid-cols-12 grid-rows-6">
            {players.map((p, idx) => (
              <div key={idx} className={`${p.grid} flex justify-center items-center`}>
                <div className="group relative flex flex-col items-center cursor-pointer transition-transform hover:scale-110">
                  <div className="size-16 md:size-24 rounded-full border-4 border-yellow-500 bg-black overflow-hidden shadow-2xl ring-4 ring-yellow-500/20">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  </div>
                  <div className="mt-2 bg-black text-white px-3 py-1 rounded-lg text-[10px] md:text-xs font-black border-2 border-yellow-500 uppercase italic shadow-lg whitespace-nowrap">
                    {p.name} ({p.pos})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <span className="material-symbols-outlined text-4xl text-green-600 mb-4 font-black">stars</span>
            <h3 className="text-xl font-black uppercase italic mb-2">Craque da Semana</h3>
            <p className="text-zinc-500 font-bold text-sm leading-tight">Vinícius Júnior brilhou com 2 gols e uma assistência, liderando a equipe rumo à vitória no clássico regional.</p>
          </div>
          <div className="bg-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <span className="material-symbols-outlined text-4xl text-yellow-500 mb-4 font-black">emoji_events</span>
            <h3 className="text-xl font-black uppercase italic mb-2">Melhor Ataque</h3>
            <p className="text-zinc-500 font-bold text-sm leading-tight">Com média de 3.2 gols por partida, o setor ofensivo desta rodada bateu recordes de eficiência.</p>
          </div>
          <div className="bg-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <span className="material-symbols-outlined text-4xl text-zinc-400 mb-4 font-black">shield</span>
            <h3 className="text-xl font-black uppercase italic mb-2">Defesa de Aço</h3>
            <p className="text-zinc-500 font-bold text-sm leading-tight">Apenas 1 gol sofrido em 5 jogos entre os defensores selecionados para o time ideal.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionPage;
