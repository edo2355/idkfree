# Estado Legal — Nexo / IDKFREE
Fecha: 2026-10-30

## Documentos existentes
- mobile/src/screens/TermsScreen.tsx (v2.0.0, 2026-10-14, 54 líneas)
- mobile/src/screens/PrivacyScreen.tsx (v2.0.0, 2026-10-14, 62 líneas)
- mobile/src/components/LegalScreen.tsx (componente compartido, 85 líneas)

## Gaps detectados (12)
Críticos (rediseño completo):
1. Definir Nexo como marketplace, no red social
2. Cláusula de intermediario (Nexo conecta, no vende)
3. Wallet/diáspora (custodia, límites, comisiones)
4. Jurisdicción (tribunal, país, ley aplicable)
5. Compliance OFAC (derecho a rechazar operaciones)

Altos:
6. Cards como producto
7. Suppliers (verificación, disputas)
8. Live commerce

Medios:
9. Menores de edad
10. Ley 149 Cuba (ARCO completo)

Bajos:
11. Escrow
12. Cambios de ToS

## Falta cobertura en web
Los T&C solo existen en mobile. Los usuarios de
https://idkfreegetid.dpdns.org NO tienen cobertura legal visible.

## Plan próxima sesión
1. Leer los 3 archivos completos (20 min)
2. Decidir opción: rewrite / adaptar / críticos (15 min)
3. Redactar gaps críticos (1h)
4. Migrar a shared/legal/terms.md + privacy.md (45 min)
5. Web importa desde shared/legal/ (15 min)

## Después
- Abogado (Miami, enfoque Cuba): revisar borrador ($200-500)
- Registrar bases de datos (Ley 149)
- Publicar con consentimiento de cookies

## Marco legal referencia
- Cuba: BCC Res. 4/2026 (cripto), MINCEX 133/2026 (import), Aduana 30%, Ley 149 (datos)
- EE.UU.: OFAC GL 4 (remesas), U-turn prohibido (30-sep-2026), Lista Restringida
- Modelo recomendado: AGREGADOR (no PSAV) — conectar a QvaPay/TropiPay
