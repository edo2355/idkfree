#!/bin/bash

REPORT="reporte_errores_global.txt"
echo "=== AUDITORÍA GLOBAL DE CÓDIGO IDKFREE ===" > $REPORT
echo "Fecha: $(date)" >> $REPORT

check_ts() {
    local dir=$1
    local name=$2
    echo -e "\n\n--- REVISANDO $name ($dir) ---" >> $REPORT
    if [ -d "$dir" ]; then
        cd "$dir"
        if [ -f "package.json" ]; then
            echo "Ejecutando tsc --noEmit en $name..." >> $REPORT
            # Ejecutamos tsc y capturamos la salida
            npx tsc --noEmit >> $REPORT 2>&1
            if [ $? -eq 0 ]; then
                echo "✅ $name: Sin errores de TypeScript." >> $REPORT
            else
                echo "❌ $name: Errores encontrados (ver líneas de arriba)." >> $REPORT
            fi
        else
            echo "⚠️ $name: No se encontró package.json." >> $REPORT
        fi
        cd - > /dev/null
    else
        echo "⚠️ $name: Carpeta no encontrada." >> $REPORT
    fi
}

# 1. Revisar los 3 proyectos principales
check_ts "backend" "Backend (Fastify)"
check_ts "web" "Web (Vite/React)"
check_ts "mobile" "Mobile (Expo/React Native)"

# 2. Buscar errores de comillas dobles en SQL (como el que arreglamos)
echo -e "\n\n--- REVISANDO ERRORES SQL (Comillas dobles en Backend) ---" >> $REPORT
grep -rn 'status = "' backend/src/routes/ >> $REPORT 2>&1 && echo "⚠️ Se encontraron más comillas dobles sospechosas." >> $REPORT || echo "✅ No se encontraron errores de comillas dobles en SQL." >> $REPORT

# 3. Verificar que no haya archivos sensibles (Keystores) en el repo
echo -e "\n\n--- VERIFICANDO ARCHIVOS SENSIBLES ---" >> $REPORT
find . -name "*.keystore" -o -name "*.jks" -o -name "*.b64" | grep -v "node_modules" >> $REPORT 2>&1

echo "========================================="
echo "✅ Auditoría completada."
echo "El reporte se guardó en: $REPORT"
echo "Ejecuta: cat $REPORT"
echo "========================================="
