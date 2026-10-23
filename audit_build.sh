#!/bin/bash
echo "=================================================="
echo "       AUDITORÍA DE CONSTRUCCIÓN DE LA APK        "
echo "=================================================="

echo -e "\n[1] ÚLTIMOS COMMITS Y ESTADO DE GIT (¿Se subió el archivo?)"
git log -2 --oneline
git status -s

echo -e "\n[2] CONTENIDO DEL WORKFLOW DE GITHUB ACTIONS"
if [ -f .github/workflows/build-apk.yml ]; then
    cat .github/workflows/build-apk.yml
else
    echo "❌ ERROR: No existe .github/workflows/build-apk.yml en la raíz."
fi

echo -e "\n[3] ESTRUCTURA BÁSICA DE CARPETAS"
ls -d */ 2>/dev/null
echo "Contenido de la carpeta mobile (si existe):"
ls -d mobile/*/ 2>/dev/null

echo -e "\n[4] CONFIGURACIÓN DE EXPO (app.json)"
if [ -f mobile/app.json ]; then
    head -n 20 mobile/app.json
else
    echo "❌ No se encontró mobile/app.json"
fi

echo -e "\n[5] CONFIGURACIÓN DE LA APP ANDROID (build.gradle)"
if [ -f mobile/android/app/build.gradle ]; then
    grep -E "applicationId|versionCode|versionName" mobile/android/app/build.gradle
else
    echo "❌ No se encontró mobile/android/app/build.gradle"
fi

echo -e "\n[6] ARCHIVO GRADLE WRAPPER (Permisos)"
ls -lh mobile/android/gradlew 2>/dev/null || echo "❌ No se encontró mobile/android/gradlew"

echo "=================================================="
echo "                  FIN DE AUDITORÍA                "
echo "=================================================="
