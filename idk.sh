#!/bin/bash

echo "====================================="
echo "   🚀 IDKMEDIA DEV LAUNCHER"
echo "====================================="
echo "1) Iniciar Backend (Fastify + Turso)"
echo "2) Iniciar Web (Vite + React)"
echo "3) Iniciar Mobile (Expo + React Native)"
echo "4) Salir"
echo "====================================="
read -p "Selecciona una opción [1-4]: " option

case $option in
    1)
        echo "▶️ Iniciando Backend..."
        cd backend && npm run dev
        ;;
    2)
        echo "▶️ Iniciando Web..."
        cd web && npm run dev
        ;;
    3)
        echo "▶️ Iniciando Mobile..."
        cd mobile && npx expo start -c
        ;;
    4)
        echo "👋 ¡Hasta luego!"
        exit 0
        ;;
    *)
        echo "❌ Opción inválida."
        exit 1
        ;;
esac
