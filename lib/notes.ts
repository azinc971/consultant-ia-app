import { createClient } from "@/lib/supabase/server";

export async function getModuleNote(moduleId: string): Promise<string> {
  const supabase = await createClient();

  // RLS (auth.uid() = user_id) + la contrainte unique(user_id, module_id)
  // garantissent qu'il y a au plus une ligne pour cet utilisateur et ce module.
  const { data, error } = await supabase
    .from("notes")
    .select("contenu")
    .eq("module_id", moduleId)
    .maybeSingle();

  if (error) throw error;
  return data?.contenu ?? "";
}
