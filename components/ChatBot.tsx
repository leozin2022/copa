
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { supabase } from '../supabase';

const ChatBot: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: 'Olá! Sou o assistente da Copa Serra Dourada. ⚽ Como posso te ajudar hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      // Inicialização seguindo as diretrizes oficiais: usa process.env.API_KEY injetado
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      // Busca contexto rápido do banco para enriquecer a resposta
      const { data: teams } = await supabase.from('teams').select('name, points').order('points', { ascending: false }).limit(3);
      const rankingContext = teams ? ` Lembre-se que os líderes são: ${teams.map(t => t.name).join(', ')}.` : '';

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: { 
          systemInstruction: `Você é o assistente oficial e animado da Copa Serra Dourada. Use gírias de futebol e muitos emojis. Responda sempre em Português do Brasil de forma concisa.${rankingContext}`,
          temperature: 0.8,
        },
      });

      // Acesso correto à propriedade .text (getter)
      const botText = response.text || 'Tive um problema na zaga e não consegui responder! ⚽';
      setMessages(prev => [...prev, { role: 'bot', text: botText }]);
    } catch (error) {
      console.error("Erro AI:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "Conexão perdida com o campo! Tente novamente em instantes. ⚽" }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-display" suppressHydrationWarning>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="size-16 bg-primary border-4 border-black shadow-[6px_6px_0_0_#000] flex items-center justify-center hover:-translate-y-1 transition-all active:shadow-none"
      >
        <span className="material-symbols-outlined text-black text-3xl font-black">
          {isOpen ? 'close' : 'chat'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[320px] md:w-[380px] h-[500px] bg-white border-8 border-black shadow-[15px_15px_0_0_#000] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-black text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-8 bg-primary border-2 border-white flex items-center justify-center rotate-3">
                <span className="material-symbols-outlined text-black font-black text-sm">smart_toy</span>
              </div>
              <h4 className="font-black uppercase italic text-xs tracking-widest">CopaBot</h4>
            </div>
            <div className="size-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 scrollbar-hide">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 font-bold text-[13px] border-2 border-black shadow-[3px_3px_0_0_#000] ${msg.role === 'user' ? 'bg-primary text-black' : 'bg-black text-white'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-zinc-200 border-2 border-black p-2 flex gap-1">
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
              className="bee-input flex-1 !h-10 !text-xs !font-black"
              placeholder="Pergunte sobre a Copa..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend} className="bg-primary size-10 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors">
              <span className="material-symbols-outlined font-black">send</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
