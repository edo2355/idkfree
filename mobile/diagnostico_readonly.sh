#!/bin/bash

REPORT="reporte_codigo.txt"
echo "=== REPORTE DE DIAGNÓSTICO (SOLO LECTURA) ===" > $REPORT

echo -e "\n\n--- 1. DEPENDENCIAS (package.json) ---" >> $REPORT
cat package.json >> $REPORT 2>/dev/null || echo "No encontrado" >> $REPORT

echo -e "\n\n--- 2. CONFIGURACIÓN DE METRO (metro.config.js) ---" >> $REPORT
cat metro.config.js >> $REPORT 2>/dev/null || echo "No encontrado" >> $REPORT

echo -e "\n\n--- 3. CONFIGURACIÓN DE BABEL (babel.config.js) ---" >> $REPORT
cat babel.config.js >> $REPORT 2>/dev/null || echo "No encontrado" >> $REPORT

echo -e "\n\n--- 4. CONFIGURACIÓN DE EXPO (app.json o app.config.js) ---" >> $REPORT
cat app.json >> $REPORT 2>/dev/null
cat app.config.js >> $REPORT 2>/dev/null
echo "" >> $REPORT

echo -e "\n\n--- 5. CÓDIGO OFFLINEDB.TS ---" >> $REPORT
cat src/services/offlineDb.ts >> $REPORT 2>/dev/null || echo "No encontrado" >> $REPORT

echo -e "\n\n--- 6. PANTALLA OFFLINEVENUESCREEN.TSX ---" >> $REPORT
cat src/screens/OfflineVenueScreen.tsx >> $REPORT 2>/dev/null || echo "No encontrado" >> $REPORT

echo -e "\n\n--- 7. SCRIPT BYPASS_LIVEKIT.PY ---" >> $REPORT
cat bypass_livekit.py >> $REPORT 2>/dev/null || echo "No encontrado" >> $REPORT

echo -e "\n\n--- 8. WORKFLOW GITHUB ACTIONS (build-apk.yml) ---" >> $REPORT
cat .github/workflows/build-apk.yml >> $REPORT 2>/dev/null || echo "No encontrado" >> $REPORT

echo "========================================="
echo "✅ Diagnóstico terminado. Nada fue instalado ni modificado."
echo "Abre el archivo con: cat $REPORT"
echo "========================================="
