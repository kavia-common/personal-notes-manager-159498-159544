"use client";

import { useEffect, useMemo, useState } from "react";
import { useNotes } from "@/hooks/useNotes";
import { Note } from "@/types/note";
import NoteSidebar from "@/components/NoteSidebar";
import NoteViewer from "@/components/NoteViewer";
import NoteEditor from "@/components/NoteEditor";

/**
 * PUBLIC_INTERFACE
 * Default app route rendering the two-pane layout with sidebar and main content.
 * - Left: a sidebar to list notes and create new ones.
 * - Right: a content area to view and edit the selected note.
 */
export default function Home() {
  const {
    notes,
    loading,
    selectedId,
    setSelectedId,
    createNote,
    updateNote,
    deleteNote,
  } = useNotes();

  const [mode, setMode] = useState<"view" | "edit">("view");

  // When selection changes, default to viewing mode
  useEffect(() => {
    setMode("view");
  }, [selectedId]);

  const selectedNote: Note | undefined = useMemo(
    () => notes.find((n) => n.id === selectedId),
    [notes, selectedId]
  );

  const onCreate = () => {
    const newNote = createNote({ title: "Untitled", content: "" });
    setSelectedId(newNote.id);
    setMode("edit");
  };

  const onEdit = () => setMode("edit");
  const onDone = () => setMode("view");

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title flex items-center gap-2">
            <span className="badge">Notes</span>
            <span className="hidden sm:inline-block text-xs mono">
              Local only
            </span>
          </div>
          <button
            className="btn btn-primary"
            aria-label="Create note"
            onClick={onCreate}
          >
            <span aria-hidden>＋</span>
            <span className="hidden sm:inline">New</span>
          </button>
        </div>
        <div className="sidebar-content">
          <NoteSidebar
            notes={notes}
            loading={loading}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onCreate={onCreate}
          />
        </div>
      </aside>

      <main className="main">
        <div className="topbar">
          <div className="topbar-title">
            {selectedNote ? selectedNote.title || "Untitled" : "No note selected"}
          </div>
          <div className="flex items-center gap-2">
            {selectedNote && mode === "view" ? (
              <button className="btn btn-ghost" onClick={onEdit}>
                Edit
              </button>
            ) : null}
            {selectedNote && mode === "edit" ? (
              <button className="btn btn-ghost" onClick={onDone}>
                Done
              </button>
            ) : null}
            {selectedNote ? (
              <button
                className="btn btn-danger"
                onClick={() => {
                  const id = selectedNote.id;
                  deleteNote(id);
                }}
              >
                Delete
              </button>
            ) : null}
          </div>
        </div>

        <div className="accent-line" />

        <div className="content mx-auto w-full">
          {loading ? (
            <div className="empty">Loading your notes…</div>
          ) : !selectedNote ? (
            <div className="empty">
              Select a note from the left or create a new one to get started.
            </div>
          ) : mode === "view" ? (
            <NoteViewer note={selectedNote} />
          ) : (
            <NoteEditor
              note={selectedNote}
              onChange={(updates) => updateNote(selectedNote.id, updates)}
            />
          )}
        </div>
      </main>
    </div>
  );
}
