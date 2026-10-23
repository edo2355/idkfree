import os
import json

def scan_dir(path, depth=0, max_depth=2):
    if depth > max_depth:
        return
    try:
        items = sorted(os.listdir(path))
    except PermissionError:
        return
    
    ignore = {'.git', 'node_modules', 'build', 'dist', '.expo', '.gradle', 'ios', '__pycache__', '.venv'}
    
    for item in items:
        if item in ignore: continue
        full_path = os.path.join(path, item)
        indent = "  " * depth
        if os.path.isdir(full_path):
            print(f"{indent}📁 {item}/")
            if depth < max_depth:
                scan_dir(full_path, depth + 1, max_depth)

def print_pkg(path):
    pkg_path = os.path.join(path, 'package.json')
    if os.path.exists(pkg_path):
        try:
            with open(pkg_path, 'r') as f:
                data = json.load(f)
                print(f"\n[📦 package.json en {path}]")
                print(f"  Name: {data.get('name')}")
                if 'scripts' in data:
                    print(f"  Scripts: {', '.join(data['scripts'].keys())}")
                deps = data.get('dependencies', {})
                print(f"  Dependencias clave:")
                for k, v in deps.items():
                    if 'lucide' in k or 'livekit' in k or 'expo' in k or 'react' in k or 'fastify' in k:
                        print(f"    - {k}: {v}")
        except Exception as e:
            print(f"Error leyendo {pkg_path}: {e}")

print("==================================================")
print("    RADIOGRAFÍA ESTRUCTURAL DEL MONOREPO IDKFREE  ")
print("==================================================")

print("\n🌳 [ESTRUCTURA DE CARPETAS (Nivel 1 y 2)]")
scan_dir('.', max_depth=1)

print("\n==================================================")
print("    CONFIGURACIONES DE PAQUETES (Dependencias)    ")
print("==================================================")
folders = ['', 'mobile', 'web', 'backend', 'auth-backend', 'cpanel-backend', 'shared']
for folder in folders:
    if os.path.exists(folder):
        print_pkg(folder)

print("\n==================================================")
print("    FIN DEL ESCANEO                               ")
print("==================================================")
