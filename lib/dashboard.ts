import { createClient } from "@/lib/supabase/server";

export type ModuleProgress = {
  id: string;
  tronc: string;
  titre: string;
  ordre: number;
  optionnel: boolean;
  totalSousCompetences: number;
  acquisCount: number;
  percent: number;
  complete: boolean;
};

export type DashboardData = {
  troncA: ModuleProgress[];
  troncB: ModuleProgress[];
  nextSuggested: ModuleProgress | null;
};

export async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createClient();

  const [
    { data: modules, error: modulesError },
    { data: sousCompetences, error: scError },
    { data: acquises, error: progressionError },
  ] = await Promise.all([
    supabase.from("modules").select("id, tronc, titre, ordre, optionnel").order("ordre"),
    supabase.from("sous_competences").select("id, module_id"),
    // RLS (auth.uid() = user_id) restreint déjà ce select à l'utilisateur courant.
    supabase.from("progression").select("sous_competence_id").eq("acquis", true),
  ]);

  if (modulesError) throw modulesError;
  if (scError) throw scError;
  if (progressionError) throw progressionError;

  const acquisSet = new Set((acquises ?? []).map((row) => row.sous_competence_id));

  const totalByModule = new Map<string, number>();
  const acquisByModule = new Map<string, number>();
  for (const sc of sousCompetences ?? []) {
    totalByModule.set(sc.module_id, (totalByModule.get(sc.module_id) ?? 0) + 1);
    if (acquisSet.has(sc.id)) {
      acquisByModule.set(sc.module_id, (acquisByModule.get(sc.module_id) ?? 0) + 1);
    }
  }

  const withProgress: ModuleProgress[] = (modules ?? []).map((m) => {
    const total = totalByModule.get(m.id) ?? 0;
    const acquisCount = acquisByModule.get(m.id) ?? 0;
    const percent = total > 0 ? Math.round((acquisCount / total) * 100) : 0;
    return {
      id: m.id,
      tronc: m.tronc,
      titre: m.titre,
      ordre: m.ordre,
      optionnel: m.optionnel,
      totalSousCompetences: total,
      acquisCount,
      percent,
      complete: total > 0 && acquisCount === total,
    };
  });

  return {
    troncA: withProgress.filter((m) => m.tronc === "A"),
    troncB: withProgress.filter((m) => m.tronc === "B"),
    // Premier module non complété selon l'ordre du curriculum — simple
    // suggestion d'affichage, ne restreint jamais l'accès aux autres modules.
    nextSuggested: withProgress.find((m) => !m.complete) ?? null,
  };
}
