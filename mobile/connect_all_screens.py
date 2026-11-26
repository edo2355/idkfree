import os, re, glob

screens_dir = 'src/screens'
imports = []
routes = []

# Escanear todas las pantallas
for filepath in sorted(glob.glob(f'{screens_dir}/*.tsx')):
    filename = os.path.basename(filepath)
    comp_name = filename[:-4]
    route_name = comp_name.replace('Screen', '')
    
    # Evitar conflictos con el Home que creamos interno
    if route_name in ['Home', 'App']: continue

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read(3000)
        
        # Buscar export default
        match = re.search(r'export\s+default\s+function\s+([A-Za-z0-9_]+)', content)
        if not match:
            match = re.search(r'export\s+default\s+([A-Za-z0-9_]+)', content)
        
        if match:
            real_comp = match.group(1)
            imports.append(f"import {real_comp} from './src/screens/{filename[:-4]}';")
            routes.append((real_comp, route_name))
            continue
            
        # Buscar export function/const
        match = re.search(r'export\s+(?:function|const)\s+([A-Za-z0-9_]+)', content)
        if match:
            real_comp = match.group(1)
            imports.append(f"import {{ {real_comp} }} from './src/screens/{filename[:-4]}';")
            routes.append((real_comp, route_name))
            continue
        
        # Fallback (por si acaso)
        imports.append(f"import {{ {comp_name} }} from './src/screens/{filename[:-4]}';")
        routes.append((comp_name, route_name))

# Generar el archivo App.tsx
with open('App.tsx', 'w', encoding='utf-8') as f:
    f.write("import React from 'react';\n")
    f.write("import { NavigationContainer, DefaultTheme } from '@react-navigation/native';\n")
    f.write("import { createNativeStackNavigator } from '@react-navigation/native-stack';\n")
    f.write("import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';\n")
    f.write("import { BlurView } from 'expo-blur';\n")
    f.write("import { StatusBar } from 'expo-status-bar';\n")
    f.write("import { Building2, ScanLine, Wallet, User, Settings, MessageSquare } from 'lucide-react-native';\n\n")

    for imp in imports:
        f.write(imp + "\n")
    
    f.write("\nconst Stack = createNativeStackNavigator();\n\n")
    f.write("""const DarkTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#050505', card: '#0a0a0a', text: '#ffffff', primary: '#00E5FF', border: '#222222' },
};

const GlassHeader = ({ title }: { title: string }) => (
  <BlurView intensity={80} tint="dark" style={styles.headerContainer}>
    <Text style={styles.headerTitle}>{title}</Text>
  </BlurView>
);

function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>IDKMEDIA APP</Text>
      <Text style={styles.subtitle}>Navegación Completa</Text>
      
      <ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingBottom: 20 }}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Feed')}>
          <MessageSquare size={20} color="#00E5FF" style={styles.icon} />
          <Text style={styles.buttonText}>Feed Social</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Wallet')}>
          <Wallet size={20} color="#00E5FF" style={styles.icon} />
          <Text style={styles.buttonText}>Billetera</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
          <User size={20} color="#00E5FF" style={styles.icon} />
          <Text style={styles.buttonText}>Mi Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
          <Settings size={20} color="#00E5FF" style={styles.icon} />
          <Text style={styles.buttonText}>Ajustes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('OfflineVenue')}>
          <Building2 size={20} color="#00E5FF" style={styles.icon} />
          <Text style={styles.buttonText}>Recintos Offline</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Scanner')}>
          <ScanLine size={20} color="#00E5FF" style={styles.icon} />
          <Text style={styles.buttonText}>Escanear QR</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer theme={DarkTheme}>
      <StatusBar style="light" />
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{ 
          headerTransparent: true, 
          header: ({ options }) => <GlassHeader title={options.title || ''} />, 
          animation: 'slide_from_right' 
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio', headerShown: false }} />
""")
    
    # Rutas fijas principales
    f.write('        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />\n')
    f.write('        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />\n')
    f.write('        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />\n')

    # Todas las demás rutas
    for comp, route in routes:
        if route in ['Login', 'Register', 'Splash']: continue
        f.write(f'        <Stack.Screen name="{route}" component={{{comp}}} options={{{{ title: \'{route}\' }}}} />\n')

    f.write("""      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { color: '#00E5FF', fontSize: 32, fontWeight: '900', marginBottom: 5, letterSpacing: 1 },
  subtitle: { color: '#888', fontSize: 16, marginBottom: 20, fontWeight: '500' },
  button: { backgroundColor: '#111', padding: 16, borderRadius: 16, width: '100%', marginBottom: 12, borderWidth: 1, borderColor: '#222', flexDirection: 'row', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600', flex: 1, textAlign: 'center' },
  icon: { position: 'absolute', left: 16 },
  headerContainer: { height: Platform.OS === 'ios' ? 100 : 70, paddingTop: Platform.OS === 'ios' ? 50 : 20, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600', marginTop: Platform.OS === 'ios' ? 0 : 10 }
});
""")
print(f"✅ App.tsx generado con {len(routes)} pantallas conectadas exitosamente.")
