#!/bin/bash

echo "🕵️‍♂️ 1. VERIFICANDO ARCHIVOS NUEVOS..."
if [ -f "src/components/ui/GlassCard.tsx" ]; then
    echo "✅ GlassCard.tsx existe."
else
    echo "❌ ALERTA: GlassCard.tsx NO existe. Revisa la ruta."
fi

echo -e "\n🔍 2. REVISANDO ERRORES DE TYPESCRIPT..."
# Esto revisará que los nuevos iconos y propiedades estén bien tipados
npx tsc --noEmit

echo -e "\n📦 3. SIMULANDO EL BUNDLE DE METRO (Modo Termux)..."
# AÑADIMOS --no-bytecode para evitar el falso error de Hermes en Termux
npx expo export --platform android --output-dir dist-test --no-bytecode
STATUS=$?

echo "========================================="
if [ $STATUS -eq 0 ]; then
  echo "✅ ¡TODO COMPILÓ SIN ERRORES! La UI está lista."
  # Limpiamos la carpeta de prueba para no ensuciar el repo
  rm -rf dist-test
  echo "🧹 Carpeta dist-test eliminada."
else
  echo "❌ METRO FALLÓ. Lee los errores de arriba (en rojo o amarillo) para ver qué archivo está roto."
fi
echo "========================================="
