"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { saveNote } from "@/lib/notes-actions";

type SaveStatus = "idle" | "pending" | "saving" | "saved" | "error";

const STATUS_LABEL: Record<SaveStatus, string> = {
  idle: "",
  pending: "Modifications non enregistrées…",
  saving: "Enregistrement…",
  saved: "Enregistré",
  error: "Erreur d'enregistrement",
};

const DEBOUNCE_MS = 2000;

export default function NotesEditor({
  moduleId,
  initialContent,
}: {
  moduleId: string;
  initialContent: string;
}) {
  const [content, setContent] = useState(initialContent);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const savedContentRef = useRef(initialContent);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSave = useCallback(
    async (value: string) => {
      if (value === savedContentRef.current) return;
      setStatus("saving");
      try {
        await saveNote(moduleId, value);
        savedContentRef.current = value;
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    },
    [moduleId],
  );

  useEffect(() => {
    if (content === savedContentRef.current) {
      return;
    }
    setStatus("pending");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      doSave(content);
    }, DEBOUNCE_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [content, doSave]);

  function handleBlur() {
    // Sauvegarde immédiate si l'utilisateur quitte le champ avant la fin du
    // debounce (ex : clic sur un lien de navigation).
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (content !== savedContentRef.current) {
      doSave(content);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
          Mes notes
        </h2>
        <span className={`text-xs ${status === "error" ? "text-red-600" : "text-zinc-400"}`}>
          {STATUS_LABEL[status]}
        </span>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={handleBlur}
        rows={6}
        placeholder="Tes notes personnelles sur ce module…"
        className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none"
      />
    </div>
  );
}
