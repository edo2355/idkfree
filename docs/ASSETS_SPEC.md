# IDKFREE — Especificación de Assets (Iconos, Botones, Imágenes)

**Convención de nombres:** kebab-case, terminación por rol.
- `ic-*.svg` → iconos (interfaz)
- `logo-*.svg` → logos
- `btn-*.svg` → botones con forma (raros, la mayoría son componentes)
- `empty-*.svg` → ilustraciones de estado vacío
- `img-*.png` → imágenes raster

**Formato preferido:** SVG (1 solo color, `currentColor` si es posible)
**Tamaño de export:** 24×24 (iconos UI), 48×48 (iconos destacados), 512×512+ (ilustraciones)
**Grosor de línea:** 1.5–2px consistente en todo el sistema

---

## 1. TAB BAR (5 iconos — van abajo)

| Archivo | Función | Estado activo |
|---|---|---|
| `ic-tab-home.svg` | Ir al Feed principal | Relleno (fill) |
| `ic-tab-explore.svg` | Explorar/buscar contenido | Relleno |
| `ic-tab-create.svg` | Crear post (destacado al centro, más grande) | Relleno |
| `ic-tab-chats.svg` | Mensajes/Chats | Relleno |
| `ic-tab-profile.svg` | Perfil del usuario | Relleno |

