
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getNotes } from '../services/noteService';
import { generateMasterStudyGuide } from '../services/geminiService';
import { Note, Category } from '../types';
import NoteCard from '../components/NoteCard';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<{uni?: string, faculty?: string, module?: string}>({});
  const [generatingGuide, setGeneratingGuide] = useState(false);
  const [studyGuide, setStudyGuide] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      const data = await getNotes();
      setNotes(data);
      setLoading(false);
    };
    fetchNotes();
  }, []);

  const userName = user?.email?.split('@')[0] || 'Scholar';
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const universityList = useMemo(() => {
    return Array.from(new Set(notes.map(n => n.university))).sort();
  }, [notes]);

  const filteredNotes = notes.filter(note => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.university.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesUni = !activeFilter.uni || note.university === activeFilter.uni;
    return matchesSearch && matchesUni;
  });

  const clearFilters = () => {
    setActiveFilter({});
    setSearchQuery('');
  };

  const handleGenerateStudyGuide = async () => {
    if (notes.length === 0) return;
    setGeneratingGuide(true);
    const result = await generateMasterStudyGuide(notes.slice(0, 10));
    setStudyGuide(result);
    setGeneratingGuide(false);
  };

  return (
    <div className="space-y-0 -mt-10 -mx-4 md:-mx-10 animate-fadeIn">
      {/* Premium Studio Hero */}
      <section className="bg-[#020617] pt-20 pb-32 px-6 md:px-12 relative overflow-hidden border-b border-white/5">
        {/* Mesh Gradients */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 -left-[10%] w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">System Online • Cloud Sync Active</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
                {greeting()}, <br/>
                <span className="text-indigo-500">{userName}.</span>
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-3xl text-center min-w-[100px]">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Your Shared</p>
                <p className="text-2xl font-black text-white">{notes.filter(n => n.author === userName).length}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-3xl text-center min-w-[100px]">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Hub Ranking</p>
                <p className="text-2xl font-black text-indigo-400">#12</p>
              </div>
            </div>
          </div>

          <div className="mt-12 max-w-3xl">
            <div className="relative group">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <i className="fa-solid fa-magnifying-glass text-slate-500 group-focus-within:text-indigo-400 transition-colors"></i>
              </div>
              <input 
                type="text" 
                placeholder="Search resources, modules, or ask Gemini..."
                className="w-full pl-16 pr-6 py-6 bg-white/5 border border-white/10 rounded-[2rem] text-white placeholder:text-slate-600 outline-none focus:bg-white/10 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all text-lg font-bold"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-6 inset-y-0 flex items-center">
                <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-black text-slate-400 border border-white/10">⌘ K</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="bg-white rounded-t-[3rem] -mt-10 relative z-20 min-h-screen px-6 md:px-12 pt-12 pb-20">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Quick Action Tiles - Updated with Visible Light Color */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              onClick={() => navigate('/create')}
              className="group cursor-pointer p-8 bg-indigo-50/60 rounded-[2.5rem] border border-indigo-100 hover:border-indigo-500 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100 transition-all flex flex-col justify-between h-52"
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <i className="fa-solid fa-plus text-xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Publish Note</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Upload PDF or Text</p>
              </div>
            </div>

            <div 
              onClick={handleGenerateStudyGuide}
              className="group cursor-pointer p-8 bg-indigo-50/60 rounded-[2.5rem] border border-indigo-100 hover:border-indigo-500 hover:bg-white hover:shadow-2xl hover:shadow-indigo-100 transition-all flex flex-col justify-between h-52"
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">
                {generatingGuide ? <i className="fa-solid fa-circle-notch animate-spin text-xl"></i> : <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">AI Study Guide</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{generatingGuide ? 'Generating Plan...' : 'Generate from Library'}</p>
              </div>
            </div>

            <div 
              onClick={() => navigate('/career-advisor')}
              className="group cursor-pointer p-8 bg-indigo-600 rounded-[2.5rem] shadow-xl shadow-indigo-200 hover:scale-[1.02] transition-all flex flex-col justify-between h-52 text-white"
            >
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white">
                <i className="fa-solid fa-graduation-cap text-xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-black">Grade 12 Gateway</h3>
                <p className="text-xs font-black text-white/60 uppercase tracking-widest mt-1">APS Calculator & Career AI</p>
              </div>
            </div>
          </div>

          {/* Study Guide Reveal Section */}
          {studyGuide && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-[3rem] p-10 space-y-6 animate-fadeIn relative overflow-hidden">
               <button onClick={() => setStudyGuide(null)} className="absolute top-6 right-6 text-indigo-400 hover:text-indigo-600 transition-colors">
                 <i className="fa-solid fa-circle-xmark text-2xl"></i>
               </button>
               <h3 className="text-2xl font-black text-indigo-900 flex items-center">
                 <i className="fa-solid fa-rocket mr-3"></i> Master Study Plan Generated
               </h3>
               <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-sm font-medium leading-relaxed text-indigo-800 space-y-4">
                  {studyGuide.split('\n').map((line, i) => <p key={i}>{line}</p>)}
               </div>
            </div>
          )}

          {/* Institutional Navigation */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Institutional Browsing</h2>
              {activeFilter.uni && <button onClick={clearFilters} className="text-xs font-black text-indigo-600 hover:underline">Show All Hubs</button>}
            </div>
            <div className="flex items-center space-x-4 overflow-x-auto pb-4 no-scrollbar">
              <button 
                onClick={clearFilters}
                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  !activeFilter.uni ? 'bg-slate-900 text-white shadow-xl' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                }`}
              >
                Global Hub
              </button>
              {universityList.map(uni => (
                <button 
                  key={uni}
                  onClick={() => setActiveFilter({ uni })}
                  className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeFilter.uni === uni ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  {uni}
                </button>
              ))}
            </div>
          </div>

          {/* Main Feed */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-slate-950 tracking-tighter">
                {activeFilter.uni ? `${activeFilter.uni} Repository` : "Your Personalized Feed"}
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-indigo-50/60 rounded-[2.5rem] h-80 animate-pulse border border-indigo-100"></div>
                ))}
              </div>
            ) : filteredNotes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredNotes.map(note => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            ) : (
              <div className="py-32 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <i className="fa-solid fa-magnifying-glass text-4xl text-slate-200 mb-6"></i>
                <h3 className="text-xl font-black text-slate-900">No resources found in this hub</h3>
                <p className="text-slate-400 mt-2 font-medium">Try broadening your search or switching institutions.</p>
                <button onClick={clearFilters} className="mt-8 px-8 py-3 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                  Reset Explorer
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
