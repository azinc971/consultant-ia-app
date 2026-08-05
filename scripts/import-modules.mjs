#!/usr/bin/env node
// Script d'import unique : parse les 13 fichiers module-*.md à la racine du
// projet et peuple les tables modules / sous_competences / quiz_questions.
//
// Ne modifie jamais les fichiers module-*.md (lecture seule).
//
// Usage :
//   node scripts/import-modules.mjs --dry-run   (parse et affiche un résumé, aucune écriture DB)
//   node scripts/import-modules.mjs             (importe réellement dans Supabase)
//
// Nécessite dans .env.local (en plus des variables NEXT_PUBLIC_SUPABASE_*) :
//   SUPABASE_SERVICE_ROLE_KEY=...
// (clé service_role, jamais préfixée NEXT_PUBLIC_ — elle contourne la RLS et
// ne doit jamais être exposée au client. Dashboard > Project Settings > API.)

import { readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const DRY_RUN = process.argv.includes("--dry-run");

// Ordre exact du curriculum demandé : A1..A8 puis B1..B5.
const MODULE_FILES = [
  "module-A1-fondamentaux-ia.md",
  "module-A2-posture-de-conseil.md",
  "module-A3-data-infrastructure.md",
  "module-A4-roi-business-case.md",
  "module-A5-reglementaire-transversal.md",
  "module-A6-developper-activite.md",
  "module-A7-saas-claude-code-optionnel.md",
  "module-A8-automatisation-pratique.md",
  "module-B1-cadre-reglementaire-officine.md",
  "module-B2-ecosysteme-logiciel-officinal.md",
  "module-B3-cas-usage-officine.md",
  "module-B4-ia-industrie-pharma.md",
  "module-B5-dispositifs-medicaux-ia.md",
];

const OPTIONAL_CODES = new Set(["A7", "A8"]);

function parseModule(raw, filename) {
  const codeMatch = filename.match(/^module-([AB]\d)-/);
  if (!codeMatch) {
    throw new Error(`${filename}: nom de fichier inattendu, code module introuvable`);
  }
  const code = codeMatch[1];
  const tronc = code[0];

  const h1Match = raw.match(/^#\s+(.+?)\s*$/m);
  if (!h1Match) throw new Error(`${filename}: titre H1 introuvable`);
  const titre = h1Match[1].trim();

  const checklistMatch = /^## Checklist de compétences\s*$/m.exec(raw);
  const quizMatch = /^## Quiz[^\n]*$/m.exec(raw);
  const estimationMatch = /^## Estimation de temps d'apprentissage\s*$/m.exec(raw);

  if (!checklistMatch) throw new Error(`${filename}: section "## Checklist de compétences" introuvable`);
  if (!quizMatch) throw new Error(`${filename}: section "## Quiz" introuvable`);
  if (quizMatch.index < checklistMatch.index) {
    throw new Error(`${filename}: la section Quiz apparaît avant la Checklist, ordre inattendu`);
  }

  const h1LineEnd = raw.indexOf("\n", h1Match.index) + 1;
  const beforeChecklist = raw.slice(h1LineEnd, checklistMatch.index).trim();
  const checklistBlock = raw.slice(checklistMatch.index, quizMatch.index);
  const quizBlockEnd = estimationMatch ? estimationMatch.index : raw.length;
  const quizBlock = raw.slice(quizMatch.index, quizBlockEnd);
  const trailingBlock = estimationMatch ? raw.slice(estimationMatch.index).trim() : "";

  // La ligne "*Sources : ...*" (quand présente) se trouve après la dernière
  // question, avant "## Estimation..." — on la récupère pour la garder dans
  // le contenu affiché (les sources doivent rester visibles dans l'app).
  const sourcesLineMatch = quizBlock.match(/^\*Sources?\b.*\*\s*$/m);
  const sourcesLine = sourcesLineMatch ? sourcesLineMatch[0].trim() : "";

  const contenu_markdown = [beforeChecklist, sourcesLine, trailingBlock]
    .filter(Boolean)
    .join("\n\n");

  const sousCompetences = [...checklistBlock.matchAll(/^- \[[ xX]\]\s*(.+)$/gm)].map((m) =>
    m[1].trim(),
  );
  if (sousCompetences.length === 0) {
    throw new Error(`${filename}: aucune sous-compétence trouvée dans la checklist`);
  }

  const quizHeaderLineEnd = quizBlock.indexOf("\n") + 1;
  const quizBody = quizBlock.slice(quizHeaderLineEnd);
  const blocks = quizBody
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  const quizQuestions = [];
  for (const block of blocks) {
    const qMatch = block.match(/^(\d+)\.\s*([\s\S]+?)\n([\s\S]+)$/);
    if (!qMatch) continue; // ignore "---", ligne sources, etc.

    const questionText = qMatch[2].replace(/\s+/g, " ").trim();
    const optionsLine = qMatch[3].replace(/\s+/g, " ").trim();

    const markers = [...optionsLine.matchAll(/([a-d])\)\s*/g)];
    if (markers.length < 2) {
      throw new Error(`${filename}: options illisibles pour la question "${questionText}"`);
    }

    const options = [];
    let correctIndex = -1;
    for (let i = 0; i < markers.length; i++) {
      const start = markers[i].index + markers[i][0].length;
      const end = i + 1 < markers.length ? markers[i + 1].index : optionsLine.length;
      let text = optionsLine.slice(start, end).trim();
      if (text.includes("✔")) {
        correctIndex = i;
        text = text.replace(/✔/g, "").trim();
      }
      options.push(text);
    }

    if (correctIndex === -1) {
      throw new Error(`${filename}: aucune bonne réponse ✔ trouvée pour "${questionText}"`);
    }

    quizQuestions.push({
      question: questionText,
      options,
      bonne_reponse: options[correctIndex],
    });
  }

  if (quizQuestions.length < 5 || quizQuestions.length > 6) {
    throw new Error(
      `${filename}: nombre de questions de quiz inattendu (${quizQuestions.length}, attendu 5 ou 6)`,
    );
  }

  return {
    code,
    tronc,
    titre,
    optionnel: OPTIONAL_CODES.has(code),
    contenu_markdown,
    sousCompetences,
    quizQuestions,
  };
}

async function loadEnvLocal() {
  const raw = await readFile(path.join(ROOT, ".env.local"), "utf8");
  const env = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i === -1) continue;
    env[trimmed.slice(0, i).trim()] = trimmed.slice(i + 1).trim();
  }
  return env;
}

