
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { supabase } from '../supabase';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Olá! Sou o assistente da Copa Serra Dourada. ⚽ Como posso te ajudar hoje? Tenho acesso em tempo real à classificação, resultados e transmissões ao vivo!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState<string>('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Acesso seguro à chave de API para evitar crash no Next.js Client Side
  const getApiKey = () => {
    try {
      return process.env.API_KEY || '';
    } catch {
      return '';
    }
  };

  const fetchTournamentData = async () => {
    try {
      const { data: teams } = await supabase.from('teams').select('*').order('points', { ascending: false });
      const { data: matches } = await supabase.from('matches').select('*, Mandante:home_team_id(name), Visitante:away_team_id(name)');
      const { data: broadcasts } = await supabase.from('broadcasts').select('*').eq('is_active', true);
      
      let contextStr = "Você é o assistente virtual oficial da Copa Serra Dourada. O torneio ocorre na região de Baixa do Mel desde 1982. É o Intermunicipal mais tradicional da região.\n\n";
      
      if (teams && teams.length > 0) {
        contextStr += "DADOS DE CLASSIFICAÇÃO (TABELA):\n";
        teams.forEach((t, i) => {
          contextStr += `${i+1}º ${t.name} | Grupo ${t.group} | Pts: ${t.points} | J: ${t.played} | Vit: ${t.wins}\n`;
        });
      }

      if (matches && matches.length > 0) {
        contextStr += "\nPARTIDAS E RESULTADOS:\n";
        matches.forEach(m => {
          contextStr += `- ${m.Mandante?.name} x ${m.Visitante?.name} | Status: ${m.status} | Placar: ${m.home_score}x${m.away_score} | Data: ${m.date} às ${m.time}\n`;
        });
      }

      if (broadcasts && broadcasts.length > 0) {
        contextStr += "\nTRANSMISSÕES AO VIVO AGORA:\n";
        broadcasts.forEach(b => {
          contextStr += `- ${b.title}: ${b.team_a} x ${b.team_b}. Narrador: ${b.narration}. Assista aqui: ${b.youtube_url}\n`;
        });
      }

      contextStr += "\nResponda sempre em Português. Seja breve, animado e use emojis de futebol. Informe links de transmissão se o usuário perguntar por onde assistir.";
      setContext(contextStr);
    } catch (e) {
      console.error("Erro ao alimentar bot:", e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchTournamentData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const apiKey = getApiKey();
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: context,
        },
      });

      const botText = response.text || "Estou com dificuldades táticas agora. Pode repetir a pergunta? ⚽";
      setMessages(prev => [...prev, { role: 'bot', text: botText }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'bot', text: "O campo está pesado e perdi a conexão! Tente novamente em instantes. ⚽" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-display">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="size-16 bg-primary border-4 border-black shadow-[6px_6px_0_0_#000] flex items-center justify-center hover:-translate-y-1 transition-all group active:shadow-none active:translate-x-1 active:translate-y-1"
      >
        <span className="material-symbols-outlined text-black text-3xl font-black group-hover:rotate-12 transition-transform">
          {isOpen ? 'close' : 'sports_soccer'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[500px] bg-white border-8 border-black shadow-[15px_15px_0_0_#000] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="bg-black text-white p-4 flex items-center gap-3">
            <div className="size-10 bg-primary border-2 border-white flex items-center justify-center rotate-3">
              <span className="material-symbols-outlined text-black font-black">smart_toy</span>
            </div>
            <div>
              <h4 className="font-black uppercase italic text-sm tracking-tighter">CopaBot Assistente</h4>
              <p className="text-[10px] text-primary font-bold uppercase opacity-70">Ligado na Baixa do Mel ⚽</p>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 scrollbar-hide">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`
                  max-w-[85%] p-3 font-bold text-sm shadow-[4px_4px_0_0_#000] border-2 border-black
                  ${msg.role === 'user' ? 'bg-primary text-black' : 'bg-black text-white'}
                `}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 border-2 border-black flex gap-1">
                  <div className="size-1.5 bg-black rounded-full animate-bounce"></div>
                  <div className="size-1.5 bg-black rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="size-1.5 bg-black rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t-4 border-black flex gap-2">
            <input 
              type="text" 
              placeholder="Quem está liderando?..." 
              className="bee-input flex-1 !h-12 !text-sm placeholder:italic"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={isTyping}
            />
            <button 
              onClick={handleSend}
              disabled={isTyping}
              className="bg-primary size-12 border-2 border-black flex items-center justify-center hover:bg-black hover:text-primary transition-colors disabled:opacity-50 shadow-[4px_4px_0_0_#000] active:shadow-none active:translate-x-1 active:translate-y-1"
            >
              <span className="material-symbols-outlined font-black">send</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
