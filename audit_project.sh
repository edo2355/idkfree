#!/bin/bash
REPORT="$HOME/AUDIT_IDKFREE.txt"
echo "🔍 Generando auditoría completa en $REPORT..."

{
echo "=== 1. ESTRUCTURA PRINCIPAL (Carpetas de primer y segundo nivel) ==="
find . -maxdepth 2 -type d -not -path '*/.*' -not -path '*/node_modules*' | sort

echo -e "\n=== 2. ESTADO ACTUAL DE GIT ==="
git status

echo -e "\n=== 3. BACKEND: Dependencias Instaladas ==="
cat backend/package.json | grep -A 20 '"dependencies"'

echo -e "\n=== 4. BACKEND: Rutas Registradas en server.ts ==="
grep "app.register" backend/src/server.ts

echo -e "\n=== 5. BACKEND: Archivos en src/routes y src/services ==="
ls -la backend/src/routes/
ls -la backend/src/services/

echo -e "\n=== 6. BACKEND: Búsqueda de código basura (Resend, Mailtrap, Hardcodeos) ==="
grep -rn "resend\|mailtrap\|eduardorafaelamatevaldes" backend/src/ | grep -v "node_modules" || echo "Limpio."

echo -e "\n=== 7. FRONTEND WEB: Dependencias y Estructura ==="
cat web/package.json | grep -A 20 '"dependencies"'
find web/src -maxdepth 3 -type f | sort

echo -e "\n=== 8. FRONTEND WEB: Búsqueda de endpoints API ==="
grep -rn "fetch(\|axios\." web/src/ | head -n 30

echo -e "\n=== 9. MOBILE: Archivos de pantallas (Screens) ==="
ls -la mobile/src/screens/ 2>/dev/null || echo "No hay carpeta src/screens"

} > $REPORT 2>&1

echo "✅ Auditoría terminada. Mostrando las primeras 60 líneas:"
head -n 60 $REPORT
echo -e "\n👉 El reporte completo está en: $REPORT"
