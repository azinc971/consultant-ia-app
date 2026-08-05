import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  bonne_reponse: string;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getModuleQuiz(id: string): Promise<{
  module: { id: string; titre: string };
  questions: QuizQuestion[];
}> {
  if (!UUID_RE.test(id)) notFound();

  const supabase = await createClient();

  const { data: moduleRow, error: moduleError } = await supabase
    .from("modules")
    .select("id, titre")
    .eq("id", id)
    .maybeSingle();

  if (moduleError) throw moduleError;
  if (!moduleRow) notFound();

  const { data: rawQuestions, error: questionsError } = await supabase
    .from("quiz_questions")
    .select("id, question, options, bonne_reponse")
    .eq("module_id", id);

  if (questionsError) throw questionsError;
  if (!rawQuestions || rawQuestions.length === 0) notFound();

  const questions: QuizQuestion[] = rawQuestions.map((q) => ({
    id: q.id,
    question: q.question,
    options: q.options as string[],
    bonne_reponse: q.bonne_reponse,
  }));

  return { module: moduleRow, questions };
}
