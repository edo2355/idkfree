import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Importación de Pantallas
import { FeedScreen } from '../screens/FeedScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { CreateScreen } from '../screens/CreateScreen';
import { ReelsScreen } from '../screens/ReelsScreen';

const Tab = createBottomTabNavigator();

export function AppTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          backgroundColor: 'rgba(10, 10, 10, 0.95)', // Fondo oscuro sólido
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.15)', // Línea fina superior
          elevation: 0,
        },
        tabBarActiveTintColor: '#000000', // Texto negro en la pestaña activa
        tabBarInactiveTintColor: 'rgba(255,255,255,0.5)', // Texto gris en las inactivas
        tabBarActiveBackgroundColor: '#ffffff', // Bloque blanco sólido
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: 'monospace', // Tipografía táctica
          fontSize: 11,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          fontWeight: 'bold',
          marginBottom: 15, // Centrar el texto verticalmente
        },
        tabBarIcon: () => null, // ELIMINADOS LOS ICONOS
      }}
    >
      <Tab.Screen name="FEED" component={FeedScreen} />
      <Tab.Screen name="SEARCH" component={SearchScreen} />
      <Tab.Screen name="CREATE" component={CreateScreen} />
      <Tab.Screen name="REELS" component={ReelsScreen} />
      <Tab.Screen name="PROFILE" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
