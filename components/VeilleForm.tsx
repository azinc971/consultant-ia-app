"use client";

import { useRef, useState, useTransition } from "react";
import { addVeilleEntry } from "@/lib/veille-actions";

export default function VeilleForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      try {
        await addVeilleEntry(formData);
        formRef.current?.reset();
      } catch {
        setError("Une erreur est survenue, réessaie.");
      }
    });
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="flex flex-col gap-4 rounded-lg border border-zinc-200 p-5"
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="titre" className="text-sm font-medium text-zinc-700">
          Titre
        </label>
        <input
          id="titre"
          name="titre"
          type="text"
          required
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="url" className="text-sm font-medium text-zinc-700">
          URL
        </label>
        <input
          id="url"
          name="url"
          type="url"
          placeholder="https://..."
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="resume" className="text-sm font-medium text-zinc-700">
          Résumé
        </label>
        <textarea
          id="resume"
          name="resume"
          rows={3}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="tags" className="text-sm font-medium text-zinc-700">
          Tags
        </label>
        <input
          id="tags"
          name="tags"
          type="text"
          placeholder="réglementaire, officine, LLM (séparés par des virgules)"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {isPending ? "Ajout…" : "Ajouter"}
      </button>
    </form>
  );
}
