@AGENTS.md

# CLAUDE.md

## Contexte

Application web d'apprentissage personnel : "Consultant IA" — un parcours modulaire pour apprendre les fondamentaux du conseil en IA, avec une spécialisation pharmacie/officine. Usage personnel dans un premier temps, architecturé pour pouvoir évoluer en produit partageable plus tard.

Stack : Next.js (App Router) + TypeScript + Tailwind CSS + Supabase (Postgres + Auth). Déploiement cible : Vercel.

## Documents de référence

- `consultant-ia-app-specs.md` : cahier des charges complet (curriculum, fonctionnalités, schéma de données). Toujours le consulter en cas de doute sur une fonctionnalité ou le modèle de données.
- 13 fichiers `module-*.md` au total (11 modules obligatoires : A1 à A6, B1 à B5 ; 2 modules optionnels : A7 et A8) : contenu pédagogique complet, déjà rédigé et sourcé.

## Règle absolue

**Ne jamais modifier, réécrire ou "améliorer" le contenu des 13 fichiers `module-*.md`.** Ce sont des sources de vérité pédagogique déjà validées. Le seul traitement autorisé sur ces fichiers est leur **parsing/import** en base de données (voir étape 4 de la séquence de build). Si un problème de formatage empêche le parsing, me le signaler plutôt que de corriger le fichier soi-même.

## Modèle de données (Supabase)

```
modules (id, tronc, titre, ordre, contenu_markdown, optionnel boolean default false)
sous_competences (id, module_id, libelle)
progression (id, user_id, sous_competence_id, acquis boolean, date)
quiz_questions (id, module_id, question, options jsonb, bonne_reponse)
quiz_resultats (id, user_id, module_id, score, date)
notes (id, user_id, module_id, contenu, date_maj)
veille (id, user_id, titre, url, resume, tags, date_ajout)
```

Même en usage solo, garder `user_id` sur chaque table dès le départ (évite une migration douloureuse si l'app s'ouvre à d'autres utilisateurs).

## Commandes utiles

```
npm run dev          # lancer le serveur de dev
npm run build         # build de production
npm run lint          # linter
supabase migration up  # appliquer les migrations (si CLI Supabase configurée)
```

## Conventions de code

- Composants React en PascalCase, un composant par fichier
- Pas de logique métier dans les composants de page (`app/`) — extraire vers `lib/`
- Variables d'environnement Supabase toujours en `.env.local`, jamais committées
- Tailwind uniquement, pas de CSS custom sauf nécessité justifiée

## Ordre du curriculum (important pour l'affichage et la navigation)

Tronc A (socle généraliste) : A1 → A2 → A3 → A4 → A5 → A6 → A7 (optionnel) → A8 (optionnel)
Tronc B (spécialisation officine) : B1 → B2 → B3 → B4 → B5

**Aucun verrouillage entre modules.** Tous les modules, y compris A7 et A8, sont librement accessibles et consultables à tout moment, quelle que soit la progression sur les autres modules. L'ordre ci-dessus sert uniquement à l'affichage et à la suggestion du "prochain module" — jamais à restreindre l'accès.

## Pièges connus à éviter

- Ne pas coder le rendu Markdown "à la main" — utiliser une librairie éprouvée (ex : `react-markdown`) pour éviter les bugs d'affichage sur les tableaux et listes des modules
- Les modules contiennent des blocs de code `mermaid` (schémas/diagrammes). `react-markdown` seul ne les rend pas — ajouter un plugin dédié (ex : `remark-mermaid` ou un composant custom appelant `mermaid.js` au rendu) pour que ces blocs s'affichent comme des diagrammes plutôt que comme du texte brut
- Le calendrier réglementaire (AI Act, module A5) est explicitement signalé comme évolutif dans le contenu — ne pas "corriger" les dates sans revérifier une source officielle
- Ne pas ajouter de paiement (Stripe/EpayNC) tant que le projet reste en usage personnel — hors scope du MVP
