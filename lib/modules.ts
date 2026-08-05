import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ModuleDetail = {
  id: string;
  titre: string;
  tronc: string;
  ordre: number;
  optionnel: boolean;
  contenu_markdown: string;
};

export type ChecklistItem = {
  id: string;
  libelle: string;
  acquis: boolean;
};

export type ModuleNavLink = {
  id: string;
  titre: string;
};

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getModuleDetail(id: string): Promise<{
  module: ModuleDetail;
  checklist: ChecklistItem[];
  previous: ModuleNavLink | null;
  next: ModuleNavLink | null;
}> {
  if (!UUID_RE.test(id)) notFound();

  const supabase = await createClient();

  const { data: moduleRow, error: moduleError } = await supabase
    .from("modules")
    .select("id, titre, tronc, ordre, optionnel, contenu_markdown")
    .eq("id", id)
    .maybeSingle();

  if (moduleError) throw moduleError;
  if (!moduleRow) notFound();

  const [
    { data: sousCompetences, error: scError },
    { data: allModules, error: modulesError },
  ] = await Promise.all([
    supabase.from("sous_competences").select("id, libelle").eq("module_id", id),
    supabase.from("modules").select("id, titre, ordre").order("ordre"),
  ]);

  if (scError) throw scError;
  if (modulesError) throw modulesError;

  const scIds = (sousCompetences ?? []).map((sc) => sc.id);
  let acquisSet = new Set<string>();
  if (scIds.length > 0) {
    const { data: progressionRows, error: progressionError } = await supabase
      .from("progression")
      .select("sous_competence_id")
      .eq("acquis", true)
      .in("sous_competence_id", scIds);
    if (progressionError) throw progressionError;
    acquisSet = new Set((progressionRows ?? []).map((r) => r.sous_competence_id));
  }

  const checklist: ChecklistItem[] = (sousCompetences ?? []).map((sc) => ({
    id: sc.id,
    libelle: sc.libelle,
    acquis: acquisSet.has(sc.id),
  }));

  const modules = allModules ?? [];
  const currentIndex = modules.findIndex((m) => m.id === id);
  const previous = currentIndex > 0 ? modules[currentIndex - 1] : null;
  const next =
    currentIndex >= 0 && currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;

  return { module: moduleRow, checklist, previous, next };
}
