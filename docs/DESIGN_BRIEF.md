# 🎨 IDKFREE — Brief de Diseño
**Versión:** 1.0 · **Última actualización:** 2026-10-09

## 📖 Contexto
IDKFREE es una red social sin presión. El diseño debe sentirse:
- Editorial (no ruidosa, no saturada)
- Premium (no genérica)
- Atemporal (no trends pasajeros)
- Táctico / sci-fi en elementos de identidad (carnet, grid, blueprint)

## 🎯 SISTEMA DE MARCA

### Logo
- IDK: serif italic (Playfair Display Bold Italic)
- FREE: geométrico extendido (Eurostile / Monument Extended)
- Elemento orbital: elipse fina + estrella de 4 puntas
- Variantes: blanco sobre negro, negro sobre blanco, monograma IF, símbolo "?"

### Paleta
- Base: negro #050505 / blanco #FFFFFF
- Grises: #A3A3A3, #5F5F5F, #262626
- Acento default: purple #A855F7
- Acento secundario: cyan #22D3EE
- 10 acentos curados: blanco, negro, rojo, azul, verde, dorado, violeta, coral, menta, mostaza

### Tipografía
- Títulos: Playfair Display (Bold Italic para hero, Regular para secciones)
- UI/body: Space Grotesk (Regular 400, Medium 500, Bold 700)
- Mono (ID, PINs, aliases): JetBrains Mono o similar
- Firma Edo Amate: Dark Future Italic (edo) + Voga Medium (AMATE)

### Slogan
- Eslogan: "No lo sé, gratis o libre"
- Claim: "More than a question"

---

## 🔄 VERSIÓN 3 — Carnet (v3, 2026-10-09)

Layout vertical con bloque de identidad completo.

### Estructura (top a bottom)
1. Barra estado: `[●] IDKFREE   [SYS.OK]`
2. Marco táctico con foto
3. Nombre completo (Playfair bold)
4. Alias con @ (mono)
5. Card ID hex (mono, gris #666)
6. Divisor
7. Tres bloques QR: PANICO, RESTABLECER, FENIX
   - Marco de escaneo
   - Numerados [01] [02] [03]
   - PIN en mono con flecha
8. Timestamp + ACTIVE
9. Firma: "MAS QUE UNA PREGUNTA"

### Bloque foto
- Marco táctico con esquinas tipo mira
- Indicador ● en esquina sup-der (tipo REC)
- Separacion interna 2px
- B/N o color segun preferencia

### Bloque identidad
- Nombre: Playfair Display, tracking ancho, max 2 lineas
- Alias: mono con @, blanco puro
- ID: mono, gris #666, formato IDK-XXXX-XXXX

### Privacidad
- Foto opcional (marco vacio con [?])
- Alias obligatorio
- ID generado por sistema

---

## ENDPOINTS BACKEND

`GET /api/me/card` debe devolver:
- cardId, cardIdShort (IDK-XXXX-XXXX), createdAt
- ownerId, alias, name, avatar_url
- qrPayloads: panic, restore, fenix
- pins enmascarados (solo en register van completos)

---

## ESTADO DE IMPLEMENTACION

### Backend
- ✅ Register con 6 PINs
- ✅ 3 QRs distintos
- ✅ /me/card basico
- Pendiente: cardIdShort

### Mobile
- ✅ CardModalScreen (3 QRs + 3 PINs)
- Pendiente: CardScreen con layout v3

### Iconografia
- Pendiente: icono Chats
- Pendiente: icono Create (+)

---

Fin del brief.
