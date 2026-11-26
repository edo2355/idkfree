#!/bin/bash

REPORT="reporte_errores_global.txt"
echo "=== AUDITORÍA INTELIGENTE IDKFREE ===" > $REPORT
echo "Fecha: $(date)" >> $REPORT

check_ts() {
    local dir=$1
    local name=$2
    echo -e "\n--- REVISANDO $name ($dir) ---" >> $REPORT
    
    if [ -d "$dir" ]; then
        cd "$dir"
        if [ ! -d "node_modules" ]; then
            echo "⚠️ Saltando $name: No hay carpeta node_modules (falta npm install)." >> $REPORT
        elif [ ! -f "./node_modules/.bin/tsc" ]; then
            echo "⚠️ Saltando $name: TypeScript no está instalado localmente." >> $REPORT
        else
            echo "🔎 Ejecutando TypeScript..." >> $REPORT
            # timeout 45s evita que se quede colgado para siempre
            timeout 45s ./node_modules/.bin/tsc --noEmit >> $REPORT 2>&1
            local status=$?
            if [ $status -eq 0 ]; then
                echo "✅ $name: Sin errores de TypeScript." >> $REPORT
            elif [ $status -eq 124 ]; then
                echo "⏳ $name: La compilación tardó más de 45 segundos. Se omitió para no trabar la terminal." >> $REPORT
            else
                echo "❌ $name: Se encontraron errores (ver arriba)." >> $REPORT
            fi
        fi
        cd - > /dev/null
    else
        echo "⚠️ Carpeta $dir no encontrada." >> $REPORT
    fi
}

# 1. Revisar TypeScript en los 3 proyectos
check_ts "backend" "Backend"
check_ts "web" "Web"
check_ts "mobile" "Mobile"

# 2. Buscar errores de comillas dobles en SQL (solo en backend/src)
echo -e "\n\n--- REVISANDO ERRORES SQL (Comillas dobles) ---" >> $REPORT
grep -rn ' = "' backend/src/routes/ >> $REPORT 2>&1 || echo "✅ No se encontraron comillas dobles sospechosas en SQL." >> $REPORT

# 3. Verificar archivos sensibles (sin entrar a node_modules)
echo -e "\n\n--- VERIFICANDO ARCHIVOS SENSIBLES ---" >> $REPORT
find . -type f \( -name "*.keystore" -o -name "*.jks" -o -name "*.b64" \) -not -path "*/node_modules/*" >> $REPORT 2>&1

echo "========================================="
echo "✅ Auditoría terminada (Sin bloqueos)."
echo "Ejecuta: cat $REPORT"
echo "========================================="
