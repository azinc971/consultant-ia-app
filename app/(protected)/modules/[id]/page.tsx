import Link from "next/link";
import { getModuleDetail } from "@/lib/modules";
import { getModuleNote } from "@/lib/notes";
import ModuleContent from "@/components/ModuleContent";
import Checklist from "@/components/Checklist";
import NotesEditor from "@/components/NotesEditor";

export default async function ModulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [{ module: mod, checklist, previous, next }, note] = await Promise.all([
    getModuleDetail(id),
    getModuleNote(id),
  ]);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8">
      <div>
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-700">
          ← Retour au parcours
        </Link>
        <div className="mt-2 flex items-start justify-between gap-2">
          <h1 className="text-2xl font-semibold text-zinc-900">{mod.titre}</h1>
          {mod.optionnel && (
            <span className="mt-1 shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-zinc-600">
              Optionnel
            </span>
          )}
        </div>
      </div>

      <ModuleContent markdown={mod.contenu_markdown} />

      <Link
        href={`/modules/${mod.id}/quiz`}
        className="self-start rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
      >
        Passer le quiz
      </Link>

      <Checklist moduleId={mod.id} items={checklist} />

      <NotesEditor moduleId={mod.id} initialContent={note} />

      <nav className="flex items-center justify-between border-t border-zinc-200 pt-6 text-sm">
        {previous ? (
          <Link
            href={`/modules/${previous.id}`}
            className="flex flex-col text-zinc-500 hover:text-zinc-900"
          >
            <span className="text-xs text-zinc-400">← Précédent</span>
            <span className="font-medium">{previous.titre}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/modules/${next.id}`}
            className="flex flex-col text-right text-zinc-500 hover:text-zinc-900"
          >
            <span className="text-xs text-zinc-400">Suivant →</span>
            <span className="font-medium">{next.titre}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
