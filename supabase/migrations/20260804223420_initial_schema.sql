-- Consultant IA - schéma initial
-- Voir consultant-ia-app-specs.md section 3 pour le modèle de données de référence.

create extension if not exists pgcrypto;

-- ============================================================================
-- users
-- Table minimale synchronisée avec auth.users (Supabase Auth).
-- Même en usage solo, chaque table métier référence users(id) pour préparer
-- un passage multi-utilisateur sans migration douloureuse.
-- ============================================================================
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

-- Synchronise automatiquement public.users à chaque inscription Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================================
-- modules
-- ============================================================================
create table public.modules (
  id uuid primary key default gen_random_uuid(),
  tronc text not null check (tronc in ('A', 'B')),
  titre text not null,
  ordre integer not null,
  contenu_markdown text not null default '',
  optionnel boolean not null default false
);

-- ============================================================================
-- sous_competences
-- ============================================================================
create table public.sous_competences (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules (id) on delete cascade,
  libelle text not null
);

-- ============================================================================
-- progression
-- ============================================================================
create table public.progression (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  sous_competence_id uuid not null references public.sous_competences (id) on delete cascade,
  acquis boolean not null default false,
  date timestamptz not null default now(),
  unique (user_id, sous_competence_id)
);

-- ============================================================================
-- quiz_questions
-- ============================================================================
create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules (id) on delete cascade,
  question text not null,
  options jsonb not null,
  bonne_reponse text not null
);

-- ============================================================================
-- quiz_resultats
-- ============================================================================
create table public.quiz_resultats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  module_id uuid not null references public.modules (id) on delete cascade,
  score integer not null check (score >= 0),
  date timestamptz not null default now()
);

-- ============================================================================
-- notes
-- ============================================================================
create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  module_id uuid not null references public.modules (id) on delete cascade,
  contenu text not null default '',
  date_maj timestamptz not null default now(),
  unique (user_id, module_id)
);

-- ============================================================================
-- veille
-- ============================================================================
create table public.veille (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id) on delete cascade,
  titre text not null,
  url text,
  resume text,
  tags text[] not null default '{}',
  date_ajout timestamptz not null default now()
);

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.users enable row level security;
alter table public.modules enable row level security;
alter table public.sous_competences enable row level security;
alter table public.progression enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_resultats enable row level security;
alter table public.notes enable row level security;
alter table public.veille enable row level security;

-- users : chacun ne voit/modifie que son propre profil.
create policy "users_select_own" on public.users
  for select using (auth.uid() = id);

create policy "users_update_own" on public.users
  for update using (auth.uid() = id);

-- modules / sous_competences / quiz_questions : contenu pédagogique partagé,
-- lecture seule pour les utilisateurs authentifiés. L'écriture (import des
-- fichiers module-*.md) se fait via la clé service_role, qui contourne la RLS.
create policy "modules_select_authenticated" on public.modules
  for select using (auth.role() = 'authenticated');

create policy "sous_competences_select_authenticated" on public.sous_competences
  for select using (auth.role() = 'authenticated');

create policy "quiz_questions_select_authenticated" on public.quiz_questions
  for select using (auth.role() = 'authenticated');

-- progression / quiz_resultats / notes / veille : données personnelles,
-- chaque utilisateur gère uniquement ses propres lignes.
create policy "progression_all_own" on public.progression
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "quiz_resultats_all_own" on public.quiz_resultats
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "notes_all_own" on public.notes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "veille_all_own" on public.veille
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
