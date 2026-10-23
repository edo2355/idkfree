import os
import json

def scan_structure(path, max_depth=2, depth=0):
    if depth > max_depth: return
    ignore = {'node_modules', 'build', 'dist', '.expo', '.gradle', 'ios', '.git', '__pycache__'}
    try:
        items = sorted(os.listdir(path))
    except: return
    
    for item in items:
        if item in ignore: continue
        full = os.path.join(path, item)
        indent = "  " * depth
        if os.path.isdir(full):
            print(f"{indent}📁 {item}/")
            scan_structure(full, max_depth, depth + 1)
        else:
            if item.endswith(('.ts', '.tsx', '.js', '.json', '.sql')) and not item.endswith('package-lock.json'):
                print(f"{indent}📄 {item}")

def find_payments(path):
    keywords = ['stripe', 'mercadopago', 'paypal', 'qvapay', 'payment', 'checkout', 'webhook', 'transaction', 'Pago', 'Verificacion', 'verify']
    found = []
    ignore = {'node_modules', 'build', 'dist', '.expo', '.gradle', 'ios', '.git'}
    
    for root, dirs, files in os.walk(path):
        dirs[:] = [d for d in dirs if d not in ignore]
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js')):
                fp = os.path.join(root, file)
                try:
                    with open(fp, 'r', encoding='utf-8') as f:
                        content = f.read().lower()
                        for kw in keywords:
                            if kw in content:
                                found.append((fp, kw))
                                break
                except: pass
    return found

def print_pkg(path):
    pkg_path = os.path.join(path, 'package.json')
    if os.path.exists(pkg_path):
        try:
            with open(pkg_path, 'r') as f:
                data = json.load(f)
                print(f"\n[📦 {path}/package.json]")
                print(f"  Name: {data.get('name')}")
                print(f"  Scripts: {', '.join(data.get('scripts', {}).keys())}")
                deps = data.get('dependencies', {})
                print("  Dependencias clave:")
                for k, v in deps.items():
                    if any(x in k for x in ['stripe', 'payment', 'mercadopago', 'fastify', 'expo', 'react-native', 'auth', 'jwt']):
                        print(f"    - {k}: {v}")
        except: pass

targets = ['cpanel', 'idkfree-auth', 'auth-backend', 'cpanel-backend']

print("==================================================")
print("    ESCANEO: CPANEL Y APP DE VERIFICACIÓN         ")
print("==================================================")

for t in targets:
    if os.path.exists(t):
        print(f"\n🌳 ESTRUCTURA DE: {t}/")
        scan_structure(t, max_depth=1)

print("\n==================================================")
print("    CONFIGURACIÓN DE PAQUETES (Dependencias)       ")
print("==================================================")
for t in targets:
    print_pkg(t)

print("\n==================================================")
print("    BÚSQUEDA DE LÓGICA DE PAGOS Y VERIFICACIÓN    ")
print("==================================================")
for t in targets:
    if os.path.exists(t):
        results = find_payments(t)
        if results:
            print(f"\n🔍 Archivos con lógica de pagos/auth en {t}/:")
            for fp, kw in results[:15]: # Mostramos max 15 para no saturar
                print(f"  - {fp} (contiene: '{kw}')")
            if len(results) > 15:
                print(f"  ... y {len(results)-15} archivos más.")
        else:
            print(f"\n⚠️ No se encontraron palabras clave de pagos o verificación en {t}/")

print("\n✅ FIN DEL ESCANEO.")
