import Link from "next/link";
import { getModuleQuiz } from "@/lib/quiz";
import QuizForm from "@/components/QuizForm";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { module: mod, questions } = await getModuleQuiz(id);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8">
      <div>
        <Link href={`/modules/${id}`} className="text-sm text-zinc-500 hover:text-zinc-700">
          ← Retour au module
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-900">Quiz — {mod.titre}</h1>
        <p className="mt-1 text-sm text-zinc-500">{questions.length} questions</p>
      </div>

      <QuizForm moduleId={id} questions={questions} />
    </main>
  );
}
