import Link from "next/link";
import { getDashboardData } from "@/lib/dashboard";
import ModuleCard from "@/components/ModuleCard";

export default async function DashboardPage() {
  const { troncA, troncB, nextSuggested } = await getDashboardData();
  const total = troncA.length + troncB.length;
  const completedCount = [...troncA, ...troncB].filter((m) => m.complete).length;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Ton parcours</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {completedCount}/{total} modules complétés
        </p>
      </div>

      {nextSuggested && (
        <Link
          href={`/modules/${nextSuggested.id}`}
          className="flex flex-col gap-1 rounded-lg border border-zinc-900 bg-zinc-900 p-4 text-white transition-opacity hover:opacity-90"
        >
          <span className="text-xs font-medium tracking-wide text-zinc-400 uppercase">
            Prochaine étape suggérée
          </span>
          <span className="text-lg font-semibold">{nextSuggested.titre}</span>
          <span className="text-sm text-zinc-300">
            {nextSuggested.percent}% complété — {nextSuggested.acquisCount}/
            {nextSuggested.totalSousCompetences} sous-compétences
          </span>
        </Link>
      )}

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
          Tronc A — Socle généraliste
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {troncA.map((mod) => (
            <ModuleCard key={mod.id} module={mod} highlighted={mod.id === nextSuggested?.id} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold tracking-wide text-zinc-500 uppercase">
          Tronc B — Spécialisation pharmacie
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {troncB.map((mod) => (
            <ModuleCard key={mod.id} module={mod} highlighted={mod.id === nextSuggested?.id} />
          ))}
        </div>
      </section>
    </main>
  );
}
