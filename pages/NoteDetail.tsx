
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getNoteById, deleteNote } from '../services/noteService';
import { summarizeNote } from '../services/geminiService';
import { Note } from '../types';
import { useAuth } from '../contexts/AuthContext';

const NoteDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchNote = async () => {
        setLoading(true);
        const data = await getNoteById(id);
        setNote(data);
        setLoading(false);
      };
      fetchNote();
    }
  }, [id]);

  const handleAISummarize = async () => {
    if (!note) return;
    setSummarizing(true);
    const result = await summarizeNote(note.title, note.content);
    setSummary(result);
    setSummarizing(false);
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <i className="fa-solid fa-circle-notch animate-spin text-4xl text-indigo-600"></i>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Retrieving Archive...</p>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-black text-slate-800">Resource missing from repository.</h2>
        <Link to="/dashboard" className="text-indigo-600 hover:underline mt-4 font-black inline-block text-xs uppercase tracking-widest">Return to Workspace</Link>
      </div>
    );
  }

  const handleDelete = async () => {
    if (window.confirm("Purge this record from the academic hub?")) {
      const success = await deleteNote(note.id);
      if (success) navigate('/dashboard');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn pb-32">
      <nav className="flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center text-slate-400 hover:text-indigo-600 transition-all font-black text-[10px] uppercase tracking-widest">
          <i className="fa-solid fa-arrow-left-long mr-3"></i> Workspace Explorer
        </Link>
        <div className="flex items-center space-x-3">
          <Link to={`/edit/${note.id}`} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest border border-slate-100">Edit</Link>
          <button onClick={handleDelete} className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest border border-red-50">Delete</button>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Note content and AI sidebar logic remains the same */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-8 md:p-12 border-b border-slate-50 bg-slate-50/50">
              <div className="flex items-center space-x-3 text-indigo-600 font-black text-[10px] uppercase tracking-widest mb-4">
                <i className="fa-solid fa-building-columns"></i>
                <span>{note.university}</span>
                <span className="text-slate-200">•</span>
                <span>{note.module}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-950 leading-tight mb-6">{note.title}</h1>
            </div>
            <div className="p-8 md:p-12">
              <article className="prose prose-slate max-w-none">
                {note.content.split('\n').map((p, i) => (
                  p ? <p key={i} className="text-lg text-slate-600 leading-relaxed mb-6 font-medium">{p}</p> : <br key={i} />
                ))}
              </article>
            </div>
          </div>
        </div>

        <aside className="space-y-8">
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 flex items-center">
              <i className="fa-solid fa-wand-magic-sparkles mr-3"></i> Nexus AI Assistant
            </h3>
            {!summary ? (
              <button onClick={handleAISummarize} disabled={summarizing} className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center space-x-3">
                {summarizing ? <i className="fa-solid fa-circle-notch animate-spin"></i> : <span>Generate Smart Summary</span>}
              </button>
            ) : (
              <div className="p-4 bg-white/10 rounded-2xl border border-white/10 text-xs italic">{summary}</div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default NoteDetail;
