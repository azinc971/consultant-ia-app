"use client";

import { useState, useTransition } from "react";
import { toggleProgression } from "@/lib/progression";
import type { ChecklistItem } from "@/lib/modules";

export default function Checklist({
  moduleId,
  items,
}: {
  moduleId: string;
  items: ChecklistItem[];
}) {
  const [states, setStates] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(items.map((item) => [item.id, item.acquis])),
  );
  const [, startTransition] = useTransition();

  function handleToggle(id: string) {
    const next = !states[id];
    setStates((prev) => ({ ...prev, [id]: next }));
    startTransition(async () => {
      try {
        await toggleProgression(id, moduleId, next);
      } catch {
        setStates((prev) => ({ ...prev, [id]: !next }));
      }
    });
  }

  const acquisCount = Object.values(states).filter(Boolean).length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
          Checklist de compétences
        </h2>
        <span className="text-sm text-zinc-500">
          {acquisCount}/{items.length} acquises
        </span>
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.id}>
            <label className="flex cursor-pointer items-start gap-3 rounded-md border border-zinc-200 p-3 text-sm hover:border-zinc-300">
              <input
                type="checkbox"
                checked={states[item.id] ?? false}
                onChange={() => handleToggle(item.id)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-zinc-900"
              />
              <span className={states[item.id] ? "text-zinc-400 line-through" : "text-zinc-700"}>
                {item.libelle}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
