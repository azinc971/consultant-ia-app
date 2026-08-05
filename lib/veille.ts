import { createClient } from "@/lib/supabase/server";

export type VeilleEntry = {
  id: string;
  titre: string;
  url: string | null;
  resume: string | null;
  tags: string[];
  date_ajout: string;
};

export async function getVeilleEntries(): Promise<VeilleEntry[]> {
  const supabase = await createClient();

  // RLS (auth.uid() = user_id) restreint déjà ce select à l'utilisateur courant.
  const { data, error } = await supabase
    .from("veille")
    .select("id, titre, url, resume, tags, date_ajout")
    .order("date_ajout", { ascending: false });

  if (error) throw error;
  return data ?? [];
}
