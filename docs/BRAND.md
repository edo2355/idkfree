# IDKFREE — Sistema Visual

> Documento maestro del lenguaje gráfico de IDKFREE.
> Sintetiza el moodboard de referencias en 3 capas cohesivas.

---

## 1. Filosofía

IDKFREE se ve como **un documento oficial que nadie puede falsificar**.  
Mezcla tres lenguajes que normalmente no se juntan:

- **Burocracia técnica** (expedientes, fichas, barcodes)
- **HUD futurista** (overlays militares, sensores, datos en vivo)
- **Editorial brutalist** (tipografía condensada, alto contraste, swiss grid)

El resultado: **una identidad digital que parece un pasaporte del futuro**,
impreso en una impresora térmica de los años 70.

---

## 2. Sistema de 3 capas

### Capa 1 — FONDO NARRATIVO
Elemento visual que "cuenta" algo en cada pantalla.

| Pantalla | Elemento |
|---|---|
| Login | Carnets/tickets cayendo (rotados, con blur, cinemático) |
| Splash | Grid warped + waveforms concéntricas |
| Register | Barras de código + barcode decorativo |
| Recovery | HUD corner brackets + tablas técnicas |
| Carnet | OSHIMA + barcode + hex + waveform (ya implementado) |

### Capa 2 — SISTEMA TÉCNICO
Vocabulario gráfico reutilizable en toda la app.

- **Noise/grano** sutil sobre negro (opcional, sobre todo el fondo)
- **HUD overlays**: corner brackets, crosshairs, compass, marcadores
- **Waveforms** decorativas (tipo Kreuzwave)
- **Barcodes y QRs** como decoración
- **Captions monoespaciados**: `SYS.OK`, `AUTH.CMD`, `[INPUT]`, `N° 001`
- **Iconografía** lineal (Onyx-style, 1.5px stroke)

### Capa 3 — DOCUMENTO OFICIAL
Output imprimible para la feature **Expediente/Denuncia**.

- Header clasificado (`[ CLASSIFICATION: CONFIDENTIAL ]`)
- Foto + fingerprints + datos tabulados
- Secciones con `CAUSE → CONDITION → RESULT` (tipo OMEGA CYCLE)
- Sellos (`[ CONFIRMED ]`, `[ IN CUSTODY ]`, `[ PENDING ]`)
- Barcode + QR + número de expediente
- **Exportable como PDF** (expo-print)

---

## 3. Tokens

### Color
| Token | Valor |
|---|---|
| `bg` | `#050505` |
| `surface` | `#0F0F0F` |
| `elevated` | `#1A1A1A` |
| `border` | `#222222` |
| `text` | `#FFFFFF` |
| `textMuted` | `#A3A3A3` |
| `textSubtle` | `#5F5F5F` |
| `danger` | `#EF4444` |
| `success` | `#22C55E` |
| `accent*` | 10 dinámicos (blanco, negro, rojo, azul, verde, dorado, violeta, coral, menta, mostaza) |

### Tipografía
| Rol | Fuente |
|---|---|
| Display editorial | Playfair Display |
| Display condensada | Voga, Dark Future, MonumentExtended |
| UI general | Space Grotesk |
| Técnica / caption | `monospace` (TechLabel) |
| Pixel/block (opcional) | Decryptor-style (a construir) |

### Espaciado
- Grid base: **4px**
- Padding pantalla: **24px**
- Padding cards: **16px**
- Radius: **8-12px** (bordes redondeados suaves) / **0px** (documentos oficiales)

---

## 4. Inventario de componentes a construir

### Fase A — Fondos narrativos
- [ ] `CarnetTicketsBackground` — carnets cayendo (Login)
- [ ] `NoiseOverlay` — grano sutil global
- [ ] `GridBackground` — grid técnico (Recovery, Register)

### Fase B — Sistema técnico
- [ ] `HUDCorners` — corner brackets reutilizables
- [ ] `WaveformRow` — onda decorativa (Kreuzwave)
- [ ] `ConcentricRings` — anillos concéntricos
- [ ] `CrosshairMarker` — cruces de mira
- [ ] `Barcode` — ya existe ✅ (en CardScreen)
- [ ] `TechLabel` — ya existe ✅
- [ ] `IconSet` — iconos SVG lineales propios
- [ ] `PixelFont` — fuente block para IDs

### Fase C — Documento oficial
- [ ] `ExpedienteScreen` — formulario denuncia
- [ ] `ExpedienteDocument` — vista del documento generado
- [ ] `exportToPDF` — usar `expo-print`
- [ ] Tabla de datos tabulados
- [ ] Sistema de sellos y clasificaciones

---

## 5. Referencias visuales

Ver carpetas en `docs/references/`:
- `fondos/` — carnets cayendo, HUD, noise, waveforms
- `documentos/` — expediente, CASE FILE, OMEGA, LA FACILITÉ
- `iconos/` — Onyx, cyberpunk, map icons
- `editorial/` — Begin Again, Lost in Starlight, NB ARCHITEKT
- `general/` — tipografía, posters, moodboard general

---

## 6. Roadmap de sesiones

1. **Sesión 1** — Fondos narrativos (CarnetTicketsBackground en Login)
2. **Sesión 2** — Sistema técnico (HUD, waveforms, iconos)
3. **Sesión 3** — Documento oficial / Expediente
4. **Sesión 4** — Refinamiento y aplicación a toda la app

---

## 7. Reglas de oro

1. **Menos es más**: 1 elemento narrativo por pantalla, no 5.
2. **Blanco y negro primero**, acento después.
3. **Tipografía monoespaciada** para todo lo "técnico".
4. **Nada de gradientes complejos**: alto contraste + grain.
5. **Documentos oficiales = sin radius**, UIs normales = con radius.
6. **El usuario es el soberano**: los QRs y el carnet siempre visibles.

---

_Última actualización: 2026-10-14_
