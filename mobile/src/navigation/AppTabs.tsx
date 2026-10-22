import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Home, Search, PlusSquare, Clapperboard, User } from 'lucide-react-native';
import { useTheme } from '../stores/themeStore';
import { useAuthStore } from '../stores/authStore';
import { Avatar } from '../components/Avatar';

// Importación de Pantallas
import { FeedScreen } from '../screens/FeedScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { CreateScreen } from '../screens/CreateScreen';
import { ReelsScreen } from '../screens/ReelsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { CardScreen } from '../screens/CardScreen';

const Tab = createBottomTabNavigator();

export function AppTabs() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          height: 60,
          borderRadius: 20,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.1)',
        },
        tabBarBackground: () => (
          <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
        ),
        tabBarActiveTintColor: '#00E5FF', // Azul neón
        tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{ tabBarIcon: ({ color }) => <Home size={24} color={color} /> }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ tabBarIcon: ({ color }) => <Search size={24} color={color} /> }}
      />
      <Tab.Screen
        name="Create"
        component={CreateScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={{ backgroundColor: '#00E5FF', padding: 8, borderRadius: 12 }}>
              <PlusSquare size={24} color="#000" />
            </View>
          )
        }}
      />
      <Tab.Screen
        name="Reels"
        component={ReelsScreen}
        options={{ tabBarIcon: ({ color }) => <Clapperboard size={24} color={color} /> }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color }) => {
            const me = useAuthStore.getState().user;
            return (
              <View style={{ borderWidth: focused ? 2 : 0, borderColor: theme.accent, borderRadius: 20, padding: 2 }}>
                <Avatar name={me?.name ?? me?.alias} url={(me as any)?.avatar_url} size={24} />
              </View>
            )
          }
        }}
      />
    </Tab.Navigator>
  );
}
