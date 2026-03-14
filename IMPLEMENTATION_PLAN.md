# Codex Implementation Plan — Football Position Finder

## Goal
Take this scaffold and turn it into a polished, production-ready MVP built with Next.js 14, TypeScript, Tailwind, Prisma, and PostgreSQL.

## Product goal
Help amateur football players discover the position where they are most likely to perform best based on their playing style, physical profile, mentality, and decisions on the pitch.

## Existing scaffold status
Already present in this repo:
- question bank in `src/data/questions.ts`
- scoring engine in `src/lib/scoring/calculateResult.ts`
- lightweight assertions in `src/lib/scoring/calculateResult.test.ts`
- main screens and UI components
- local-storage result history
- Prisma schema
- API route scaffolding for results

Not done yet:
- frontend wired to DB-backed results API
- robust loading/error states
- result detail page by id
- better landing page sections
- analytics
- SEO pages
- shareable result card image
- auth

## Rules for implementation
1. Keep TypeScript strict.
2. Do not remove or weaken the existing scoring tests.
3. Preserve the current scoring behavior unless there is a bug.
4. Prefer small, composable files.
5. Use App Router conventions.
6. Keep the first pass simple and maintainable.
7. Do not add unnecessary libraries.

## Phase 1 — Make the current scaffold fully runnable
### Tasks
- verify all imports resolve cleanly
- make sure `npm run build` passes
- make sure all client/server boundaries are correct
- add any missing types or guards
- make sure Prisma types compile

### Acceptance criteria
- app runs locally with `npm run dev`
- app builds with `npm run build`
- no TypeScript errors

## Phase 2 — Wire frontend to backend persistence
### Tasks
- create `src/lib/api/results.ts`
- add `fetchResults`, `createResult`, `clearRemoteResults`, `fetchResultById`
- update `AppShell` to:
  - load remote results first
  - fall back to local storage if API fails
  - create remote result on quiz completion
  - clear remote results from history screen
- keep local fallback behavior as backup

### Acceptance criteria
- taking the quiz stores a result in PostgreSQL when API is available
- history shows DB-backed results
- clearing history deletes DB results
- local fallback still works if API fails

## Phase 3 — Add robust UI states
### Tasks
- add loading states for history fetch and result save
- add error messages and retry buttons
- add empty states for no history and no result
- avoid blocking the user when API is slow

### Acceptance criteria
- user always sees a clear state: loading, success, empty, or error
- no silent failures

## Phase 4 — Add result detail page by id
### Tasks
- create `src/app/results/[id]/page.tsx`
- fetch result by id via API or server component
- render same result UI using saved DB data
- add “Open” links from history to this route

### Acceptance criteria
- a saved result can be opened directly by URL
- refresh on result page still works

## Phase 5 — Improve landing page and trust
### Tasks
- upgrade home page into sections:
  - hero
  - how it works
  - positions covered
  - why this helps players
  - CTA
- add a small methodology section
- improve spacing and typography
- keep mobile-first layout

### Acceptance criteria
- landing page feels like a real product, not a prototype

## Phase 6 — SEO starter pages
### Tasks
Create these pages with useful copy:
- `/what-football-position-should-i-play`
- `/winger-vs-striker`
- `/best-football-position-for-fast-players`
- `/what-does-a-cdm-do`

### Acceptance criteria
- each page has metadata
- each page has real content, not filler
- pages are indexable and styled consistently

## Phase 7 — Analytics
### Tasks
Add a lightweight analytics layer. Prefer PostHog or a minimal event abstraction.
Track:
- landing page viewed
- quiz started
- quiz completed
- result generated
- history opened
- share clicked

### Acceptance criteria
- core events are tracked from the main user journey

## Phase 8 — Shareable result card
### Tasks
- create a reusable share card component
- optionally add an Open Graph image route later
- support copying a polished summary string now
- make the result look more social/shareable

### Acceptance criteria
- user can share a result that looks intentional and readable

## Recommended file additions
- `src/lib/api/results.ts`
- `src/app/results/[id]/page.tsx`
- `src/components/LoadingState.tsx`
- `src/components/ErrorState.tsx`
- `src/components/EmptyState.tsx`
- `src/components/ShareCard.tsx`

## Prisma notes
Current schema stores flattened top 3 position fields plus raw answers/scores JSON. That is fine for MVP. Do not over-normalize yet.

## Testing expectations
Keep the current lightweight test file and add more checks when changing scoring behavior.
At minimum, preserve tests for:
- striker-heavy answers -> ST
- goalkeeper-heavy answers include GK
- winger-heavy answers -> WINGER
- invalid answers do not crash
- share text contains primary position

## Final deliverable expected from Codex
By the end of implementation, the app should:
- run locally
- save results to DB
- show result history
- open result detail pages
- handle loading/errors gracefully
- have a polished landing page
- include starter SEO pages

## Priority order
1. compile/build stability
2. backend wiring
3. loading/error states
4. result detail page
5. landing page polish
6. SEO pages
7. analytics
8. share card
