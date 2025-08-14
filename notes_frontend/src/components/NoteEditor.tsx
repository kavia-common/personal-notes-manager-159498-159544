"use client";

import { UpdateNoteInput, Note } from "@/types/note";

type Props = {
  note: Note;
  onChange: (updates: UpdateNoteInput) => void;
};

/**
 * PUBLIC_INTERFACE
 * NoteEditor - Editable inputs for the selected note.
 * Updates are applied immediately via onChange prop (auto-save).
 */
export default function NoteEditor({ note, onChange }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <input
        className="input text-lg font-semibold"
        placeholder="Untitled"
        value={note.title}
        onChange={(e) => onChange({ title: e.target.value })}
      />
      <textarea
        className="textarea"
        placeholder="Write something..."
        value={note.content}
        onChange={(e) => onChange({ content: e.target.value })}
      />
      <div className="text-xs text-[color:color-mix(in_srgb,var(--color-secondary)_70%,white)]">
        Changes are saved automatically to your browser.
      </div>
    </div>
  );
}