**Nota:** cada uno necesita **2 versiones**: outline (inactivo, #5F5F5F) y fill (activo, #FFFFFF).
Nombres: `ic-tab-home-outline.svg` / `ic-tab-home-fill.svg` etc.

---

## 2. ACCIONES EN POSTS (aparecen en cada PostCard)

| Archivo | Función | Ubicación |
|---|---|---|
| `ic-heart-outline.svg` | Dar like (no dado) | Esquina inferior izquierda card |
| `ic-heart-fill.svg` | Like dado (rojo/purple) | Mismo lugar |
| `ic-comment.svg` | Abrir comentarios | Junto al corazón |
| `ic-repost.svg` | Repostear/compartir interno | Junto al comentario |
| `ic-share.svg` | Compartir externo (link) | Junto al repost |
| `ic-bookmark-outline.svg` | Guardar en Vault | Esquina derecha card |
| `ic-bookmark-fill.svg` | Guardado | Mismo lugar |
| `ic-more-horizontal.svg` | Menú (⋯) eliminar/reportar | Esquina superior derecha card |
| `ic-verified.svg` | Badge verificado (check con destello) | Junto al nombre usuario |
| `ic-live-dot.svg` | Indicador rojo "EN VIVO" | Sobre avatar/título |

---

## 3. NAVEGACIÓN Y ACCIONES GENERALES

| Archivo | Función | Ubicación |
|---|---|---|
| `ic-back.svg` | Volver atrás | Header izquierda |
| `ic-close.svg` | Cerrar modal/X | Header derecha |
| `ic-menu.svg` | Menú hamburguesa | Headers con opciones |
| `ic-search.svg` | Lupa (dentro de tabs Explore) | Barra de búsqueda |
| `ic-settings.svg` | Engranaje ajustes | Tab Profile / header |
| `ic-chevron-right.svg` | Flecha lista | Filas de Ajustes |
| `ic-chevron-down.svg` | Desplegable | Filtros |
| `ic-arrow-right.svg` | Flecha botón "siguiente" | Onboarding |
| `ic-check.svg` | Confirmar/éxito | Formularios |
| `ic-plus.svg` | Añadir (crear, subir) | Botones + |
| `ic-minus.svg` | Quitar | Listas |
| `ic-trash.svg` | Eliminar | Menús contextuales |
| `ic-edit.svg` | Editar | Perfil, posts |
| `ic-filter.svg` | Filtro | Explorar/Vault |
| `ic-sort.svg` | Ordenar | Listas |

---

## 4. AUTENTICACIÓN

| Archivo | Función | Ubicación |
|---|---|---|
| `ic-eye.svg` | Mostrar contraseña (ojo abierto) | Campo contraseña |
| `ic-eye-off.svg` | Ocultar contraseña | Mismo lugar |
| `ic-mail.svg` | Icono email | Input login/register |
| `ic-lock.svg` | Icono contraseña | Input |
| `ic-user.svg` | Icono alias/nombre | Input register |
| `ic-google.svg` | Login con Google (futuro) | Botón social |
| `ic-apple.svg` | Login con Apple (futuro) | Botón social |
| `ic-fingerprint.svg` | Login biométrico | Header/botón alternativo |
| `ic-qr.svg` | Icono QR | Pantalla carnet |

---

## 5. PERFIL Y SOCIAL

| Archivo | Función | Ubicación |
|---|---|---|
| `ic-user-outline.svg` | Avatar placeholder (default) | Card usuario sin foto |
| `ic-users.svg` | Lista de usuarios | Follower/Following |
| `ic-user-plus.svg` | Seguir usuario | Botón en card perfil |
| `ic-user-check.svg` | Siguiendo (ya sigues) | Reemplazo del anterior |
| `ic-user-x.svg` | Dejar de seguir | Hover/long-press |
| `ic-link.svg` | Enlace externo web | Bio perfil |
| `ic-map-pin.svg` | Ubicación | Bio perfil |
| `ic-cake.svg` | Cumpleaños / fecha registro | Bio perfil |

---

## 6. NOTIFICACIONES (tipos)

| Archivo | Función | Ubicación |
|---|---|---|
| `ic-notif-like.svg` | Alguien dio like | Card notificación |
| `ic-notif-comment.svg` | Alguien comentó | Card notificación |
| `ic-notif-follow.svg` | Alguien te siguió | Card notificación |
| `ic-notif-mention.svg` | Te mencionaron | Card notificación |
| `ic-notif-repost.svg` | Repostearon tu contenido | Card notificación |
| `ic-bell-outline.svg` | Campana (tab inactivo) | Tab bar |
| `ic-bell-fill.svg` | Campana activa | Tab bar activo |
| `ic-bell-badge.svg` | Campana con punto rojo | Estado no leído |

---

## 7. CONTENIDO Y MULTIMEDIA

| Archivo | Función | Ubicación |
|---|---|---|
| `ic-camera.svg` | Abrir cámara | Composer create |
| `ic-image.svg` | Elegir de galería | Composer create |
| `ic-video.svg` | Video | Composer create / Reels |
| `ic-mic.svg` | Audio | Composer create |
| `ic-play.svg` | Reproducir | Overlay video/reel |
| `ic-pause.svg` | Pausar | Reproductor |
| `ic-mute.svg` | Silenciar | Reels |
| `ic-unmute.svg` | Activar sonido | Reels |
| `ic-hashtag.svg` | Hashtag # | Composer / search |
| `ic-mention.svg` | Mención @ | Composer |
| `ic-globe.svg` | Visibilidad pública | Selector visibilidad |
| `ic-lock-private.svg` | Visibilidad privada (solo yo) | Selector visibilidad |
| `ic-users-visibility.svg` | Solo seguidores | Selector visibilidad |

---

## 8. HOME / FEED (según mockup 07)

| Archivo | Función | Ubicación |
|---|---|---|
| `ic-live-badge.svg` | Badge "EN VIVO" | Sobre card live |
| `ic-story-ring.svg` | Anillo alrededor de avatar (story) | Fila stories top |
| `ic-story-add.svg` | Añadir story | Primer item stories |
| `ic-follow-back.svg` | Seguir de vuelta | Card sugerencia |
| `ic-spark.svg` | Chispa/estrella decorativa | Detalles |

---

## 9. EXPLORE (según mockup 08)

| Archivo | Función | Ubicación |
|---|---|---|
| `ic-trending.svg` | Tendencia (fuego) | Sección trending |
| `ic-category.svg` | Categoría/grid | Filtros |
| `ic-view-grid.svg` | Vista cuadrícula | Toggle explorar |
| `ic-view-list.svg` | Vista lista | Toggle explorar |

---

## 10. CARNET / VAULT (según mockups 15-16)

| Archivo | Función | Ubicación |
|---|---|---|
| `ic-card.svg` | Carnet virtual | Tab/pantalla carnet |
| `ic-qr-large.svg` | QR grande (framing) | Dentro del carnet |
| `ic-shield.svg` | Seguridad/privacidad | Badge carnet |
| `ic-download.svg` | Descargar | Botón carnet |
| `ic-copy.svg` | Copiar texto | Card ID |
| `ic-vault.svg` | Caja fuerte (Vault) | Tab/screen vault |
| `ic-plus-circle.svg` | Añadir recuerdo | Vault |
| `ic-calendar.svg` | Fecha | Filtros vault |
| `ic-tag.svg` | Etiqueta | Organizar vault |

---

## 11. AJUSTES (según mockup 17)

| Archivo | Función | Ubicación |
|---|---|---|
| `ic-account.svg` | Cuenta | Ajustes |
| `ic-privacy.svg` | Privacidad | Ajustes |
| `ic-security.svg` | Seguridad | Ajustes |
| `ic-notifications.svg` | Notificaciones | Ajustes |
| `ic-appearance.svg` | Apariencia/tema | Ajustes |
| `ic-language.svg` | Idioma y región | Ajustes |
| `ic-help.svg` | Ayuda | Ajustes |
| `ic-info.svg` | Acerca de IDKFREE | Ajustes |
| `ic-logout.svg` | Cerrar sesión | Ajustes |

---

## 12. MARCA / LOGOS

| Archivo | Función | Formato |
|---|---|---|
| `logo-primary.svg` | Logotipo completo IDK FREE (blanco) | Horizontal |
| `logo-primary-black.svg` | Logotipo completo IDK FREE (negro) | Horizontal |
| `logo-orbital.svg` | IDK FREE con órbita (versión hero) | Horizontal |
| `logo-symbol.svg` | Solo símbolo "?" con estrella (blanco) | Cuadrado |
| `logo-symbol-black.svg` | Símbolo negro | Cuadrado |
| `logo-monogram.svg` | Monograma IF (blanco) | Cuadrado |
| `logo-monogram-black.svg` | Monograma negro | Cuadrado |
| `logo-vertical.svg` | IDK sobre FREE (layout vertical) | Vertical |
| `logo-split.svg` | IDK / FREE con slash | Horizontal |
| `icon-app.png` | Icono app store (fondo negro) | 1024×1024 |
| `icon-adaptive.png` | Adaptive icon Android (transparente) | 1024×1024 |
| `splash.png` | Splash screen | 1284×2778 |
| `splash-logo.svg` | Solo logo para splash | Cuadrado |

---

## 13. ELEMENTOS DE MARCA

| Archivo | Función | Uso |
|---|---|---|
| `brand-star.svg` | Estrella de 4 puntas | Decorativo |
| `brand-orbit.svg` | Línea orbital | Decorativo |
| `brand-question.svg` | "?" grande | Decorativo |
| `brand-lines-h.svg` | 3 líneas horizontales | Divisor |
| `brand-fragments.svg` | Fragmentos geométricos | Decorativo |

---

## 14. ESTADOS VACÍOS (ilustraciones)

| Archivo | Estado | Pantalla |
|---|---|---|
| `empty-feed.svg` | Feed sin posts | Feed |
| `empty-search.svg` | Sin resultados de búsqueda | Search |
| `empty-notifications.svg` | Sin notificaciones | Notifications |
| `empty-chats.svg` | Sin conversaciones | Chats |
| `empty-vault.svg` | Sin recuerdos guardados | Vault |
| `empty-error.svg` | Error de conexión | Cualquiera |

**Tamaño recomendado:** 240×240, línea fina (1.5px), monocromo.

---

## 15. ONBOARDING (3 ilustraciones hero)

| Archivo | Pantalla |
|---|---|
| `onboarding-1.svg` | "Bienvenido a IDKFREE — La red social donde no tienes que saberlo todo" |
| `onboarding-2.svg` | "Conecta sin presión — Sin algoritmo, sin likes vacíos, solo personas reales" |
| `onboarding-3.svg` | "Tu cuenta, siempre tuya — Con tu carnet, nunca pierdes tu identidad" |

**Tamaño:** 375×500 aprox, estilo editorial (foto/ilustración con estrella).

---

## 16. REELS / LIVE / CHAT

| Archivo | Función |
|---|---|
| `ic-live-circle.svg` | Indicador live en card |
| `ic-viewers.svg` | Número de espectadores (ojo) |
| `ic-chat-bubble.svg` | Chat genérico |
| `ic-chat-send.svg` | Enviar mensaje |
| `ic-chat-attach.svg` | Adjuntar archivo |
| `ic-chat-emoji.svg` | Emoji picker |
| `ic-online-dot.svg` | Punto verde "en línea" |
| `ic-typing.svg` | Puntos "escribiendo..." |
| `ic-reel-play.svg` | Play reels |
| `ic-reel-mute.svg` | Silenciar reels |

---

## 17. TIENDA (según mockup 14)

| Archivo | Función |
|---|---|
| `ic-shop-bag.svg` | Bolsa tienda |
| `ic-cart.svg` | Carrito |
| `ic-price-tag.svg` | Etiqueta precio |
| `ic-shipping.svg` | Envío |
| `ic-payment.svg` | Método de pago |
| `ic-heart-product.svg` | Favorito producto |

---

## RESUMEN — TOTAL DE ARCHIVOS A DISEÑAR

- **Tab bar:** 10 (5 outline + 5 fill)
- **Acciones post:** 10
- **Navegación general:** 15
- **Auth:** 9
- **Perfil social:** 9
- **Notificaciones:** 8
- **Contenido/multimedia:** 14
- **Home/Feed:** 6
- **Explore:** 4
- **Carnet/Vault:** 11
- **Ajustes:** 9
- **Logos:** 13
- **Marca decorativa:** 5
- **Empty states:** 6
- **Onboarding:** 3
- **Reels/Live/Chat:** 10
- **Tienda:** 6

**TOTAL: ~148 archivos** (muchos son variantes de los mismos; ~60-70 conceptos únicos)

---

## PRIORIDAD DE ENTREGA (para ir avanzando sin bloquear)

### Ronda 1 (crítico — bloquea UI actual)
1. 5 tab icons (outline + fill)
2. `ic-heart-outline.svg`, `ic-heart-fill.svg`
3. `ic-comment.svg`, `ic-share.svg`, `ic-bookmark-outline.svg`, `ic-bookmark-fill.svg`
4. `ic-search.svg`, `ic-settings.svg`, `ic-back.svg`, `ic-close.svg`
5. `ic-user-outline.svg` (avatar placeholder)

### Ronda 2 (perfiles + notificaciones)
- Iconos perfil social + notif types

### Ronda 3 (composer + explore)
- Multimedia + hashtag + visibility

### Ronda 4 (extras — carnet, vault, shop, reels)
- Todo lo demás

---

## NOTAS DE ESTILO

- **Trazos finos:** 1.5px constante
- **Esquinas redondeadas:** donde aplique, radio 2-4px en iconos
- **Monocromo:** sin color por defecto → se colorea en código
- **Área de protección:** 2px mínimo interno en el viewBox de 24×24
- **Viewbox:** `0 0 24 24` para iconos UI, `0 0 48 48` para destacados

---

**Cuando entregues cada SVG, ponlo en:**
`/sdcard/Download/IDKFREE/branding/icons/`

Yo los copio a `~/idkfree/mobile/assets/icons/` e integro uno por uno.
