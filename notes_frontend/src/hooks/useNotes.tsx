"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CreateNoteInput, Note, UpdateNoteInput } from "@/types/note";

const STORAGE_KEY = "notes.v1";
const SELECTED_KEY = "notes.selected";

/**
 * Small helper to generate unique IDs; uses crypto.randomUUID if present.
 */
function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * Read notes from localStorage in a safe way.
 */
function readFromStorage(): Note[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Note[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

/**
 * Persist notes to localStorage.
 */
function writeToStorage(notes: Note[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch {
    // ignore
  }
}

/**
 * PUBLIC_INTERFACE
 * useNotes - A stateful hook that manages a list of notes with localStorage persistence.
 *
 * Exposes:
 * - notes: Note[] (sorted by updatedAt desc)
 * - loading: boolean
 * - selectedId: string | null
 * - setSelectedId(id: string | null): void
 * - createNote(input?: CreateNoteInput): Note
 * - updateNote(id: string, updates: UpdateNoteInput): Note | undefined
 * - deleteNote(id: string): void
 */
export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const loadedRef = useRef(false);

  // initial load
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    const stored = readFromStorage();
    let initialNotes = stored;

    if (stored.length === 0) {
      // seed with a sample note for first-time users
      const now = new Date().toISOString();
      initialNotes = [
        {
          id: generateId(),
          title: "Welcome to Notes",
          content:
            "This is your personal, local-only notes app.\n\n- Create notes\n- Edit instantly (auto-saved)\n- Delete when done\n\nYour data stays in your browser.",
          createdAt: now,
          updatedAt: now,
        },
      ];
      writeToStorage(initialNotes);
    }

    // sort newest first
    initialNotes.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    setNotes(initialNotes);

    // restore selection or default to first note
    const savedSelected = typeof window !== "undefined"
      ? localStorage.getItem(SELECTED_KEY)
      : null;
    if (savedSelected && initialNotes.some((n) => n.id === savedSelected)) {
      setSelectedId(savedSelected);
    } else if (initialNotes.length > 0) {
      setSelectedId(initialNotes[0].id);
    } else {
      setSelectedId(null);
    }

    setLoading(false);
  }, []);

  // persist notes on change
  useEffect(() => {
    if (!loading) writeToStorage(notes);
  }, [notes, loading]);

  // persist selection on change
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (selectedId) localStorage.setItem(SELECTED_KEY, selectedId);
  }, [selectedId]);

  const createNote = useCallback(
    (input: CreateNoteInput = {}): Note => {
      const now = new Date().toISOString();
      const note: Note = {
        id: generateId(),
        title: input.title ?? "Untitled",
        content: input.content ?? "",
        createdAt: now,
        updatedAt: now,
      };
      setNotes((prev) => [note, ...prev]);
      setSelectedId(note.id);
      return note;
    },
    []
  );

  const updateNote = useCallback(
    (id: string, updates: UpdateNoteInput): Note | undefined => {
      let updated: Note | undefined;
      setNotes((prev) => {
        const next = prev.map((n) => {
          if (n.id !== id) return n;
          updated = {
            ...n,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
          return updated!;
        });
        // sort newest first
        next.sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        return next;
      });
      return updated;
    },
    []
  );

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setSelectedId((current) => {
      if (current !== id) return current;
      // select the next newest note if exists
      const remaining = notes.filter((n) => n.id !== id);
      return remaining.length > 0 ? remaining[0].id : null;
    });
  }, [notes]);

  const value = useMemo(
    () => ({
      notes,
      loading,
      selectedId,
      setSelectedId,
      createNote,
      updateNote,
      deleteNote,
    }),
    [notes, loading, selectedId, createNote, updateNote, deleteNote]
  );

  return value;
}
