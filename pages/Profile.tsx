
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotes } from '../services/noteService';
import { Note } from '../types';
import { useAuth } from '../contexts/AuthContext';
import NoteCard from '../components/NoteCard';

const Profile: React.FC = () => {
  const [userNotes, setUserNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const userName = user?.email?.split('@')[0] || 'Contributor';

  useEffect(() => {
    const fetchMyNotes = async () => {
      setLoading(true);
      const allNotes = await getNotes();
      // Filter notes by current user. Note: note.author is a string derived from email.
      // In a production app, we'd filter by user_id in the DB.
      const filtered = allNotes.filter(n => n.author === userName);
      setUserNotes(filtered);
      setLoading(false);
    };
    fetchMyNotes();
  }, [userName]);

  const stats = useMemo(() => {
    return {
      total: userNotes.length,
      verified: userNotes.filter(n => n.isVerified).length,
      institutions: Array.from(new Set(userNotes.map(n => n.university))).length
    };
  }, [userNotes]);

  return (
    <div className="space-y-0 -mt-10 -mx-4 md:-mx-10 animate-fadeIn">
      {/* Profile Studio Header */}
      <section className="bg-[#020617] pt-20 pb-32 px-6 md:px-12 relative overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-0 -left-[10%] w-[400px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="w-32 h-32 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center text-5xl font-black text-white shadow-2xl shadow-indigo-500/20 border-4 border-white/10">
              {userName.charAt(0).toUpperCase()}
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Profile Verified • Academic Contributor</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
                {userName}
              </h1>
              <p className="text-indigo-400 font-bold tracking-tight">{user?.email}</p>
            </div>

            <div className="flex space-x-4">
               <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] text-center min-w-[120px]">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Contributions</p>
                <p className="text-3xl font-black text-white">{stats.total}</p>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] text-center min-w-[120px]">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Verified</p>
                <p className="text-3xl font-black text-emerald-400">{stats.verified}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profile Content Area */}
      <section className="bg-white rounded-t-[3rem] -mt-10 relative z-20 min-h-screen px-6 md:px-12 pt-16 pb-20">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-black text-slate-950 tracking-tighter">Your Study Library</h2>
              <p className="text-slate-400 font-medium mt-1 uppercase text-[10px] tracking-widest">Resources shared with the Global Hub</p>
            </div>
            <button 
              onClick={() => navigate('/create')}
              className="px-8 py-3 bg-slate-950 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-indigo-600 transition-all shadow-xl"
            >
              Share New Resource
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-indigo-50/60 rounded-[2.5rem] h-80 animate-pulse border border-indigo-100"></div>
              ))}
            </div>
          ) : userNotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {userNotes.map(note => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          ) : (
            <div className="py-32 text-center bg-indigo-50/40 rounded-[3rem] border-2 border-dashed border-indigo-100">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-indigo-600 shadow-sm mx-auto mb-6">
                <i className="fa-solid fa-folder-open text-3xl"></i>
              </div>
              <h3 className="text-2xl font-black text-slate-900">Your library is empty</h3>
              <p className="text-slate-500 mt-2 font-medium max-w-sm mx-auto">Start contributing to your institution's repository to build your academic profile and help others.</p>
              <button 
                onClick={() => navigate('/create')}
                className="mt-8 px-10 py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
              >
                Upload First Note
              </button>
            </div>
          )}

          {/* Institutional Badges (Secondary Stats) */}
          {userNotes.length > 0 && (
            <div className="pt-12 border-t border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8">Active Institutional Presence</h3>
              <div className="flex flex-wrap gap-4">
                {Array.from(new Set(userNotes.map(n => n.university))).map(uni => (
                  <div key={uni} className="px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                      <i className="fa-solid fa-building-columns"></i>
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">{uni}</p>
                      <p className="text-[9px] font-black uppercase text-indigo-500">Active Repository</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Profile;
