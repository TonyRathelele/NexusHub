
import React, { useState, useMemo } from 'react';
import { getCareerAdvice } from '../services/geminiService';

const CareerAdvisor: React.FC = () => {
  const [subjects, setSubjects] = useState<{ id: number, name: string, mark: string }[]>([
    { id: 1, name: 'English', mark: '' },
    { id: 2, name: 'Mathematics', mark: '' },
    { id: 3, name: 'Life Orientation', mark: '' }
  ]);
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateAPS = (mark: number) => {
    if (mark >= 80) return 7;
    if (mark >= 70) return 6;
    if (mark >= 60) return 5;
    if (mark >= 50) return 4;
    if (mark >= 40) return 3;
    if (mark >= 30) return 2;
    return 1;
  };

  const totalAPS = useMemo(() => {
    return subjects.reduce((sum, s) => {
      const mark = parseInt(s.mark) || 0;
      // Many SA universities exclude LO or handle it differently, but for general calc:
      return sum + calculateAPS(mark);
    }, 0);
  }, [subjects]);

  const addSubject = () => {
    setSubjects([...subjects, { id: Date.now(), name: '', mark: '' }]);
  };

  const updateSubject = (id: number, field: 'name' | 'mark', value: string) => {
    setSubjects(subjects.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const removeSubject = (id: number) => {
    if (subjects.length > 3) setSubjects(subjects.filter(s => s.id !== id));
  };

  const handleConsult = async () => {
    if (subjects.some(s => !s.name || !s.mark)) {
      alert("Please fill in all subject details.");
      return;
    }
    setLoading(true);
    const result = await getCareerAdvice(
      subjects.map(s => ({ name: s.name, mark: parseInt(s.mark) })),
      totalAPS
    );
    setAdvice(result);
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fadeIn pb-20">
      <header className="text-center md:text-left space-y-4">
        <h1 className="text-5xl font-black text-slate-950 tracking-tighter">Grade 12 Gateway</h1>
        <p className="text-slate-500 font-medium text-lg">Calculate your APS and get AI-powered university course recommendations.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* APS Calculator */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">APS Calculator</h2>
            <div className="bg-indigo-600 text-white px-6 py-2 rounded-2xl text-2xl font-black shadow-lg shadow-indigo-200">
              {totalAPS} <span className="text-[10px] uppercase opacity-60">Points</span>
            </div>
          </div>

          <div className="space-y-4">
            {subjects.map(s => (
              <div key={s.id} className="flex items-center space-x-4 animate-fadeIn">
                <input 
                  type="text" 
                  placeholder="Subject Name" 
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-indigo-500 font-bold text-slate-800"
                  value={s.name}
                  onChange={(e) => updateSubject(s.id, 'name', e.target.value)}
                />
                <input 
                  type="number" 
                  placeholder="%" 
                  className="w-24 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-indigo-500 font-bold text-slate-800 text-center"
                  value={s.mark}
                  onChange={(e) => updateSubject(s.id, 'mark', e.target.value)}
                />
                <button onClick={() => removeSubject(s.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                  <i className="fa-solid fa-circle-xmark"></i>
                </button>
              </div>
            ))}
          </div>

          <button onClick={addSubject} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-black text-xs uppercase tracking-widest hover:border-indigo-500 hover:text-indigo-600 transition-all">
            <i className="fa-solid fa-plus mr-2"></i> Add Subject
          </button>

          <button 
            onClick={handleConsult}
            disabled={loading}
            className="w-full py-5 bg-slate-950 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-600 transition-all shadow-xl disabled:opacity-50"
          >
            {loading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : "Consult Career Advisor"}
          </button>
        </div>

        {/* AI Recommendations */}
        <div className="bg-[#020617] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-3xl rounded-full"></div>
          
          <div className="relative z-10 space-y-8 h-full flex flex-col">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-xl">
                <i className="fa-solid fa-user-tie"></i>
              </div>
              <div>
                <h3 className="text-xl font-black">AI Recommendations</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Powered by Nexus Intelligence</p>
              </div>
            </div>

            <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-8 overflow-y-auto max-h-[500px] custom-scrollbar">
              {advice ? (
                <div className="text-sm font-medium leading-relaxed text-slate-300 space-y-4">
                  {advice.split('\n').map((para, i) => (
                    para.trim() ? <p key={i}>{para}</p> : null
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                  <i className="fa-solid fa-brain text-5xl"></i>
                  <p className="text-xs font-black uppercase tracking-[0.2em]">Waiting for Calculation...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerAdvisor;
