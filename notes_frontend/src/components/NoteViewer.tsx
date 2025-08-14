"use client";

import { Note } from "@/types/note";
import { formatDate } from "@/utils/format";

type Props = {
  note: Note;
};

/**
 * PUBLIC_INTERFACE
 * NoteViewer - Read-only view of a note.
 */
export default function NoteViewer({ note }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="badge">Updated {formatDate(note.updatedAt)}</span>
        <span className="badge">Created {formatDate(note.createdAt)}</span>
      </div>
      <h1 className="text-2xl font-semibold text-[color:var(--color-secondary)]">
        {note.title?.trim() || "Untitled"}
      </h1>
      <article className="prose max-w-none whitespace-pre-wrap bg-white border border-[color:var(--color-muted)] rounded-xl p-4">
        {note.content?.trim() || "No content."}
      </article>
    </div>
  );
}
