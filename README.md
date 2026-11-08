---
title: IDKfree — Red Social de la Soberanía Digital
tags: [idkfree, red-social, cuba, fastify, react, react-native, livekit, turso, qvapay]
created: 2026-10-26
updated: 2026-11-08
version: 1.0.0
status: en-produccion-beta
---

# 🚀 IDKfree

> **No lo sé, gratis o libre.** Red social de la Soberanía Digital.

## 📋 Tabla de Contenidos
- [[#Arquitectura]]
- [[#Stack Tecnológico]]
- [[#Endpoints]]
- [[#Seguridad]]
- [[#Carnet Digital]]
- [[#Menores de Edad]]
- [[#LiveKit]]
- [[#Despliegue]]
- [[#Roadmap]]
- [[#Bitácora de Fixes]]

---

## 🏗️ Arquitectura

Servicios principales:

| Servicio | URL | Deploy |
|---|---|---|
| Backend | https://idkfreegetid.dpdns.org | Render |
| Web | https://www.idkfreegetid.dpdns.org | Render |
| Mobile | APK | GitHub Actions |

---

## 🛠️ Stack Tecnológico

- **Backend:** Node.js 24 + Fastify 4.29 + Turso (libSQL) + JWT + bcrypt + Zod
- **Web:** React 19 + Vite + Zustand + React Router 6
- **Mobile:** React Native 0.76 + Expo 58 + React Navigation
- **Video:** LiveKit Cloud (WebRTC)
- **Emails:** Mailjet / Nodemailer (SMTP)
- **Pagos:** QvaPay (BTCLN)
- **Deploy:** Render + GitHub Actions + Cloudflare

---

## ✅ Endpoints (Verificado 2026-11-08)

### Auth
- POST /api/auth/register - 201
- POST /api/auth/login - 200
- GET /api/auth/me - 200
- GET /api/auth/verify-parent - 200

### Contenido
- POST /api/posts - 201
- GET /api/feed - 200
- POST /api/posts/:id/like - 200
- POST /api/posts/:id/comments - 201
- POST /api/users/:id/follow - 200

### Vibes
- POST /api/vibes - 201
- POST /api/vibes/:id/resonate - 200

### Mensajes
- POST /api/messages - 201
- GET /api/messages - 200
- GET /api/messages/:alias - 200

### Streams
- POST /api/streams/start - 201
- POST /api/streams/:id/end - 200
- GET /api/streams/active - 200
- POST /api/streams/:id/like - 200

### LiveKit
- GET /api/livekit/token - 200
- WebSocket 30s conectado

### Carnet
- POST /api/auth/recover/panic - 200
- POST /api/auth/recover/restore - 200
- POST /api/auth/recover/fenix - 200

### Waitlist
- POST /api/waitlist/join - 201
- GET /api/waitlist/stats - 200
- GET /api/waitlist/card/:code - 200

---

## 🛡️ Seguridad

**Headers (Helmet 11.x):** HSTS, nosniff, DENY, CSP, Referrer-Policy, Permissions-Policy
**Auth:** JWT + bcrypt (10 rounds)
**Rate Limit:** 100 req/min
**SQL:** Todas las consultas parametrizadas

**Secretos en Render:**
- JWT_SECRET, CARD_SECRET, TURSO_AUTH_TOKEN, LIVEKIT_API_SECRET, SMTP_PASS, QVAPAY_APP_SECRET

⚠️ NUNCA usar fallbacks como process.env.X || "default".

---

## 💳 Carnet Digital

Cada usuario recibe:
- 3 QR codes (panic, restore, fenix)
- 3 PINs (4-8 dígitos)
- 3 backups impresos

### Protocolos
- 🚨 Pánico: Bloquea cuenta
- 🔄 Restore: Cambia contraseña
- 🔥 Fénix: Borrado en 24h

**Cifrado:** AES-256-GCM, clave derivada de CARD_SECRET con scrypt.
**Formato BLOB:** [IV 12B][AuthTag 16B][Ciphertext NB]
**Compatibilidad:** libSQL devuelve ArrayBuffer, Node.js Buffer (ambos soportados)

---

## 👶 Menores de Edad

- Registro con fecha nacimiento
- Si < 18 años: email tutor + verificación
- Filtro burbuja: menores solo ven menores
- Sin cruces entre menores y mayores

---

## 📹 LiveKit (Video sin VPN)

Configuración óptima:
- dynacast: true
- adaptiveStream: true
- simulcast: true
- videoCodec: h264
- maxBitrate: 800000
- maxFramerate: 24
- iceTransportPolicy: relay

**Optimizaciones:** H.264, 480p, relay TURN/TCP 443 (evita VPN).

---

## 🚀 Despliegue

Backend:
cd ~/idkfree/backend
npx tsc --noEmit
git add .
git commit -m "feat: descripción"
git push origin main

APK:
cd ~/idkfree
git checkout main && git pull origin main
git checkout sin-livekit && git merge main
git push origin main

Artefacto: IDKfree-APK-Final (10-15 min)

---

## 🗺️ Roadmap

### Completado
- Waitlist con gamificación
- Banner en landing
- PNG descargable del pase
- Panel de admin
- LiveKit sin VPN
- Páginas legales (web + mobile)
- Filtro de menores
- Helmet 11.x
- Webhook QvaPay con HMAC
- Carnet Restore/Panic/Fenix 100%

### Pendiente
- Verificación dominio Mailjet
- APK final con todos los fixes
- QvaPay completo
- Dominio propio

---

## 🔧 Bitácora de Fixes

### 2026-11-08 — Fix verifyPin ArrayBuffer
- Problema: Carnet devolvía 401 en los 3 protocolos
- Causa: libSQL devuelve BLOBs como ArrayBuffer, no Buffer
- Fix: verifyPin acepta Buffer, Uint8Array, ArrayBuffer, Array, strings

### 2026-11-08 — Fix COLLATE NOCASE (mensajes)
- Problema: Bandeja vacía
- Causa: toLowerCase() vs DB con mayúsculas
- Fix: COLLATE NOCASE

### 2026-11-07 — Fix } prematuro en streams.ts
- Problema: Deploy fallaba con TS1128
- Causa: } cerró streamRoutes a la mitad
- Fix: Eliminar } sobrante

### 2026-11-07 — Fix helmet version
- Problema: expected 5.x fastify
- Causa: helmet v13 vs Fastify 4.29
- Fix: @fastify/helmet@11.1.1

---

Última actualización: 2026-11-08
