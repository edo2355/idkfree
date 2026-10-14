# IDKFREE — Notas maestras

## Stack backend (FUNCIONAL)
- Node 24 + Fastify + TypeScript
- SQLite (node:sqlite / DatabaseSync) — NO PostgreSQL
- Wrapper propio en src/db/pool.ts (sintaxis $1/$2)
- bcryptjs (NO argon2)
- JWT + Zod
- 11 módulos: auth, posts, follows, comments, notifications, profile, search, hashtags, vibes, legacy, + verify.sh (55 tests)
- Ruta: ~/Aldea/backend
- DB: ~/Aldea/backend/aldea.db
- Arranque: npm run build && node dist/server.js

## Mobile
- Expo SDK 51 (migrando a 57)
- Ruta: ~/Aldea/mobile
- scheme: idkfree
- bundleId: app.idkfree.mobile
- APK vieja instalada: app.aldea.mobile (NO conecta)

## Editores disponibles
- micro (instalado)
- helix (por instalar)
- nano

## Red / VPN
- Psiphon (servidor Alemania)
- Regla: app final DEBE funcionar en Cuba sin VPN
- VPN solo para desarrollo (npm install, eas build, git push)

## Pagos
- Cuba: QvaPay, Transfermóvil, ENZONA
- Internacional: PayPal/Stripe (requiere entidad legal fuera de Cuba)

## Próximos pasos
1. Migrar a SDK 57
2. Compilar APK nueva con app.idkfree.mobile
3. Tipografías Playfair + Montserrat
4. Documentar API.md

## Reglas para archivos
- NO pegar en terminal con long-press (rompe archivos)
- Copiar del chat → micro → pegar dentro de micro → Ctrl+S
- Alternativa: printf con bloques cortos
