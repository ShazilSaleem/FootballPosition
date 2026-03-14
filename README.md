# Football Position Finder

A Next.js MVP that helps amateur football players discover their best-fit position based on a rule-based assessment.

## Features
- 12-question football position assessment
- rule-based scoring engine
- primary, secondary, and tertiary position ranking
- strengths and watchouts
- shareable result text
- local fallback storage
- Prisma + PostgreSQL backend scaffolding

## Setup
1. `npm install`
2. `cp .env.example .env`
3. add both `DATABASE_URL` and `DIRECT_URL`
4. for Supabase:
   `DATABASE_URL` should use the pooler host and typically `?pgbouncer=true&sslmode=require`
   `DIRECT_URL` should use the direct database host on port `5432`
5. `npm run prisma:generate`
6. `npm run prisma:migrate -- --name init`
7. `npm run dev`

## Current state
This repo is a clean scaffold for Codex to continue from. The UI works with local storage. API routes and Prisma schema are scaffolded, but the frontend is not yet wired to remote persistence.
