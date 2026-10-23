import os
import subprocess

directories = ['backend', 'auth-backend', 'cpanel-backend', 'shared', 'mobile', 'web', 'cpanel']

print("==================================================")
print("    AUDITORÍA ESTÁTICA COMPLETA DEL MONOREPO      ")
print("==================================================")

# 1. VERIFICAR ERRORES DE TYPESCRIPT EN CADA PROYECTO
for d in directories:
    if os.path.exists(d):
        print(f"\n🔍 [TypeScript] Revisando {d}/...")
        pkg_json = os.path.join(d, 'package.json')
        if os.path.exists(pkg_json):
            # Verificar si tsc está en las dependencias
            with open(pkg_json) as f:
                if 'typescript' in f.read() or d in ['backend', 'auth-backend', 'cpanel-backend']:
                    try:
                        # Ejecutar tsc silenciosamente
                        result = subprocess.run(['npx', 'tsc', '--noEmit'], cwd=d, capture_output=True, text=True, timeout=60)
                        if result.returncode == 0:
                            print(f"  ✅ {d}: Sin errores de tipado.")
                        else:
                            print(f"  ❌ {d}: Errores encontrados:")
                            # Mostrar solo las primeras 5 líneas de error para no saturar
                            lines = result.stdout.strip().split('\n') + result.stderr.strip().split('\n')
                            for line in lines[:5]:
                                if line.strip(): print(f"     - {line}")
                            if len(lines) > 5: print(f"     ... y {len(lines)-5} errores más.")
                    except subprocess.TimeoutExpired:
                        print(f"  ⚠️ {d}: Timeout revisando TypeScript.")
                    except Exception as e:
                        print(f"  ⚠️ {d}: No se pudo ejecutar tsc ({e}).")
        else:
            print(f"  ⚠️ {d}: No tiene package.json.")

# 2. AUDITORÍA DE IMPORTS ROTOS (Archivos que no existen)
print("\n==================================================")
print("    BUSCANDO IMPORTS ROTOS (Archivos fantasma)    ")
print("==================================================")
broken_imports = 0

for d in directories:
    if not os.path.exists(d): continue
    for root, dirs, files in os.walk(d):
        dirs[:] = [x for x in dirs if x not in ['node_modules', 'dist', 'build', '.expo', 'android', 'ios']]
        for file in files:
            if file.endswith(('.ts', '.tsx')):
                filepath = os.path.join(root, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                        import re
                        # Buscar imports relativos (ej. from './mi-archivo')
                        imports = re.findall(r"from\s+['\"](\.[^'\"]+)['\"]", content)
                        for imp in imports:
                            # Resolver la ruta
                            target_base = os.path.normpath(os.path.join(os.path.dirname(filepath), imp))
                            # Verificar si existe con las extensiones comunes
                            exists = False
                            for ext in ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx']:
                                if os.path.exists(target_base + ext):
                                    exists = True
                                    break
                            if not exists:
                                print(f"  ⚠️ {filepath}: Import roto -> {imp}")
                                broken_imports += 1
                except Exception:
                    pass

if broken_imports == 0:
    print("  ✅ No se encontraron imports rotos (relativos).")
else:
    print(f"\n  ❌ Se encontraron {broken_imports} imports rotos en total.")

# 3. ESTRUCTURA DE LOS BACKENDS
print("\n==================================================")
print("    AUDITORÍA DE ESTRUCTURA DE BACKENDS           ")
print("==================================================")
for b in ['backend', 'auth-backend', 'cpanel-backend']:
    if os.path.exists(b):
        print(f"\n📦 {b}/src/")
        src_dir = os.path.join(b, 'src')
        if os.path.exists(src_dir):
            for item in os.listdir(src_dir):
                if os.path.isdir(os.path.join(src_dir, item)):
                    # Contar archivos dentro de la carpeta
                    count = sum(len(files) for _, _, files in os.walk(os.path.join(src_dir, item)))
                    print(f"  📁 {item}/ ({count} archivos)")
                else:
                    print(f"  📄 {item}")

print("\n==================================================")
print("                  FIN DE LA AUDITORÍA             ")
print("==================================================")
