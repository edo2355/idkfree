# IDKFREE · Streams en vivo

## Decisión arquitectónica

**WebRTC + SFU (Selective Forwarding Unit)** — no P2P puro.

### ¿Por qué no P2P?
- P2P funciona para 1:1, pero con 20+ viewers la subida del streamer se satura
- Cuba tiene uploads limitados → P2P no escala

### ¿Por qué SFU?
- El streamer sube **1 vez** al servidor
- El servidor redistribuye a N viewers
- Compatible con móvil 3G/4G/WiFi
- Ya hay servidores open-source listos: **mediasoup**, **LiveKit**, **Janus**

### Recomendación: **LiveKit**
- Open source (Apache 2.0)
- SDK oficial para React Native
- Self-hosteable (corre en un VPS de $5/mes)
- Soporta audio, video, screen share, chat integrado
- WebRTC puro (sin plugins)

---

## Flujo técnico


1. Streamer → POST `/streams/start` → backend crea stream + room en LiveKit
2. Backend → devuelve `token` + `room_id`
3. Streamer se conecta a LiveKit con ese token
4. Viewers → GET `/streams/:id/join` → backend devuelve su token → se conectan

---

## Fases de implementación

### Fase 1 — UI + backend (AHORA)
- [x] Tabla `streams` en SQLite
- [x] Endpoints `/streams/start`, `/streams/active`, `/streams/:id`
- [x] Pantalla Streams (placeholder)
- [x] Botón "Iniciar stream" (sin conectar aún)

### Fase 2 — Dev build + LiveKit SDK
- [ ] Requiere **EAS Dev Build** (no funciona en Expo Go)
- [ ] `npm install @livekit/react-native @livekit/react-native-webrtc`
- [ ] Config nativa: permisos cámara/micrófono
- [ ] Configurar LiveKit en `app.json` (plugins nativos)

### Fase 3 — Streams funcionales
- [ ] Streamer: cámara frontal/trasera, mic on/off
- [ ] Viewer: reproductor fullscreen, chat lateral
- [ ] Señales (like, follow, report)
- [ ] Contador de viewers en vivo
- [ ] Modo "solo audio" para conexiones lentas

### Fase 4 — Escalado
- [ ] Deploy LiveKit a VPS (Hetzner, DigitalOcean)
- [ ] CDN para HLS fallback (viewer sin WebRTC)
- [ ] Grabación de streams (S3-compatible)

---

## Costos estimados

| Recurso | Costo |
|---|---|
| VPS LiveKit (2 vCPU, 4GB) | ~$12/mes |
| Ancho de banda (500 GB/mes) | ~$5-20/mes |
| **Total** | **~$20-35/mes** para 100-500 usuarios activos |

**Modo actual**: gratis (no hay streams activos).

---

## Requisitos para empezar Fase 2

1. **Expo SDK 54+** ✅ (ya lo tienes)
2. **EAS Dev Build** (bloquea Expo Go)
3. **Cuenta Expo** ✅
4. **Backend accesible desde internet** (para viewers externos)
5. **VPS LiveKit** o cuenta cloud (livekit.cloud)

---

## Riesgos conocidos

- **iOS/Android permisos**: la cámara en background NO funciona en iOS sin entitlements especiales
- **Conexiones lentas**: WebRTC adapta el bitrate, pero en 3G puede caer a 240p
- **VPNs**: algunas bloquean UDP → WebRTC cae a TCP (más lento)
- **Psiphon**: puede interferir con WebRTC. Testear con VPN apagada.

---

## Notas

- La app móvil actual (Expo Go) **NO puede** ejecutar WebRTC. Requiere Dev Build.
- La web (Vite) **SÍ puede** ejecutar WebRTC directamente.
- Prioridad futura: **web primero**, mobile después.
