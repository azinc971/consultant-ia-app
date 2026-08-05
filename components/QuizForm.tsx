"use client";

import { useState, useTransition } from "react";
import { submitQuizResult, type QuizResult } from "@/lib/quiz-actions";
import type { QuizQuestion } from "@/lib/quiz";
import QuizResults from "@/components/QuizResults";

export default function QuizForm({
  moduleId,
  questions,
}: {
  moduleId: string;
  questions: QuizQuestion[];
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!allAnswered) return;
    setError(null);
    startTransition(async () => {
      try {
        const res = await submitQuizResult(moduleId, answers);
        setResult(res);
      } catch {
        setError("Une erreur est survenue, réessaie.");
      }
    });
  }

  if (result) {
    return (
      <QuizResults
        moduleId={moduleId}
        questions={questions}
        answers={answers}
        result={result}
        onRetry={() => {
          setResult(null);
          setAnswers({});
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {questions.map((q, i) => (
        <fieldset key={q.id} className="flex flex-col gap-3">
          <legend className="text-sm font-medium text-zinc-900">
            {i + 1}. {q.question}
          </legend>
          <div className="flex flex-col gap-2">
            {q.options.map((option) => (
              <label
                key={option}
                className="flex cursor-pointer items-start gap-3 rounded-md border border-zinc-200 p-3 text-sm hover:border-zinc-300 has-[:checked]:border-zinc-900 has-[:checked]:bg-zinc-50"
              >
                <input
                  type="radio"
                  name={q.id}
                  value={option}
                  checked={answers[q.id] === option}
                  onChange={() => setAnswers((prev) => ({ ...prev, [q.id]: option }))}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-zinc-900"
                />
                <span className="text-zinc-700">{option}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ))}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-col items-start gap-2">
        <button
          type="submit"
          disabled={!allAnswered || isPending}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isPending ? "Correction…" : "Valider le quiz"}
        </button>
        {!allAnswered && (
          <p className="text-xs text-zinc-400">Réponds à toutes les questions pour valider.</p>
        )}
      </div>
    </form>
  );
}
