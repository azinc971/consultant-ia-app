import Link from "next/link";
import type { QuizQuestion } from "@/lib/quiz";
import { getEncouragementMessage } from "@/lib/quiz-score";
import type { QuizResult } from "@/lib/quiz-actions";

export default function QuizResults({
  moduleId,
  questions,
  answers,
  result,
  onRetry,
}: {
  moduleId: string;
  questions: QuizQuestion[];
  answers: Record<string, string>;
  result: QuizResult;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-5">
        <p className="text-lg font-semibold text-zinc-900">
          {result.correctCount}/{result.total} bonnes réponses — {result.score}%
        </p>
        <p className="mt-1 text-sm text-zinc-600">{getEncouragementMessage(result.score)}</p>
      </div>

      <div className="flex flex-col gap-4">
        {questions.map((q, i) => {
          const userAnswer = answers[q.id];
          const isCorrect = userAnswer === q.bonne_reponse;
          return (
            <div key={q.id} className="rounded-md border border-zinc-200 p-4">
              <p className="text-sm font-medium text-zinc-900">
                {i + 1}. {q.question}
              </p>
              <p className={`mt-2 text-sm ${isCorrect ? "text-emerald-700" : "text-red-600"}`}>
                Ta réponse : {userAnswer} {isCorrect ? "✓" : "✗"}
              </p>
              {!isCorrect && (
                <p className="mt-1 text-sm text-zinc-600">Bonne réponse : {q.bonne_reponse}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:border-zinc-400"
        >
          Repasser le quiz
        </button>
        <Link
          href={`/modules/${moduleId}`}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          Retourner au module
        </Link>
      </div>
    </div>
  );
}
