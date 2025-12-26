
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNoteById, saveNote, uploadNoteFile, getNotes } from '../services/noteService';
import { Note, Category } from '../types';
import { useAuth } from '../contexts/AuthContext';

const createEmptyNote = (): Note => ({
  id: `temp-${Math.random().toString(36).substring(2, 9)}`,
  title: "",
  content: "",
  author: "",
  category: Category.GENERAL,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  tags: [],
  university: "",
  faculty: "",
  module: ""
});

const NoteEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [note, setNote] = useState<Note>(createEmptyNote());
  const [existingNotes, setExistingNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const init = async () => {
      setFetching(true);
      // Fetch all notes to build suggestions
      const allNotes = await getNotes();
      setExistingNotes(allNotes);

      if (id) {
        const data = await getNoteById(id);
        if (data) setNote(data);
      } else if (user?.email) {
        setNote(prev => ({ ...prev, author: user.email?.split('@')[0] || 'Contributor' }));
      }
      setFetching(false);
    };
    init();
  }, [id, user]);

  // Hierarchical Suggestion Logic
  const universitySuggestions = useMemo(() => {
    return Array.from(new Set(existingNotes.map(n => n.university))).sort();
  }, [existingNotes]);

  const facultySuggestions = useMemo(() => {
    return Array.from(new Set(
      existingNotes
        .filter(n => !note.university || n.university === note.university)
        .map(n => n.faculty)
    )).sort();
  }, [existingNotes, note.university]);

  const moduleSuggestions = useMemo(() => {
    return Array.from(new Set(
      existingNotes
        .filter(n => (!note.university || n.university === note.university) && (!note.faculty || n.faculty === note.faculty))
        .map(n => n.module)
    )).sort();
  }, [existingNotes, note.university, note.faculty]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNote(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File is too large. Max size is 10MB.");
      return;
    }

    setUploading(true);
    const result = await uploadNoteFile(file);
    if (result) {
      setNote(prev => ({ 
        ...prev, 
        fileUrl: result.url, 
        fileName: result.name,
        content: prev.content || `Refer to the attached file: ${result.name}`
      }));
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!note.title.trim() || !note.university.trim() || !note.module.trim()) {
      alert("Validation Error: Title, University, and Module are required.");
      return;
    }

    if (!user) {
      alert("Auth Error: You must be logged in to sync.");
      return;
    }

    setLoading(true);
    const result = await saveNote(note, user.id);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      alert(`Save Failed:\n${result.message}`);
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <i className="fa-solid fa-spinner animate-spin text-4xl text-indigo-600 mb-4"></i>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Retrieving Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fadeIn">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            {id ? 'Refine Archive' : 'Contribute Resource'}
          </h1>
          <p className="text-slate-400 text-sm mt-1 uppercase tracking-tighter font-bold">Populating Global Knowledge Repository</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={() => navigate(-1)} className="px-6 py-2 text-slate-500 font-bold hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
          <button 
            onClick={handleSave} 
            disabled={loading || uploading}
            className="px-8 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-all flex items-center disabled:opacity-50"
          >
            {(loading || uploading) ? <i className="fa-solid fa-spinner animate-spin mr-2"></i> : null}
            {loading ? 'Publishing...' : 'Sync to Hub'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Resource Title</label>
              <input 
                type="text"
                name="title"
                value={note.title}
                onChange={handleChange}
                placeholder="e.g., Intro to Machine Learning Notes"
                className="w-full px-0 py-2 text-2xl font-black bg-transparent border-b border-slate-100 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex justify-between items-center">
                <span>Detailed Content / Abstract</span>
                <span className="text-slate-300 normal-case font-medium italic">Type below or upload PDF on the right</span>
              </label>
              <textarea 
                name="content"
                rows={12}
                value={note.content}
                onChange={handleChange}
                placeholder="Document your findings or provide a summary of your attached files..."
                className="w-full px-6 py-6 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none leading-relaxed text-slate-700"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Hierarchy & File Sideboard */}
        <aside className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600 mb-2">Institutional Context</h3>
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">University / College</label>
              <div className="relative">
                <input 
                  list="university-list"
                  type="text"
                  name="university"
                  value={note.university}
                  onChange={handleChange}
                  placeholder="e.g., Univ. of Johannesburg"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none text-sm font-semibold"
                />
                <datalist id="university-list">
                  {universitySuggestions.map(uni => <option key={uni} value={uni} />)}
                </datalist>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Faculty / Department</label>
              <div className="relative">
                <input 
                  list="faculty-list"
                  type="text"
                  name="faculty"
                  value={note.faculty}
                  onChange={handleChange}
                  placeholder="e.g., Science & IT"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none text-sm font-semibold"
                />
                <datalist id="faculty-list">
                  {facultySuggestions.map(fac => <option key={fac} value={fac} />)}
                </datalist>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">Module / Course Code</label>
              <div className="relative">
                <input 
                  list="module-list"
                  type="text"
                  name="module"
                  value={note.module}
                  onChange={handleChange}
                  placeholder="e.g., CS101"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none text-sm font-semibold"
                />
                <datalist id="module-list">
                  {moduleSuggestions.map(mod => <option key={mod} value={mod} />)}
                </datalist>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-50">
               <label className="text-[10px] font-bold text-slate-400 uppercase">Classification</label>
               <select 
                name="category"
                value={note.category}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none text-xs font-bold"
              >
                {Object.values(Category).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400 mb-4">Supporting Materials</h3>
            
            {note.fileUrl ? (
              <div className="bg-white/10 rounded-xl p-4 border border-white/10 flex items-center justify-between">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <i className="fa-solid fa-file-pdf text-red-400"></i>
                  <span className="text-xs font-bold truncate max-w-[120px]">{note.fileName}</span>
                </div>
                <button 
                  onClick={() => setNote(prev => ({ ...prev, fileUrl: undefined, fileName: undefined }))}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center justify-center hover:border-indigo-400 hover:bg-white/5 transition-all cursor-pointer group"
              >
                {uploading ? (
                  <i className="fa-solid fa-spinner animate-spin text-2xl text-indigo-400"></i>
                ) : (
                  <>
                    <i className="fa-solid fa-cloud-arrow-up text-2xl text-white/30 group-hover:text-indigo-400 transition-colors mb-2"></i>
                    <p className="text-[10px] font-black uppercase text-center opacity-40">Upload PDF</p>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".pdf"
                  onChange={handleFileUpload} 
                />
              </div>
            )}
            <p className="text-[9px] text-white/30 mt-4 leading-tight italic">
              Attached PDFs will be accessible to all verified members browsing this module. Max size: 10MB.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default NoteEditorPage;
