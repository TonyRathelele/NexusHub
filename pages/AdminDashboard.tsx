
import React, { useState, useEffect, useMemo } from 'react';
import { getNotes, verifyNote, deleteNote } from '../services/noteService';
import { Note, UserRole } from '../types';

const AdminDashboard: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'users'>('overview');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const allNotes = await getNotes();
      setNotes(allNotes);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Mock data for visualizations (Notes per month)
  const monthlyStats = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((name, i) => ({
      name,
      count: 10 + Math.floor(Math.random() * 40) + (i * 10)
    }));
  }, []);

  const handleToggleVerify = async (note: Note) => {
    const success = await verifyNote(note.id, !note.isVerified);
    if (success) {
      setNotes(notes.map(n => n.id === note.id ? { ...n, isVerified: !n.isVerified } : n));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Permanent Purge: Remove this resource from global index?")) {
      const success = await deleteNote(id);
      if (success) setNotes(notes.filter(n => n.id !== id));
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-40">
      <i className="fa-solid fa-shield-halved animate-pulse text-6xl text-slate-800 mb-6"></i>
      <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-xs">Initializing Admin Session</p>
    </div>
  );

  return (
    <div className="space-y-10 animate-fadeIn pb-20">
      {/* Admin Nav */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Control</h1>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">Platform Integrity & Analytics</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
          {(['overview', 'content', 'users'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {activeTab === 'overview' && (
        <div className="space-y-10">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Notes', value: notes.length, icon: 'fa-file-lines', color: 'bg-blue-500' },
              { label: 'Platform Users', value: '1,284', icon: 'fa-users', color: 'bg-indigo-500' },
              { label: 'Verification Rate', value: `${Math.round((notes.filter(n => n.isVerified).length / notes.length) * 100 || 0)}%`, icon: 'fa-certificate', color: 'bg-emerald-500' },
              { label: 'Cloud Storage', value: '4.2GB', icon: 'fa-database', color: 'bg-amber-500' }
            ].map((stat, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} text-white rounded-2xl flex items-center justify-center text-xl shadow-lg transition-transform group-hover:scale-110`}>
                  <i className={`fa-solid ${stat.icon}`}></i>
                </div>
              </div>
            ))}
          </div>

          {/* Monthly Growth Chart (SVG Implementation) */}
          <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-10 flex items-center">
              <i className="fa-solid fa-chart-line mr-3 text-indigo-600"></i>
              Knowledge Repository Growth
            </h3>
            <div className="h-64 flex items-end justify-between gap-4 px-4">
              {monthlyStats.map((s, i) => (
                <div key={i} className="flex-1 flex flex-col items-center group">
                  <div 
                    className="w-full bg-indigo-50 border-x border-t border-indigo-100 rounded-t-xl transition-all group-hover:bg-indigo-600 relative overflow-hidden"
                    style={{ height: `${(s.count / 100) * 100}%` }}
                  >
                    <div className="absolute top-2 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-black text-white">{s.count}</span>
                    </div>
                  </div>
                  <span className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900">Resource Moderation Queue</h3>
            <span className="px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
              {notes.length} Active Records
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <th className="px-8 py-5">Title & Context</th>
                  <th className="px-8 py-5">Contributor</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {notes.map(note => (
                  <tr key={note.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{note.title}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{note.university} • {note.module}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
                          {note.author[0]}
                        </div>
                        <span className="text-[11px] font-black text-slate-600">{note.author}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      {note.isVerified ? (
                        <span className="flex items-center space-x-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                          <i className="fa-solid fa-circle-check"></i>
                          <span>Verified</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-2 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                          <i className="fa-solid fa-clock"></i>
                          <span>Pending</span>
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => handleToggleVerify(note)}
                          title={note.isVerified ? "Revoke Verification" : "Verify Content"}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                            note.isVerified ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          }`}
                        >
                          <i className={`fa-solid ${note.isVerified ? 'fa-certificate' : 'fa-check'}`}></i>
                        </button>
                        <button 
                          onClick={() => handleDelete(note.id)}
                          title="Purge Record"
                          className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-100 transition-all"
                        >
                          <i className="fa-solid fa-trash-can text-sm"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-[3rem] border border-slate-200 p-12 text-center">
          <i className="fa-solid fa-users-gear text-6xl text-slate-100 mb-6"></i>
          <h3 className="text-2xl font-black text-slate-900 mb-2">User Directory Management</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-10">Advanced user permissions and institutional enrollment controls are coming in the next security patch.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {['nexus-admin@example.com', 'academic-review@nexus.hub', 'verify-bot@system.io'].map((u, i) => (
              <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center space-x-4">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                  <i className="fa-solid fa-user-shield"></i>
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-black text-slate-900 truncate">{u}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-indigo-600">System Admin</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
