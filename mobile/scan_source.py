import os

def extract_code(directory, extensions):
    ignore_dirs = {'node_modules', 'android', 'ios', 'assets', '.expo', 'build', 'dist', '__tests__'}
    for root, dirs, files in os.walk(directory):
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        for file in files:
            if any(file.endswith(ext) for ext in extensions):
                filepath = os.path.join(root, file)
                # Evitar imprimir archivos gigantes (como package-lock)
                if os.path.getsize(filepath) > 150000: continue
                
                print(f"\n{'='*50}\n📄 ARCHIVO: {filepath}\n{'='*50}")
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                        # Si el archivo es muy largo, mostramos solo las primeras 80 líneas
                        lines = content.splitlines()
                        if len(lines) > 80:
                            print('\n'.join(lines[:80]))
                            print(f"\n... [TRUNCADO: {len(lines)-80} líneas más] ...")
                        else:
                            print(content)
                except Exception as e:
                    print(f"Error leyendo {filepath}: {e}")

print("🔍 ESCANEANDO CÓDIGO FUENTE DE LA APP MÓVIL (mobile/src, App.tsx, config)...")
print("Esto puede tomar unos segundos...")

# Escanear los archivos principales de la app móvil
extract_code('mobile/src', ['.ts', '.tsx', '.js', '.jsx'])

print(f"\n{'='*50}\n📄 ARCHIVOS RAÍZ Y CONFIGURACIONES\n{'='*50}")
root_files = [
    'mobile/App.tsx', 
    'mobile/index.ts', 
    'mobile/app.json', 
    'mobile/babel.config.js', 
    'mobile/metro.config.js',
    'mobile/package.json'
]

for rf in root_files:
    if os.path.exists(rf):
        print(f"\n{'='*50}\n📄 ARCHIVO: {rf}\n{'='*50}")
        with open(rf, 'r', encoding='utf-8') as f:
            content = f.read()
            lines = content.splitlines()
            if len(lines) > 80:
                print('\n'.join(lines[:80]))
                print(f"\n... [TRUNCADO: {len(lines)-80} líneas más] ...")
            else:
                print(content)

print("\n✅ FIN DEL ESCANEO DE CÓDIGO.")
