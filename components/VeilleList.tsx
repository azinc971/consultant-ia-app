"use client";

import { useMemo, useState } from "react";
import type { VeilleEntry } from "@/lib/veille";

type SortMode = "date" | "tag";

export default function VeilleList({ entries }: { entries: VeilleEntry[] }) {
  const [sortMode, setSortMode] = useState<SortMode>("date");

  const sorted = useMemo(() => {
    const copy = [...entries];
    if (sortMode === "date") {
      copy.sort((a, b) => new Date(b.date_ajout).getTime() - new Date(a.date_ajout).getTime());
    } else {
      copy.sort((a, b) => {
        const keyA = [...a.tags].sort().join(", ");
        const keyB = [...b.tags].sort().join(", ");
        return keyA.localeCompare(keyB, "fr") || a.titre.localeCompare(b.titre, "fr");
      });
    }
    return copy;
  }, [entries, sortMode]);

  if (entries.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        Aucune entrée pour l&apos;instant — ajoute ton premier article ou source ci-dessus.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-zinc-500">Trier par :</span>
        <button
          type="button"
          onClick={() => setSortMode("date")}
          className={
            sortMode === "date"
              ? "font-medium text-zinc-900"
              : "text-zinc-500 hover:text-zinc-700"
          }
        >
          Date
        </button>
        <span className="text-zinc-300">·</span>
        <button
          type="button"
          onClick={() => setSortMode("tag")}
          className={
            sortMode === "tag" ? "font-medium text-zinc-900" : "text-zinc-500 hover:text-zinc-700"
          }
        >
          Tag
        </button>
      </div>

      <ul className="flex flex-col gap-3">
        {sorted.map((entry) => (
          <li key={entry.id} className="rounded-lg border border-zinc-200 p-4">
            <div className="flex items-start justify-between gap-2">
              {entry.url ? (
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-zinc-900 hover:underline"
                >
                  {entry.titre}
                </a>
              ) : (
                <span className="text-sm font-medium text-zinc-900">{entry.titre}</span>
              )}
              <span className="shrink-0 text-xs text-zinc-400">
                {new Date(entry.date_ajout).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            {entry.resume && <p className="mt-1 text-sm text-zinc-600">{entry.resume}</p>}
            {entry.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
