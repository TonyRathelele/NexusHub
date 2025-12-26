
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getNotes } from '../services/noteService';
import { Note } from '../types';
import { useAuth } from '../contexts/AuthContext';

const LandingPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [uniFilter, setUniFilter] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      const data = await getNotes();
      setNotes(data);
      setLoading(false);
    };
    fetchNotes();
  }, []);

  const universitySuggestions = useMemo(() => {
    return Array.from(new Set(notes.map(n => n.university))).sort();
  }, [notes]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white min-h-screen font-['Plus_Jakarta_Sans'] selection:bg-indigo-100 selection:text-indigo-900 scroll-smooth">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-2xl z-50 border-b border-slate-200/60 shadow-[0_2px_20px_-10px_rgba(79,70,229,0.1)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-indigo-200 transition-transform group-hover:scale-110">
                <i className="fa-solid fa-graduation-cap text-white"></i>
              </div>
              <span className="text-2xl font-black text-slate-950 tracking-tighter">NexusHub</span>
            </Link>
            <div className="hidden md:flex items-center space-x-10 text-xs font-black text-slate-600 uppercase tracking-[0.2em]">
              <button onClick={() => scrollToSection('solutions')} className="hover:text-indigo-600 transition-colors">Solutions</button>
              <button onClick={() => scrollToSection('study-tools')} className="hover:text-indigo-600 transition-colors">Study Tools</button>
              <button onClick={() => scrollToSection('educators')} className="hover:text-indigo-600 transition-colors">For Educators</button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
               <Link to="/dashboard" className="px-8 py-2.5 bg-indigo-600 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all flex items-center space-x-2">
                 <span>Open Workspace</span>
                 <i className="fa-solid fa-arrow-right"></i>
               </Link>
            ) : (
              <>
                <Link to="/auth" className="px-6 py-2.5 text-slate-700 font-black hover:text-indigo-600 transition-all text-xs uppercase tracking-widest">Log In</Link>
                <Link to="/auth" className="px-8 py-2.5 bg-indigo-600 text-white rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all">Sign Up Free</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-20 overflow-hidden">
        {/* Hero Section */}
        <section className="bg-[#020617] py-32 md:py-48 px-6 relative overflow-hidden">
          {/* Mesh Gradients for Premium Look */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            <div className="absolute -top-[10%] -right-[10%] w-[600px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full"></div>
            <div className="absolute top-[20%] -left-[10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-0 right-[20%] w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full"></div>
          </div>

          <div className="max-w-7xl mx-auto text-center space-y-12 relative z-10">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full animate-fadeIn">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">New: Gemini AI Summaries Now Active</span>
            </div>

            <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-[0.9] drop-shadow-2xl">
              Elevate your studies <br/><span className="text-indigo-500">with verified notes.</span>
            </h1>
            
            <p className="text-slate-400 max-w-3xl mx-auto text-lg md:text-2xl font-medium leading-relaxed opacity-90">
              Join the academic network using AI-enhanced peer resources, <br className="hidden md:block"/> 24/7 tutor support, and institutional exam summaries.
            </p>

            <div className="max-w-4xl mx-auto pt-12">
              <div 
                onClick={() => navigate(user ? '/dashboard' : '/auth')}
                className="group cursor-pointer bg-white/[0.03] backdrop-blur-md border-2 border-dashed border-white/10 rounded-[3rem] p-12 md:p-24 transition-all hover:border-indigo-500 hover:bg-white/[0.05] hover:shadow-[0_0_100px_rgba(79,70,229,0.15)] relative overflow-hidden"
              >
                <div className="flex flex-col items-center space-y-8 relative z-10">
                  <div className="w-24 h-24 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center text-4xl shadow-2xl shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
                      {user ? 'Continue to your workspace' : 'Ready to start sharing?'}
                    </h2>
                    <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">Drag and drop academic PDFs or browse the hub</p>
                  </div>
                </div>
                {/* Decorative Internal Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section id="solutions" className="py-32 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2 space-y-8">
                <span className="text-indigo-600 font-black uppercase tracking-widest text-xs">Our Solutions</span>
                <h2 className="text-5xl font-black text-slate-950 leading-tight tracking-tight">Verified Academic <br/>Knowledge Exchange</h2>
                <p className="text-slate-600 text-lg leading-relaxed font-medium">NexusHub provides a centralized repository where students from top universities share their lecture notes, summaries, and exam preparations. Every resource is verified by our community to ensure quality.</p>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <i className="fa-solid fa-circle-check text-indigo-600 text-xl"></i>
                    <p className="font-black text-slate-900 text-sm">Peer Verified</p>
                    <p className="text-slate-500 text-xs font-medium">Community vetted accuracy.</p>
                  </div>
                  <div className="space-y-3">
                    <i className="fa-solid fa-bolt text-indigo-600 text-xl"></i>
                    <p className="font-black text-slate-900 text-sm">Instant Access</p>
                    <p className="text-slate-500 text-xs font-medium">Direct cloud downloads.</p>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 w-full h-[400px] bg-slate-200 rounded-[3rem] shadow-inner flex items-center justify-center relative overflow-hidden group">
                 <i className="fa-solid fa-layer-group text-slate-300 text-[12rem] group-hover:scale-110 transition-transform duration-700"></i>
                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Study Tools Section */}
        <section id="study-tools" className="py-32 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <span className="text-indigo-600 font-black uppercase tracking-widest text-xs">Modern Study Stack</span>
              <h2 className="text-5xl font-black text-slate-950 mt-4 tracking-tight">AI-Enhanced Learning Tools</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: 'fa-wand-magic-sparkles', title: 'AI Summaries', desc: 'Transform long lecture notes into concise, structured abstracts using Gemini AI.' },
                { icon: 'fa-file-pdf', title: 'PDF Archive', desc: 'Securely store and share original PDF course materials and diagrams.' },
                { icon: 'fa-tags', title: 'Smart Taxonomy', desc: 'Filter resources by University, Faculty, and specific Module codes instantly.' }
              ].map((tool, i) => (
                <div key={i} className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:border-indigo-500 transition-all hover:bg-white hover:shadow-2xl hover:shadow-indigo-100 group">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl text-indigo-600 shadow-sm mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <i className={`fa-solid ${tool.icon}`}></i>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-4">{tool.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* For Educators Section */}
        <section id="educators" className="py-32 px-6 bg-slate-950 text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2 w-full">
                <div className="w-full aspect-video bg-indigo-600/10 rounded-[3rem] border border-indigo-500/20 flex items-center justify-center">
                   <i className="fa-solid fa-users-viewfinder text-indigo-500 text-8xl"></i>
                </div>
              </div>
              <div className="lg:w-1/2 space-y-8">
                <span className="text-indigo-400 font-black uppercase tracking-widest text-xs">For Educators</span>
                <h2 className="text-5xl font-black leading-tight tracking-tight">Empowering the <br/>Academic Ecosystem</h2>
                <p className="text-slate-400 text-lg leading-relaxed font-medium">We partner with student bodies and educators to provide a secure platform for supplementary material distribution. Monitor engagement and ensure your students have the best peer-support available.</p>
                <ul className="space-y-4">
                  {['Institutional Dashboard Access', 'Verified Content Badging', 'Analytics & Insights'].map((item, i) => (
                    <li key={i} className="flex items-center space-x-3">
                      <i className="fa-solid fa-check text-indigo-400"></i>
                      <span className="font-bold text-slate-200">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full"></div>
        </section>

        {/* Schools & Search Section */}
        <section className="w-full bg-white py-32 px-6 border-y border-slate-100">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <span className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full text-xs font-black uppercase tracking-widest">Global Repository</span>
              <h2 className="text-6xl font-black text-slate-950 leading-[1.05] tracking-tighter">
                Find materials for <br/><span className="text-indigo-600">your institution.</span>
              </h2>
            </div>
            <div className="flex-1 w-full">
              <div className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-200">
                <div className="space-y-10">
                  <div className="flex flex-col space-y-4">
                    <label className="text-indigo-600 font-black uppercase tracking-[0.3em] text-[10px]">Step 1: Select University</label>
                    <div className="relative">
                      <input 
                        list="landing-uni-list"
                        type="text" 
                        placeholder="Search Institution Name..."
                        className="w-full px-8 py-5 bg-white border-2 border-slate-100 rounded-2xl text-slate-900 font-bold outline-none text-xl placeholder:text-slate-300"
                        value={uniFilter}
                        onChange={(e) => setUniFilter(e.target.value)}
                      />
                      <datalist id="landing-uni-list">
                        {universitySuggestions.map(uni => <option key={uni} value={uni} />)}
                      </datalist>
                    </div>
                  </div>
                  <button onClick={() => navigate(user ? '/dashboard' : '/auth')} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500 transition-all flex items-center justify-center space-x-3 group">
                    <span>Enter Library</span>
                    <i className="fa-solid fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950 text-slate-400 py-24 px-6 text-center">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-50">&copy; 2025 Nexus Academic Network • Encrypted & Secure</p>
      </footer>
    </div>
  );
};

export default LandingPage;
