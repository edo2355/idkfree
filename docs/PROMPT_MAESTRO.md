# 🎯 IDKFREE — PROMPT MAESTRO

## CONTEXTO DEL PROYECTO

Soy Eduardo Rafael Amate Valdés (@edo_amate). Estoy construyendo IDKFREE, una red social sin presión donde no tienes que saberlo todo.

**Nombre:** IDKFREE (IDK = "I don't know" + Free = "libre/gratis")
**Slogan:** "No lo sé, gratis o libre"
**Claim:** "More than a question"
**Tono:** Editorial, premium, minimalista, alta costura

## IDENTIDAD VISUAL

- Base: blanco puro #FFFFFF y negro puro #000000
- Acento personalizable: 10 colores curados (blanco, negro, rojo, azul, verde, dorado, violeta, coral, menta, mostaza)
- Tipografía: Playfair Display (títulos) + Montserrat (UI)
- Logo: "IDK FREE" con órbita y estrella

## ENTORNO TÉCNICO

- Termux en Samsung A06 (3.6 GB RAM, Android 14/15)
- Editor principal: micro
<!-- - Alternativas: helix, nano, Spck -->
- Node 24, npm 11
- VPN Psiphon (Cuba) — solo para desarrollo, la app final debe funcionar sin VPN
- Apps complementarias: Acode, Obsidian, Spck, WormaCeptor, Mock Server Studio, UserLAnd (Debian)

## STACK DECIDIDO (por limitaciones de A06 + Cuba)

**Backend:**
- Node.js + Fastify + TypeScript
- SQLite con node:sqlite (NO PostgreSQL — no funciona en Termux por memoria compartida)
- Wrapper propio en `src/db/pool.ts` con sintaxis PostgreSQL ($1, $2)
- bcryptjs (NO argon2 — no compila en Android)
- JWT + Zod

**Mobile:**
- React Native + Expo SDK 54
- React Navigation 6
- Zustand (estado)
- AsyncStorage + SecureStore

**Pagos (futuro):**
- Cuba: QvaPay, Tropipay, USDT
- Internacional: PayPal (requiere entidad legal fuera de Cuba)
- NUNCA: Stripe/PayPal directo desde Cuba

## ESTADO ACTUAL

**Backend: ✅ COMPLETO Y FUNCIONAL**
- 11 módulos: auth, posts, follows, comments, notifications, profile, search, hashtags, vibes, legacy, + verify.sh (55/55 tests OK)
- 9 migraciones aplicadas
- Ubicación: `~/idkfree/backend/` (copia limpia) y `~/Aldea/backend/` (original funcional)

**Mobile: ❌ A RECONSTRUIR**
- El proyecto anterior (`~/Aldea/mobile`) tiene node_modules roto
- El APK instalado (Aldea) no conecta al backend
- Decisión: empezar de cero en `~/idkfree/mobile/`
- NO copiar node_modules ni el proyecto viejo

## LECCIONES APRENDIDAS (CRÍTICAS)

**Errores que NO repetir:**
1. **No pegar bloques grandes de código en la terminal** — bash los interpreta como comandos y rompe archivos
2. **No pegar en micro con long-press de la terminal** — hay que abrir micro primero y pegar DENTRO del área de texto
3. **Usar `printf` para escribir archivos pequeños/medianos** — más confiable que pegar
4. **Solo UN `npm install` a la vez** — múltiples procesos corrompen node_modules
5. **Cerrar todas las sesiones de Termux menos una** antes de instalar
6. **VPN debe estar activa** para npm/eas/git push — verificar con `npm ping` (< 3000ms ideal)
7. **No usar `watch`** en Termux — rompe permisos

**Comandos seguros:**
- Escribir archivos: `printf '%s\n' 'linea1' 'linea2' > archivo.ts`
- Leer: `cat`, `head`, `tail`, `grep`
- Ver procesos: `ps aux | grep X`
- Monitorizar install: `du -sh node_modules; ps aux | grep npm | grep -v grep | wc -l`

## ESTRUCTURA DE CARPETAS NUEVA


## ✅ ESTADO ACTUAL (2026-10-07 18:40)

**Backend `~/idkfree/backend/`: 100% FUNCIONAL**
- Compilado en `dist/`
- Migraciones 001-009 aplicadas (aldea.db nueva)
- node_modules copiado del Aldea original (70 paquetes)
- .env copiado (JWT_SECRET + PORT + NODE_ENV)
- Servidor corriendo: `nohup node dist/server.js > server.log 2>&1 &`
- Health check: `curl http://127.0.0.1:3000/health`

**Usuarios en DB nueva:**
- testuser / test@idkfree.app / MiPassword12345
- ana / ana@idkfree.app / AnaPassword12345
- nuevo / nuevo@idkfree.app / NuevoPassword123

**Register devuelve:** userId, alias, cardId, recoverySecret, qrPayload, warning
**Login devuelve:** userId, alias, accessToken (JWT 15min)

**Mobile: pendiente reconstruir desde cero**
- Carpeta `~/idkfree/mobile/` vacía
- Debe usar Expo SDK 54, React 19, RN 0.81.5
- Reutilizar código de screens/components/navigation del Aldea mobile (sin node_modules)
- API client actualizado con vibes/hashtags/legacy (ya está en `~/Aldea/mobile/shared/api/client.ts` como referencia)

**Comandos útiles:**
- Backend arrancar: `cd ~/idkfree/backend && nohup node dist/server.js > server.log 2>&1 &`
- Backend health: `curl http://127.0.0.1:3000/health`
- Backend logs: `tail -20 ~/idkfree/backend/server.log`
- Ver usuarios DB: `node -e "const {DatabaseSync}=require('node:sqlite');const db=new DatabaseSync('/data/data/com.termux/files/home/idkfree/backend/aldea.db');console.log(db.prepare('SELECT alias, email FROM users').all());"`

**Notas sobre register:**
- El register devuelve un objeto con `qrPayload` (formato aldea:v1:...) y `recoverySecret`
- NO devuelve accessToken. Solo el login lo hace.
- Si el email/alias ya existe, devuelve error 409.

**IP backend móvil:**
- `127.0.0.1:3000` (localhost, mismo móvil)
- NO usar la IP de datos móviles (Android a veces la bloquea)
- NO usar 192.168.43.49 (es la IP vieja del hotspot, ya no aplica)
