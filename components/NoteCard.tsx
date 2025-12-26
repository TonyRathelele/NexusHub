
import React from 'react';
import { Link } from 'react-router-dom';
import { Note } from '../types';

interface NoteCardProps {
  note: Note;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const formattedDate = new Date(note.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <Link 
      to={`/note/${note.id}`}
      className="block group bg-indigo-50/60 rounded-3xl shadow-sm hover:shadow-2xl hover:bg-white hover:-translate-y-1 transition-all duration-300 border border-indigo-100 overflow-hidden academic-card"
    >
      <div className="p-8 h-full flex flex-col">
        {/* Academic Breadcrumbs */}
        <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 overflow-hidden whitespace-nowrap">
          <span className="text-indigo-600 truncate">{note.university}</span>
          <i className="fa-solid fa-chevron-right mx-2 text-[8px] opacity-30"></i>
          <span className="truncate">{note.faculty}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-white rounded-lg border border-indigo-100 shadow-sm">
            {note.module}
          </span>
          {note.fileUrl && (
            <span className="text-red-500 bg-red-50 w-8 h-8 rounded-xl flex items-center justify-center shadow-inner">
              <i className="fa-solid fa-file-pdf text-sm"></i>
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight tracking-tight">
          {note.title}
        </h3>
        
        <p className="text-sm text-slate-500 line-clamp-3 mb-8 flex-grow leading-relaxed font-medium">
          {note.content}
        </p>

        <div className="flex items-center justify-between pt-6 border-t border-indigo-100/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-[10px] font-black text-white uppercase shadow-lg">
              {note.author.substring(0, 1)}
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-black text-slate-800 truncate max-w-[100px]">{note.author}</span>
              <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">Verified Poster</span>
            </div>
          </div>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{formattedDate}</span>
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;
