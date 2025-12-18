# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Contexte Projet

- **Projet** : CRM sur-mesure pour Formalyon Conseil (formation professionnelle)
- **Objectif** : Refonte complète d'un VtigerCRM legacy → stack moderne
- **Développeur** : Ichai (5 ans XP, React/Node/PHP/Laravel)

## Domaine Métier

Gestion de formations professionnelles en France :

- **Leads/Stagiaires** : Personnes inscrites à des formations
- **Entreprises** : Clients avec SIRET, IDCC (convention collective), OPCO
- **Formateurs** : Intervenants externes avec ordres de mission
- **Sessions** : Planification des formations (présentiel/distanciel)
- **Facturation** : Devis, factures, suivi paiements OPCO

## Stack Technique

### Backend

| Techno | Version | Usage |
|--------|---------|-------|
| Node.js | 22.x LTS (Jod) | Runtime (LTS jusqu'à avril 2027) |
| TypeScript | 5.9.x | Typage (TS 7 en preview) |
| Hono | 4.11.x | Framework API (léger, Web Standards) |
| Prisma | 7.2.x | ORM + migrations |
| PostgreSQL | 16 | Base de données |
| Redis | 7.x | Cache + sessions + queues |
| BullMQ | 5.x | Job queues (workflows async) |
| Better Auth | 1.4.x | Auth (remplace Lucia, déprécié) |
| Zod | 3.x | Validation schemas |
| Vitest | 2.x | Tests unitaires/intégration |

### Frontend

| Techno | Version | Usage |
|--------|---------|-------|
| React | 19.2.x | UI |
| Vite | 7.3.x | Build tool (v8 beta avec Rolldown) |
| TanStack Query | 5.90.x | Data fetching + cache |
| TanStack Router | 1.x | Routing typé |
| Tailwind CSS | 4.x | Styling |
| Shadcn/ui | latest | Composants UI |
| React Hook Form | 7.x | Formulaires |
| Zod | 3.x | Validation (partagé avec back) |

### Infra

| Techno | Usage |
|--------|-------|
| pnpm | Package manager |
| Turborepo | Monorepo build |
| Docker | Dev local (Postgres, Redis) |

### Note sur les choix

- **Hono > Express** : Plus moderne, Web Standards, 0 dépendances, ultra-rapide
- **Better Auth > Lucia** : Lucia déprécié en mars 2025, Better Auth est le successeur recommandé
- **Node 22 > Node 20** : LTS actif jusqu'en 2027, meilleur support ESM
- **Vite 7** : Stable, v8 (Rolldown) encore en beta

## Architecture Projet

```
formalyon-crm/
├── apps/
│   ├── api/                 # Backend Hono
│   │   ├── src/
│   │   │   ├── modules/     # Feature modules
│   │   │   │   ├── auth/
│   │   │   │   │   ├── auth.routes.ts
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   ├── auth.schema.ts
│   │   │   │   │   └── auth.test.ts
│   │   │   │   ├── users/
│   │   │   │   ├── leads/
│   │   │   │   └── ...
│   │   │   ├── lib/         # Shared utilities
│   │   │   │   ├── db.ts
│   │   │   │   ├── redis.ts
│   │   │   │   └── errors.ts
│   │   │   ├── middlewares/
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── web/                 # Frontend React
│       ├── src/
│       │   ├── components/
│       │   │   ├── ui/      # Shadcn components
│       │   │   └── shared/  # App components
│       │   ├── features/    # Feature modules
│       │   │   ├── auth/
│       │   │   ├── leads/
│       │   │   └── ...
│       │   ├── hooks/
│       │   ├── lib/
│       │   └── routes/
│       └── package.json
│
├── packages/
│   ├── database/            # Prisma
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   ├── src/
│   │   │   └── index.ts     # Export PrismaClient
│   │   └── package.json
│   │
│   └── shared/              # Types/schemas partagés
│       ├── src/
│       │   ├── schemas/     # Zod schemas
│       │   └── types/       # TypeScript types
│       └── package.json
│
├── docker-compose.yml
├── turbo.json
└── package.json
```

## Principes de Code

### KISS (Keep It Simple, Stupid)

- **Pas d'abstraction prématurée** : code direct, refactor quand nécessaire
- **Fonctions courtes** : une fonction = une responsabilité
- **Noms explicites** : `getLeadById` pas `getData`
- **Pas de magie** : code lisible > code clever

### Règles strictes

- Max 130 lignes par fichier — si plus, découper
- Tests obligatoires pour le backend (Vitest)
- Validation Zod sur toutes les entrées API
- Gestion d'erreurs explicite — pas de try/catch silencieux
- Pas de `any` en TypeScript
- Commits atomiques — une feature = un commit

### Structure d'un module backend

```
modules/leads/
├── leads.routes.ts    # Routes Hono (max 50 lignes)
├── leads.service.ts   # Logique métier
├── leads.schema.ts    # Schemas Zod (validation)
├── leads.types.ts     # Types spécifiques (si besoin)
└── leads.test.ts      # Tests Vitest
```

### Pattern API

```typescript
// routes : juste du routing, pas de logique
app.post('/leads', validate(createLeadSchema), async (c) => {
  const data = c.req.valid('json')
  const lead = await leadService.create(data, c.get('user'))
  return c.json(lead, 201)
})

// service : toute la logique métier
async function create(data: CreateLeadInput, user: User) {
  // validation métier
  // appel Prisma
  // return result
}
```

### Pattern Tests

```typescript
describe('LeadService', () => {
  beforeEach(async () => {
    await resetDatabase()
  })

  it('should create a lead', async () => {
    const lead = await leadService.create({
      firstName: 'Jean',
      lastName: 'Dupont',
      email: 'jean@test.com'
    })

    expect(lead.id).toBeDefined()
    expect(lead.firstName).toBe('Jean')
  })

  it('should fail with invalid email', async () => {
    await expect(
      leadService.create({ email: 'invalid' })
    ).rejects.toThrow('Invalid email')
  })
})
```

## Conventions de Nommage

### Fichiers

- `kebab-case` pour les fichiers : `lead-service.ts`
- `.test.ts` pour les tests
- `.schema.ts` pour les validations Zod
- `.types.ts` pour les types TypeScript

### Code

- `camelCase` pour variables et fonctions
- `PascalCase` pour types, interfaces, classes
- `SCREAMING_SNAKE_CASE` pour constantes
- Préfixes : `is`, `has`, `can` pour booléens

### Base de données (Prisma)

- `PascalCase` pour les modèles : `Lead`, `Company`
- `camelCase` pour les champs : `firstName`, `createdAt`
- `snake_case` pour les tables SQL (via `@@map`)

## Commandes Utiles

```bash
# Dev
pnpm dev              # Lance tout (turbo)
pnpm dev:api          # Backend seul
pnpm dev:web          # Frontend seul

# Database
pnpm db:generate      # Prisma generate
pnpm db:migrate       # Prisma migrate dev
pnpm db:studio        # Prisma Studio
pnpm db:seed          # Seed data

# Tests
pnpm test             # Tous les tests
pnpm test:api         # Tests backend
pnpm test:watch       # Watch mode

# Build
pnpm build            # Build tout
pnpm typecheck        # Vérif TypeScript
pnpm lint             # ESLint
```

## Variables d'Environnement

```bash
# apps/api/.env
DATABASE_URL="postgresql://user:pass@localhost:5432/formalyon"
REDIS_URL="redis://localhost:6379"
BETTER_AUTH_SECRET="random-32-chars-minimum"
CORS_ORIGIN="http://localhost:5173"

# apps/web/.env
VITE_API_URL="http://localhost:3000"
```

## Notes Importantes

### Sécurité (ne pas reproduire les erreurs du legacy)

- **Hash passwords** : Argon2id (via Better Auth)
- **Sessions** : Redis, pas de JWT stateless
- **CSRF** : Protection activée
- **Rate limiting** : Sur auth endpoints
- **Validation** : Zod sur TOUTES les entrées

### Performance

- **Indexes** : Sur tous les champs de recherche
- **Pagination** : Cursor-based, pas d'offset
- **Cache** : Redis pour données fréquentes
- **N+1** : Attention aux includes Prisma

---

Si tu as des questions sur le CRM legacy, tu peux me les poser, je lancerais un agent dans le CRM legacy pour répondre à tes questions.
