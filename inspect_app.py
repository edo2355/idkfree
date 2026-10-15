import os
import json
import glob

BASE_DIR = os.path.expanduser('~/idkfree')

def get_tree(startpath):
    tree = []
    for root, dirs, files in os.walk(startpath):
        if 'node_modules' in dirs: dirs.remove('node_modules')
        if '.git' in dirs: dirs.remove('.git')
        if '.expo' in dirs: dirs.remove('.expo')
        if 'dist' in dirs: dirs.remove('dist')
        
        rel_root = os.path.relpath(root, startpath)
        level = rel_root.count(os.sep) if rel_root != '.' else 0
        indent = '  ' * level
        folder_name = os.path.basename(root) if rel_root != '.' else os.path.basename(startpath)
        tree.append(f"{indent}📁 {folder_name}/")
        
        subindent = '  ' * (level + 1)
        for f in sorted(files):
            if not f.endswith(('.png', '.jpg', '.jpeg', '.db', '.sqlite', '.log')):
                tree.append(f"{subindent}📄 {f}")
    return "\n".join(tree)

def inspect_file(path):
    if os.path.exists(path):
        try:
            with open(path, 'r', encoding='utf-8') as f:
                return f.read()
        except Exception as e:
            return f"Error leyendo {path}: {e}"
    return "Archivo no encontrado"

print("============================================================")
print("🔍 AUDITORÍA DE ESTADO GENERAL — IDKFREE")
print("============================================================")

print("\n--- 1. ÁRBOL DE PROYECTO (MOBILE) ---")
print(get_tree(os.path.join(BASE_DIR, 'mobile/src')))

print("\n--- 2. ÁRBOL DE PROYECTO (BACKEND) ---")
print(get_tree(os.path.join(BASE_DIR, 'backend/src')))

print("\n--- 3. PANTALLAS PRINCIPALES DETECTADAS (MOBILE) ---")
screens = glob.glob(os.path.join(BASE_DIR, 'mobile/src/screens/*.tsx'))
for screen in sorted(screens):
    print(f"  • {os.path.basename(screen)}")

print("\n--- 4. COMPONENTES REUTILIZABLES (MOBILE) ---")
components = glob.glob(os.path.join(BASE_DIR, 'mobile/src/components/*.tsx'))
for comp in sorted(components):
    print(f"  • {os.path.basename(comp)}")

print("\n--- 5. CONFIGURACIÓN DE TEMA Y TOKENS ---")
theme_files = glob.glob(os.path.join(BASE_DIR, 'mobile/src/theme/**/*'), recursive=True)
for tf in theme_files:
    if os.path.isfile(tf):
        print(f"\n--- [ {os.path.relpath(tf, BASE_DIR)} ] ---")
        print(inspect_file(tf)[:1000])

print("\n--- 6. MIGRACIONES DB (BACKEND) ---")
migrations = glob.glob(os.path.join(BASE_DIR, 'backend/src/db/migrations/*.sql'))
for m in sorted(migrations):
    print(f"\n--- [ {os.path.basename(m)} ] ---")
    print(inspect_file(m))

print("\n============================================================")
print("✅ INSPECCIÓN COMPLETADA")
print("============================================================")
