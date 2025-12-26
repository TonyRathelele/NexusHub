
import React, { useState, useRef, useEffect } from 'react';
import { chatWithBuddy } from '../services/geminiService';

const StudyBuddy: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: "Hey there! I'm your Nexus Study Buddy. What are we tackling today? Whether it's complex calculus or a history summary, I've got your back." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await chatWithBuddy(userMsg, history);
    setMessages(prev => [...prev, { role: 'model', text: response || "I'm stumped. Let's try that again." }]);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-180px)] flex flex-col space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Study Buddy</h1>
          <p className="text-xs font-black uppercase tracking-widest text-indigo-600">Active AI Session</p>
        </div>
        <div className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 rounded-full border border-indigo-100">
           <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
           <span className="text-[10px] font-black text-indigo-600 uppercase">Gemini 3 Flash</span>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-6 rounded-3xl text-sm font-medium leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none'
              }`}>
                {m.text.split('\n').map((line, j) => (
                  <p key={j} className={line.startsWith('-') || line.startsWith('*') ? 'ml-4 mb-1' : 'mb-2'}>{line}</p>
                ))}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-50 p-6 rounded-3xl rounded-tl-none border border-slate-100 flex items-center space-x-2">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        <form onSubmit={handleSend} className="p-6 bg-slate-50 border-t border-slate-100">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Ask anything... (e.g., Explain Quantum Entanglement)"
              className="w-full pl-6 pr-16 py-5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-slate-900"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              type="submit"
              disabled={loading}
              className="absolute right-3 top-3 bottom-3 w-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudyBuddy;
