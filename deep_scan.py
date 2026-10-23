import json, os, subprocess

def run_cmd(cmd):
    try:
        return subprocess.check_output(cmd, shell=True, stderr=subprocess.STDOUT, text=True).strip()
    except subprocess.CalledProcessError as e:
        return e.output.strip()

print("==================================================")
print("     ESCANEO PROFUNDO DEL PROYECTO (IDKFREE)      ")
print("==================================================")

print("\n[1] ¿ESTÁ node_modules SIENDO RASTREADO POR GIT? (CRÍTICO)")
nm_tracked = run_cmd("git ls-files mobile/node_modules | head -n 3")
if nm_tracked:
    print("❌ PELIGRO: node_modules está subido a GitHub. Esto rompe la nube.")
    print(f"   Archivos detectados: {nm_tracked}")
else:
    print("✅ BIEN: node_modules no está en Git.")

print("\n[2] LIBRERÍAS NATIVAS DETECTADAS (React Native)")
deps = run_cmd("cat mobile/package.json | python3 -c \"import sys, json; print(' '.join(json.load(sys.stdin).get('dependencies', {}).keys()))\"")
if deps:
    nativas = [d for d in deps.split() if 'react-native-' in d or 'expo-' in d or 'livekit' in d]
    print(f"Librerías: {', '.join(nativas)}")
else:
    print("No se pudo leer mobile/package.json")

print("\n[3] CONFIGURACIÓN DE ANDROID (Versiones de SDK)")
run_cmd("grep -E 'compileSdkVersion|targetSdkVersion|minSdkVersion' mobile/android/build.gradle || true")
run_cmd("grep -E 'compileSdkVersion|targetSdkVersion|minSdkVersion' mobile/android/app/build.gradle || true")

print("\n[4] ARQUITECTURAS DE COMPILACIÓN (¿Qué está intentando compilar?)")
archs = run_cmd("grep -E 'reactNativeArchitectures' mobile/android/gradle.properties")
print(archs if archs else "No se encontró restricción de arquitecturas (compilará todas por defecto).")

print("\n[5] VERIFICACIÓN DE .GITIGNORE (¿Está protegiendo lo importante?)")
gitignore = run_cmd("cat .gitignore")
if "node_modules" in gitignore:
    print("✅ node_modules está en .gitignore.")
else:
    print("⚠️ node_modules NO está en .gitignore.")

print("\n[6] FIRMA DE LA APK (¿Cómo se va a firmar en GitHub?)")
signing = run_cmd("grep -E 'signingConfigs|storeFile|keyAlias' mobile/android/app/build.gradle || true")
if "debug" in signing or "release" in signing:
    print("Se encontró configuración de firma. (Revisar en el archivo si usa variables de entorno).")
else:
    print("⚠️ No se encontró configuración de firma explícita en build.gradle.")

print("==================================================")
print("                  FIN DEL ESCANEO                 ")
print("==================================================")
