# Consultant IA

Application web d'apprentissage personnel : un parcours modulaire pour apprendre les
fondamentaux du conseil en IA, avec une spécialisation pharmacie/officine.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Supabase](https://supabase.com) (Postgres + Auth)
- Déploiement cible : [Vercel](https://vercel.com)

## Lancer le projet en local

### 1. Prérequis

- Node.js 20+
- Un projet Supabase (gratuit sur [supabase.com](https://supabase.com))

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Copie `.env.example` en `.env.local` :

```bash
cp .env.example .env.local
```

Puis renseigne dedans (Dashboard Supabase > Project Settings > API) :

| Variable | Où la trouver | Nécessaire pour |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings > API | Lancer l'app |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings > API (clé `anon` `public`) | Lancer l'app |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings > API (clé `service_role`) | Uniquement `scripts/import-modules.mjs` en local — **jamais utilisée par l'app**, ne pas la définir sur Vercel |

`.env.local` n'est jamais committé (voir `.gitignore`).

### 4. Appliquer le schéma de base de données

Colle le contenu de `supabase/migrations/*.sql` dans le SQL Editor de ton projet Supabase
(ou `supabase link` puis `supabase db push` si tu utilises la CLI).

### 5. Lancer le serveur de dev

```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev      # serveur de développement
npm run build    # build de production
npm run start    # démarre le build de production en local
npm run lint     # linter
```

### Import initial des modules pédagogiques

```bash
node scripts/import-modules.mjs --dry-run   # vérifie le parsing des fichiers module-*.md, sans écrire en base
node scripts/import-modules.mjs             # importe réellement (nécessite SUPABASE_SERVICE_ROLE_KEY dans .env.local)
```

## Déployer sur Vercel

1. Pousse le repo sur GitHub (ou GitLab/Bitbucket)
2. Importe le projet sur [vercel.com/new](https://vercel.com/new) — Vercel détecte
   automatiquement Next.js, aucune configuration de build nécessaire
3. Dans Vercel > Project Settings > Environment Variables, ajoute :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Ne pas ajouter `SUPABASE_SERVICE_ROLE_KEY` (non utilisée en production)
4. Déploie
5. **Étape obligatoire côté Supabase** : Dashboard > Authentication > URL Configuration,
   ajoute l'URL de déploiement (ex. `https://ton-projet.vercel.app`) à la liste des
   *Redirect URLs* — sinon les liens de confirmation d'inscription par email ne
   fonctionneront pas en production.

## Structure du projet

```
app/                    pages et routes (App Router)
  (protected)/           pages nécessitant une connexion (dashboard, modules, veille)
  login/                 page de connexion/inscription
components/              composants React
lib/                     logique métier, clients Supabase, Server Actions
supabase/migrations/     schéma de base de données
scripts/                 scripts d'administration ponctuels
module-*.md              contenu pédagogique source (ne pas modifier — voir CLAUDE.md)
```

## Documents de référence

- `consultant-ia-app-specs.md` — cahier des charges (curriculum, fonctionnalités, modèle de données)
- `CLAUDE.md` — conventions du projet et règles à respecter en développement
