"use client";

import { Note } from "@/types/note";
import { formatDate } from "@/utils/format";

type Props = {
  notes: Note[];
  loading: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
};

/**
 * PUBLIC_INTERFACE
 * NoteSidebar - Displays list of notes with selection support.
 */
export default function NoteSidebar({
  notes,
  loading,
  selectedId,
  onSelect,
  onCreate,
}: Props) {
  if (loading) {
    return (
      <div className="p-3">
        <div className="empty">Loading…</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {notes.length === 0 ? (
        <div className="p-3">
          <div className="empty">
            No notes yet.
            <div className="mt-3">
              <button className="btn btn-primary" onClick={onCreate}>
                Create your first note
              </button>
            </div>
          </div>
        </div>
      ) : (
        notes.map((note) => {
          const active = selectedId === note.id;
          return (
            <button
              key={note.id}
              onClick={() => onSelect(note.id)}
              className={`note-item text-left ${active ? "active" : ""}`}
            >
              <div className="note-title truncate">
                {note.title?.trim() || "Untitled"}
              </div>
              <div className="note-meta">
                Updated {formatDate(note.updatedAt, "short")}
              </div>
            </button>
          );
        })
      )}
    </div>
  );
}
