
import { supabase } from './supabaseClient';
import { Note, Category } from '../types';

/**
 * Maps a database row to the frontend Note interface
 */
const mapDbNoteToNote = (dbNote: any): Note => ({
  id: dbNote.id.toString(),
  title: dbNote.title || "Untitled Note",
  content: dbNote.content || "",
  author: dbNote.author || "Anonymous",
  category: (dbNote.category as Category) || Category.GENERAL,
  createdAt: new Date(dbNote.created_at).getTime(),
  updatedAt: new Date(dbNote.updated_at).getTime(),
  tags: Array.isArray(dbNote.tags) ? dbNote.tags : [],
  university: dbNote.university || "Unspecified Institution",
  faculty: dbNote.faculty || "General Studies",
  module: dbNote.module || "General",
  fileUrl: dbNote.file_url,
  fileName: dbNote.file_name,
  isVerified: dbNote.is_verified || false
});

export const getNotes = async (): Promise<Note[]> => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapDbNoteToNote);
  } catch (err: any) {
    console.error('Fetch Notes Error:', err.message || err);
    return [];
  }
};

export const getNoteById = async (id: string): Promise<Note | null> => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return mapDbNoteToNote(data);
  } catch (err: any) {
    console.error('Fetch Note ID Error:', err.message || err);
    return null;
  }
};

export const verifyNote = async (id: string, status: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('notes')
      .update({ is_verified: status })
      .eq('id', id);
    if (error) throw error;
    return true;
  } catch (err: any) {
    console.error('Verification Error:', err.message);
    return false;
  }
};

export const uploadNoteFile = async (file: File): Promise<{url: string, name: string} | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('note-files')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('note-files')
      .getPublicUrl(filePath);

    return { url: publicUrl, name: file.name };
  } catch (err: any) {
    console.error('Upload Error:', err.message);
    return null;
  }
};

export const saveNote = async (note: Note, userId: string): Promise<{success: boolean, message: string}> => {
  const isNew = note.id.startsWith('temp-');
  
  const dbNote: any = {
    title: note.title,
    content: note.content,
    author: note.author,
    category: note.category,
    tags: Array.isArray(note.tags) ? note.tags : [],
    university: note.university,
    faculty: note.faculty,
    module: note.module,
    file_url: note.fileUrl,
    file_name: note.fileName,
    updated_at: new Date().toISOString(),
    user_id: userId
  };

  if (!isNew) {
    dbNote.id = note.id;
  }

  try {
    const { data, error, status } = await supabase
      .from('notes')
      .upsert(dbNote)
      .select();

    if (error) {
      let errorMessage = error.message || "Unknown database rejection";
      return { success: false, message: `Server Error [${status}]: ${errorMessage}` };
    }
    
    return { success: true, message: "Note synchronized with cloud repository." };
  } catch (err: any) {
    return { success: false, message: `System Exception: ${err.message}` };
  }
};

export const deleteNote = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (err: any) {
    console.error('Delete Error:', err.message);
    return false;
  }
};
