import { getVeilleEntries } from "@/lib/veille";
import VeilleForm from "@/components/VeilleForm";
import VeilleList from "@/components/VeilleList";

export default async function VeillePage() {
  const entries = await getVeilleEntries();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Veille</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Ton espace personnel pour garder trace des articles et sources sur l&apos;IA en
          pharmacie.
        </p>
      </div>

      <VeilleForm />

      <VeilleList entries={entries} />
    </main>
  );
}
