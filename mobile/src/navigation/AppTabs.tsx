import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Pressable } from 'react-native';
import { useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeIcon } from '../components/icons/HomeIcon';
import { ReelsIcon } from '../components/icons/ReelsIcon';
import { SearchIcon } from '../components/icons/SearchIcon';
import { useTheme } from '../stores/themeStore';
import { useAuthStore } from '../stores/authStore';
import { useFeedStore } from '../stores/feedStore';
import { Avatar } from '../components/Avatar';
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
      <Text style={{ color: focused ? theme.bg : theme.text, fontSize: 26, fontFamily: fonts.regular, marginTop: -3, lineHeight: 30 }}>
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
          backgroundColor: theme.bg,
          borderTopColor: theme.border,
          borderTopWidth: 0.5,
          height: 52 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 6,
        },
        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: fonts.medium,
          marginTop: -2,
        },
      }}
    >
      <Tab.Screen
        name='Feed'
        component={FeedScreen}
        options={{
          tabBarIcon: ({ color }) => <HomeIcon size={24} color={color} />,
          tabBarButton: (props) => {
            const lastTap = useRef<number>(0);
            const toggleFeed = useFeedStore((s) => s.toggleMode);
            return (
              <Pressable
                {...(props as any)}
                onPress={(e) => {
                  const now = Date.now();
                  if (now - lastTap.current < 300) {
                    toggleFeed();
                  } else {
                    props.onPress?.(e as any);
                  }
                  lastTap.current = now;
                }}
              />
            );
          },
        }}
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
        options={{
          tabBarIcon: ({ focused }) => {
            const me = useAuthStore.getState().user;
            return (
              <View style={{ borderWidth: focused ? 2 : 0, borderColor: theme.text, borderRadius: 16 }}>
                <Avatar name={me?.name ?? me?.alias} url={(me as any)?.avatar_url} size={24} />
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}
