# Aldea

Red social con identidad física, memoria digital y comunidad real.

**Versión actual:** 0.0.4

## Estructura

- `backend/` → API Node.js + Fastify + PostgreSQL

## Requisitos

- Node.js 20+
- PostgreSQL 14+ (o cuenta en Supabase)

## Instalación

```bash
cd backend
npm install
cp .env.example .env
npm run migrate
npm run dev