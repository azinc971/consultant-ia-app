import Link from "next/link";
import type { ModuleProgress } from "@/lib/dashboard";

export default function ModuleCard({
  module: mod,
  highlighted = false,
}: {
  module: ModuleProgress;
  highlighted?: boolean;
}) {
  return (
    <Link
      href={`/modules/${mod.id}`}
      className={`flex flex-col gap-3 rounded-lg border p-4 transition-colors hover:border-zinc-400 ${
        highlighted ? "border-zinc-900 bg-zinc-50" : "border-zinc-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium text-zinc-900">{mod.titre}</h3>
        <div className="flex shrink-0 gap-1">
          {mod.optionnel && (
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-zinc-600">
              Optionnel
            </span>
          )}
          {mod.complete && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-emerald-700">
              Complété
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
          <div
            className="h-full rounded-full bg-zinc-900"
            style={{ width: `${mod.percent}%` }}
          />
        </div>
        <span className="w-9 shrink-0 text-right text-xs tabular-nums text-zinc-500">
          {mod.percent}%
        </span>
      </div>

      <p className="text-xs text-zinc-400">
        {mod.acquisCount}/{mod.totalSousCompetences} sous-compétences acquises
      </p>
    </Link>
  );
}
