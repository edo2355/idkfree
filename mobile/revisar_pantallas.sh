#!/bin/bash

REPORT="reporte_pantallas.txt"
echo "=== INVENTARIO DE PANTALLAS IDKMEDIA ===" > $REPORT
echo "Fecha: $(date)" >> $REPORT

# Buscar todos los archivos .tsx en src/screens
for file in src/screens/*.tsx; do
  if [ -f "$file" ]; then
    echo -e "\n\n=====================================================" >> $REPORT
    echo "📁 PANTALLA: $file" >> $REPORT
    echo "=====================================================" >> $REPORT
    cat "$file" >> $REPORT
  fi
done

echo "========================================="
echo "✅ Inventario completado."
echo "Archivo generado: $REPORT"
echo "Ejecuta: cat $REPORT"
echo "========================================="
