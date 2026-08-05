"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type QuizResult = { score: number; correctCount: number; total: number };

export async function submitQuizResult(
  moduleId: string,
  answers: Record<string, string>,
): Promise<QuizResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  // La correction est recalculée côté serveur à partir des bonnes réponses
  // en base, plutôt que de faire confiance à un score envoyé par le client.
  const { data: questions, error: questionsError } = await supabase
    .from("quiz_questions")
    .select("id, bonne_reponse")
    .eq("module_id", moduleId);
  if (questionsError) throw questionsError;
  if (!questions || questions.length === 0) throw new Error("Aucune question trouvée pour ce module");

  const total = questions.length;
  const correctCount = questions.filter((q) => answers[q.id] === q.bonne_reponse).length;
  const score = Math.round((correctCount / total) * 100);

  const { error: insertError } = await supabase.from("quiz_resultats").insert({
    user_id: user.id,
    module_id: moduleId,
    score,
    date: new Date().toISOString(),
  });
  if (insertError) throw insertError;

  revalidatePath(`/modules/${moduleId}`);
  revalidatePath("/");

  return { score, correctCount, total };
}
