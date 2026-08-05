"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleProgression(
  sousCompetenceId: string,
  moduleId: string,
  acquis: boolean,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const { error } = await supabase.from("progression").upsert(
    {
      user_id: user.id,
      sous_competence_id: sousCompetenceId,
      acquis,
      date: new Date().toISOString(),
    },
    { onConflict: "user_id,sous_competence_id" },
  );
  if (error) throw error;

  revalidatePath(`/modules/${moduleId}`);
  revalidatePath("/");
}
