import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeIcon } from '../components/icons/HomeIcon';
import { ReelsIcon } from '../components/icons/ReelsIcon';
import { ProfileIcon } from '../components/icons/ProfileIcon';
import { SearchIcon } from '../components/icons/SearchIcon';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { FeedScreen } from '../screens/FeedScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { ChangePasswordScreen } from '../screens/ChangePasswordScreen';
import { CardScreen } from '../screens/CardScreen';
import { CreateScreen } from '../screens/CreateScreen';
import { ReelsScreen } from '../screens/ReelsScreen';

const Tab = createBottomTabNavigator();
const ProfileStack = createNativeStackNavigator();

function ProfileStackNav() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name='ProfileMain' component={ProfileScreen} />
      <ProfileStack.Screen name='Settings' component={SettingsScreen} />
      <ProfileStack.Screen name='EditProfile' component={EditProfileScreen} />
      <ProfileStack.Screen name='ChangePassword' component={ChangePasswordScreen} />
      <ProfileStack.Screen name='Card' component={CardScreen} />
    </ProfileStack.Navigator>
  );
}

function CreateIcon({ color, focused }: { color: string; focused: boolean }) {
  const theme = useTheme();
  return (
    <View
      style={{
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: focused ? theme.text : theme.surfaceElevated,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.border,
      }}
    >
      <Text style={{ color: focused ? theme.bg : theme.text, fontSize: 24, fontFamily: fonts.regular, marginTop: -2 }}>
        +
      </Text>
    </View>
  );
}

export function AppTabs() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          height: 64 + insets.bottom,
          paddingBottom: 6 + insets.bottom,
          paddingTop: 6,
        },
        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: theme.textMuted,
      }}
    >
      <Tab.Screen
        name='Feed'
        component={FeedScreen}
        options={{ tabBarIcon: ({ color }) => <HomeIcon size={24} color={color} /> }}
      />
      <Tab.Screen
        name='Search'
        component={SearchScreen}
        options={{ tabBarIcon: ({ color }) => <SearchIcon size={24} color={color} /> }}
      />
      <Tab.Screen
        name='Create'
        component={CreateScreen}
        options={{
          tabBarIcon: ({ color, focused }) => <CreateIcon color={color} focused={focused} />,
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name='Reels'
        component={ReelsScreen}
        options={{ tabBarIcon: ({ color, focused }) => <ReelsIcon size={24} color={color} filled={focused} /> }}
      />
      <Tab.Screen
        name='Profile'
        component={ProfileStackNav}
        options={{ tabBarIcon: ({ color }) => <ProfileIcon size={24} color={color} /> }}
      />
    </Tab.Navigator>
  );
}
