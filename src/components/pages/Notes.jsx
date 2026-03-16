import { useState, useMemo } from 'react';
import { BookOpen, Plus, Trash2, Pin, PinOff, Search, Edit3, X, Download, ArrowLeft, FileText } from 'lucide-react';
import { useNotesLibrary } from '../../context/NotesLibraryContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function Notes() {
  const { notesLibrary, addNote, updateNote, deleteNote, togglePinned } = useNotesLibrary();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);

  const filteredNotes = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const all = notesLibrary.filter(
      n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    );
    return [...all.filter(n => n.pinnedToDashboard), ...all.filter(n => !n.pinnedToDashboard)];
  }, [notesLibrary, searchQuery]);

  const handleCreate = () => {
    if (!title.trim() || !content.trim()) return;
    addNote(title, content, false);
    setTitle('');
    setContent('');
    setIsCreating(false);
  };

  const handleUpdate = (id) => {
    if (!title.trim() || !content.trim()) return;
    updateNote(id, title, content, notesLibrary.find(n => n.id === id)?.pinnedToDashboard);
    setEditingId(null);
    setTitle('');
    setContent('');
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setSelectedNote(null);
  };

  const cancelForm = () => {
    setIsCreating(false);
    setEditingId(null);
    setTitle('');
    setContent('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const downloadPDF = async (note) => {
    try {
      const element = document.createElement('div');
      element.style.padding = '20px';
      element.style.backgroundColor = '#FFFFFF';
      element.style.color = '#000000';
      element.style.fontFamily = 'Arial, sans-serif';
      element.innerHTML = `
        <h1 style="font-size:24px;font-weight:bold;margin-bottom:10px;color:#111827;">${note.title}</h1>
        <p style="font-size:12px;color:#9CA3AF;margin-bottom:20px;">${formatDate(note.updatedAt)}</p>
        <div style="white-space:pre-wrap;word-break:break-word;font-size:14px;color:#374151;line-height:1.6;">${note.content}</div>
      `;
      const canvas = await html2canvas(element, { backgroundColor: '#FFFFFF', scale: 2 });
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      while (heightLeft > 0) {
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
        position -= 297;
        if (heightLeft > 0) pdf.addPage();
      }
      pdf.save(`${note.title}.pdf`);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const activeNote = notesLibrary.find(n => n.id === selectedNote);
  const pinnedCount = notesLibrary.filter(n => n.pinnedToDashboard).length;

  const showViewer = selectedNote && activeNote && !isCreating && !editingId;
  const showEditor = isCreating || !!editingId;

  return (
    <div className="max-w-7xl mx-auto pb-12">

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] flex items-center gap-2">
              <BookOpen className="w-7 h-7 shrink-0" />
              My Notes
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              {notesLibrary.length} {notesLibrary.length === 1 ? 'note' : 'notes'}
              {pinnedCount > 0 && <span className="ml-2 text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full uppercase tracking-wider">{pinnedCount} pinned</span>}
            </p>
          </div>
          <button
            onClick={() => { cancelForm(); setSelectedNote(null); setIsCreating(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#111827] text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Note</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-start">

        {/* Left: Notes List — hidden on mobile when note is selected or form is open */}
        <div className={`lg:col-span-1 ${(showViewer || showEditor) ? 'hidden lg:block' : 'block'}`}>
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">

            {/* Search */}
            <div className="p-3 sm:p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notes..."
                  className="w-full bg-gray-50 border border-border rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>
            </div>

            {/* Notes list */}
            <div className="divide-y divide-border overflow-y-auto max-h-[65vh] custom-scrollbar">
              {filteredNotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <FileText className="w-8 h-8 text-gray-200 mb-2" />
                  <p className="text-sm text-text-secondary">
                    {searchQuery ? 'No notes match your search.' : 'No notes yet. Create your first one!'}
                  </p>
                </div>
              ) : (
                filteredNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => {
                      setSelectedNote(note.id === selectedNote ? null : note.id);
                      setIsCreating(false);
                      setEditingId(null);
                    }}
                    className={`w-full text-left p-3 sm:p-4 transition-colors border-l-[3px] ${
                      selectedNote === note.id
                        ? 'border-l-[#111827] bg-gray-50'
                        : 'border-l-transparent hover:bg-gray-50/70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-[#111827] truncate flex-1">{note.title}</h4>
                      {note.pinnedToDashboard && (
                        <Pin className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0 mt-0.5" />
                      )}
                    </div>
                    <p className="text-xs text-text-secondary mt-1 line-clamp-2 leading-relaxed">
                      {note.content.slice(0, 80)}{note.content.length > 80 ? '…' : ''}
                    </p>
                    <p className="text-[10px] text-text-secondary font-medium mt-2">{formatDate(note.createdAt)}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Viewer / Editor / Empty state */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">

            {/* ── EDITOR (create or edit) ── */}
            {showEditor && (
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={cancelForm}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                    >
                      <ArrowLeft className="w-4 h-4 text-text-secondary" />
                    </button>
                    <h2 className="text-base font-bold text-[#111827]">
                      {isCreating ? 'New Note' : 'Edit Note'}
                    </h2>
                  </div>
                  <button onClick={cancelForm} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors hidden lg:block">
                    <X className="w-4 h-4 text-text-secondary" />
                  </button>
                </div>

                <div className="p-4 sm:p-6 space-y-4 flex-1">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Note title..."
                    className="w-full bg-gray-50 border border-border rounded-xl px-4 py-3 text-base font-bold text-[#111827] focus:outline-none focus:ring-1 focus:ring-black placeholder:font-normal placeholder:text-text-secondary"
                  />
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write your note here..."
                    className="w-full h-56 sm:h-72 bg-gray-50 border border-border rounded-xl px-4 py-3 text-sm text-[#111827] focus:outline-none focus:ring-1 focus:ring-black resize-none custom-scrollbar leading-relaxed"
                  />
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => editingId ? handleUpdate(editingId) : handleCreate()}
                      className="flex-1 bg-[#111827] text-white py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-colors"
                    >
                      {isCreating ? 'Save Note' : 'Save Changes'}
                    </button>
                    <button
                      onClick={cancelForm}
                      className="flex-1 bg-gray-50 border border-border text-text-secondary py-2.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── VIEWER ── */}
            {showViewer && (
              <div className="flex flex-col">
                {/* Viewer top bar */}
                <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-border">
                  <button
                    onClick={() => setSelectedNote(null)}
                    className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-[#111827] transition-colors lg:hidden"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <div className="hidden lg:block" />
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => downloadPDF(activeNote)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-text-secondary hover:text-[#111827] transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => togglePinned(activeNote.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        activeNote.pinnedToDashboard
                          ? 'bg-amber-50 text-amber-500 hover:bg-amber-100'
                          : 'hover:bg-gray-100 text-text-secondary hover:text-[#111827]'
                      }`}
                      title={activeNote.pinnedToDashboard ? 'Unpin from dashboard' : 'Pin to dashboard'}
                    >
                      {activeNote.pinnedToDashboard ? <Pin className="w-4 h-4 fill-current" /> : <PinOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => startEdit(activeNote)}
                      className="p-2 rounded-lg hover:bg-gray-100 text-text-secondary hover:text-[#111827] transition-colors"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { deleteNote(activeNote.id); setSelectedNote(null); }}
                      className="p-2 rounded-lg hover:bg-red-50 text-text-secondary hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Note content */}
                <div className="p-4 sm:p-6 lg:p-8 space-y-5">
                  <div>
                    {activeNote.pinnedToDashboard && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-2">
                        <Pin className="w-3 h-3 fill-current" /> Pinned to dashboard
                      </div>
                    )}
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] leading-snug break-words">
                      {activeNote.title}
                    </h2>
                    <p className="text-xs text-text-secondary font-medium mt-2">
                      Last updated {formatDate(activeNote.updatedAt)}
                    </p>
                  </div>

                  <div className="border-t border-border pt-5">
                    <p className="text-[#374151] text-sm sm:text-base whitespace-pre-wrap break-words leading-relaxed">
                      {activeNote.content}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ── EMPTY / SELECT STATE ── */}
            {!showEditor && !showViewer && (
              <div className="flex flex-col items-center justify-center min-h-[400px] p-8 sm:p-12 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full border border-border flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-base font-bold text-[#111827]">
                  {notesLibrary.length === 0 ? 'No notes yet' : 'Select a note'}
                </h3>
                <p className="text-sm text-text-secondary mt-1 mb-5">
                  {notesLibrary.length === 0
                    ? 'Create your first note to get started.'
                    : 'Choose a note from the list to read it here.'}
                </p>
                <button
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#111827] text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all"
                >
                  <Plus className="w-4 h-4" /> New Note
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
