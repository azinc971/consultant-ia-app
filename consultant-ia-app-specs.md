# App d'apprentissage "Consultant IA" — Spécifications

**Objectif** : outil personnel d'apprentissage structuré, architecturé pour pouvoir évoluer en produit partageable plus tard (sans refonte majeure).

---

## 1. Curriculum modulaire

Structure en 2 troncs : un socle généraliste (obligatoire) et une spécialisation santé/pharmacie (optionnelle mais recommandée pour toi). Chaque module = pages de contenu + checklist de compétences + quiz.

### Tronc A — Socle généraliste consultant IA

| Module | Contenu | Sources de référence |
|---|---|---|
| A1. Fondamentaux IA | ML, deep learning, IA générative, LLM, limites et biais | D.U. Paris-Saclay module 1 |
| A2. Posture de conseil | Audit de maturité IA, cadrage besoin métier, feuille de route, éviter le "solutionnisme aveugle" | Fiches métier FormaVie, weblibellule |
| A3. Data & infrastructure | Qualité des données, cloud computing, choix d'outils (no-code vs dev) | — |
| A4. ROI & business case | Estimation gains, calcul retour sur investissement, présentation aux décideurs | — |
| A5. Réglementaire transversal | AI Act européen, RGPD, gouvernance des données, éthique | D.U. module 6 |
| A6. Développer son activité | Statut (indépendant/société), tarification (TJM), prospection, portfolio de cas | Cyberini |
| A7. Construire des SaaS avec Claude Code *(optionnel)* | Claude Code vs Cowork, méthode spec-first, délais réalistes, automatisation pour PME, modèles économiques | Hubfi, Just Use AI, Volteyr |
| A8. Automatisation pratique — guide pas à pas *(optionnel)* | 2 cas complets avec prompts réels : tri automatique de factures, chatbot de prise de rendez-vous | Parseur, Genee, Tailride |

### Tronc B — Spécialisation pharmacie/santé

| Module | Contenu | Sources de référence |
|---|---|---|
| B1. Cadre réglementaire officine | Certification LGO, obligations HDS, consentement patient | Guide YouFeel |
| B2. Écosystème logiciel officinal | LGPI, Winpharma, Smart Rx, Crystal (Caduciel), PharmaVitale, référencement Ségur — logique d'intégration plutôt que remplacement | Le Moniteur des Pharmacies, Clempo.fr, Lonasante.fr |
| B3. Cas d'usage officine | Gestion de stock prédictive, aide à la dispensation, analyse d'interactions | Pharmalift, YouFeel |
| B4. IA & industrie pharma | Pharmacovigilance augmentée, affaires réglementaires, essais cliniques | D.U. module 2, PharmaCentre |
| B5. Dispositifs médicaux IA (optionnel avancé) | Certification, marquage CE, suivi post-commercialisation | D.U. "Systèmes IA et DM" |

### Parcours suggéré (pédagogique — distinct de l'ordre technique de navigation)

*Note : ce parcours est une recommandation de lecture, pensée pour entrelacer pratique et théorie. Il est différent de l'"ordre du curriculum" utilisé par l'app pour la navigation précédent/suivant (voir section 3), qui reste strictement linéaire (A1→A8 puis B1→B5) pour simplifier l'implémentation. Tu peux suivre ce parcours suggéré librement, l'app ne l'impose pas.*

1. A1 → A2 → A3 (bases, ~3-4 semaines à ton rythme)
2. A5 en parallèle (réglementaire, se lit progressivement)
3. B1 → B2 → B3 (spécialisation, cœur de ta valeur ajoutée)
4. A4 → A6 (transformer les connaissances en offre commerciale)
5. A7 en option, dès que tu veux passer à la pratique (construire des solutions pour de vrais clients)
6. A8 juste après A7, pour t'exercer sur des cas concrets avec des prompts réels
7. B4/B5 en approfondissement selon les clients visés

---

## 2. Fonctionnalités de l'application

### MVP (version 1 — usage personnel)
- **Dashboard** : progression par module, % complété, prochaine étape suggérée
- **Contenu de module** : texte structuré + liens sources + schémas simples
- **Checklist de compétences** : cases à cocher par sous-compétence (ex: "je sais expliquer ce qu'est un LLM à un pharmacien titulaire")
- **Quiz de validation** : 5-6 questions par module, auto-corrigées
- **Journal de veille** : espace pour coller/organiser des articles trouvés (toi + Claude Cowork alimentent cette base au fil du temps)
- **Notes personnelles** : bloc-notes libre par module

### Évolutions possibles (si le projet devient un produit)
- Multi-utilisateurs (auth Supabase déjà prête)
- Génération de certificat de complétion
- Espace communauté / partage de cas clients
- Version marque blanche pour d'autres consultants sectoriels

---

## 3. Architecture technique recommandée

Même stack que CFPpro.nc pour réutiliser tes acquis :

- **Frontend** : Next.js + TypeScript + Tailwind CSS
- **Backend/DB** : Supabase (Postgres + Auth + Storage)
- **Hébergement** : Vercel (déploiement continu depuis GitHub)
- **Pas de paiement nécessaire en MVP** (usage perso) — Stripe/EpayNC à ajouter seulement si tu passes en mode produit

### Modèle de données simplifié (Supabase)

```
modules (id, tronc, titre, ordre, contenu_markdown, optionnel boolean default false)
sous_competences (id, module_id, libelle)
progression (id, user_id, sous_competence_id, acquis boolean, date)
quiz_questions (id, module_id, question, options, bonne_reponse)
quiz_resultats (id, user_id, module_id, score, date)
notes (id, user_id, module_id, contenu, date_maj)
veille (id, user_id, titre, url, resume, tags, date_ajout)
```

Même en usage solo, avoir une table `user_id` dès le départ évite une migration douloureuse si tu ouvres l'app à d'autres plus tard.

---

## 4. Répartition des rôles Claude Cowork / Claude Code

**Claude Cowork** (recherche et contenu) :
- Rechercher et vérifier les sources pour chaque module (comme on l'a fait dans cette conversation)
- Rédiger le contenu pédagogique de chaque module en Markdown
- Générer les questions de quiz à partir du contenu vérifié
- Maintenir le journal de veille à jour (nouvelles réglementations, cas d'usage)

**Claude Code** (construction de l'app) :
- Scaffolding Next.js + Supabase (structure de projet, schéma DB, auth)
- Composants UI (dashboard, lecteur de module, quiz interactif)
- Déploiement Vercel
- Ne pas lui donner de contenu à "inventer" — seulement injecter les Markdown produits par Cowork/toi

**Point de vigilance sourcing** : pour rester fidèle à ta contrainte de véracité, chaque fiche de module doit citer sa source d'origine (D.U., article, réglementation) directement dans le contenu affiché dans l'app — pas seulement dans tes notes de préparation.

---

## 5. Prochaines étapes concrètes

1. Valider/ajuster cette structure de curriculum avec moi
2. Me demander de rédiger le contenu Markdown des 2-3 premiers modules (A1, A2) avec sources vérifiées
3. Passer sur Claude Code avec ce document + les fichiers Markdown pour scaffolder l'app
4. Itérer module par module plutôt que tout construire d'un coup