export { parseModule, MODULE_FILES };

async function main() {
  console.log(`Parsing des ${MODULE_FILES.length} fichiers module-*.md...\n`);

  const modules = [];
  for (let i = 0; i < MODULE_FILES.length; i++) {
    const filename = MODULE_FILES[i];
    const raw = await readFile(path.join(ROOT, filename), "utf8");
    const parsed = parseModule(raw, filename);
    parsed.ordre = i + 1;
    modules.push(parsed);

    console.log(
      `✓ ${parsed.code} [ordre ${parsed.ordre}, tronc ${parsed.tronc}, optionnel=${parsed.optionnel}] "${parsed.titre}" — ${parsed.sousCompetences.length} sous-compétences, ${parsed.quizQuestions.length} questions`,
    );
  }

  console.log(`\nParsing terminé sans erreur pour les ${modules.length} modules.`);

  if (DRY_RUN) {
    console.log("\n--dry-run : aucune écriture en base. Exemple de rendu pour le 1er module :\n");
    console.log("--- contenu_markdown (début) ---");
    console.log(modules[0].contenu_markdown.slice(0, 400) + "...");
    console.log("\n--- 1re question de quiz ---");
    console.log(JSON.stringify(modules[0].quizQuestions[0], null, 2));
    return;
  }

  const env = await loadEnvLocal();
  const url = env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL manquant dans .env.local");
  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY manquant dans .env.local (nécessaire pour contourner la RLS en écriture). " +
        "Ajoute-le toi-même dans .env.local (Dashboard > Project Settings > API > service_role).",
    );
  }

  const supabase = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { count, error: countError } = await supabase
    .from("modules")
    .select("id", { count: "exact", head: true });
  if (countError) throw countError;
  if (count && count > 0 && !process.argv.includes("--force")) {
    console.error(
      `\nLa table "modules" contient déjà ${count} ligne(s). Script prévu pour un import unique sur base vide. ` +
        `Relance avec --force pour importer quand même (risque de doublons).`,
    );
    process.exitCode = 1;
    return;
  }

  console.log("\nImport en base...\n");

  for (const mod of modules) {
    const { data: moduleRow, error: moduleError } = await supabase
      .from("modules")
      .insert({
        tronc: mod.tronc,
        titre: mod.titre,
        ordre: mod.ordre,
        contenu_markdown: mod.contenu_markdown,
        optionnel: mod.optionnel,
      })
      .select("id")
      .single();
    if (moduleError) throw new Error(`${mod.code}: échec insertion module — ${moduleError.message}`);

    const moduleId = moduleRow.id;

    const { error: scError } = await supabase.from("sous_competences").insert(
      mod.sousCompetences.map((libelle) => ({ module_id: moduleId, libelle })),
    );
    if (scError) throw new Error(`${mod.code}: échec insertion sous_competences — ${scError.message}`);

    const { error: quizError } = await supabase.from("quiz_questions").insert(
      mod.quizQuestions.map((q) => ({
        module_id: moduleId,
        question: q.question,
        options: q.options,
        bonne_reponse: q.bonne_reponse,
      })),
    );
    if (quizError) throw new Error(`${mod.code}: échec insertion quiz_questions — ${quizError.message}`);

    console.log(`✓ ${mod.code} importé (module_id=${moduleId})`);
  }

  console.log(`\nImport terminé : ${modules.length} modules peuplés.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error("\nÉchec de l'import :", err.message);
    process.exitCode = 1;
  });
}
