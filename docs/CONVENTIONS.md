# Convenciones de Nexo (nombre producto: TBD)

## Regla maestra
El **nombre de producto no aparece en la capa técnica**. Solo en UI y
marketing. La capa técnica es neutra y permanece neutra aunque el
producto cambie de nombre.

## Qué ES neutral (regla)
- Nombres de tablas: `users`, `posts`, `sanctions_screenings`, `orders`
- Nombres de columnas: `user_id`, `verdict`, `created_at`
- Env vars: `JWT_SECRET`, `SANCTIONS_THRESHOLD_BLOCK`
- Endpoints: `/api/auth`, `/api/admin/sanctions/pending`
- Directorios: `backend/`, `web/`, `mobile/`
- Nombres de migraciones: `025_sanctions_screenings.sql`
- Clases/funciones: `sanctionsService`, `screenPerson`

## Qué NO es neutral (permitido)
- UI strings: "Bienvenido a Nexo"
- Landing pages, manifiesto
- Package ID del APK (`com.???/app`)
- Dominio público
- Repos git (por razones históricas)
- Render service names (ligados a dominios)

## Regla de migración de marca
Cuando se decida nombre definitivo:
1. Buscar/reemplazar SOLO en `web/src/**`, `mobile/**`, archivos de marketing
2. NO tocar DB, .env, endpoints, directorios, migraciones
3. Dominio: CNAME nuevo → mismo Render service
4. Repo: GitHub rename (redirect 301 automático)
5. EAS Update publica nueva UI → usuarios no reinstalan

## Ejemplos de lo que NO hacer
❌ `CREATE TABLE nexo_users (...)` → hacer `CREATE TABLE users (...)`
❌ `NEXO_JWT_SECRET` → hacer `JWT_SECRET`
❌ `/api/nexo/posts` → hacer `/api/posts`
❌ `services/nexoComplianceService.ts` → hacer `services/complianceService.ts`

## Ejemplos de lo que SÍ hacer
✅ `<h1>Bienvenido a {BRAND_NAME}</h1>` con `BRAND_NAME` de `app_settings`
✅ Landing page hardcoded "Nexo: libre, gratis, abierto"
✅ Package ID `com.nexo.app` en `app.json` (decisión de distribución)
