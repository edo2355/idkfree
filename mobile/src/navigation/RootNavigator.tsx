import { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '../stores/authStore';
import { AuthStack } from './AuthStack';
import { AppTabs } from './AppTabs';
import { UserProfileScreen } from '../screens/UserProfileScreen';
import { HashtagScreen } from '../screens/HashtagScreen';
import { VibesScreen } from '../screens/VibesScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { ChatsScreen } from '../screens/ChatsScreen';
import { ChatScreen } from '../screens/ChatScreen';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const { token, isLoading, restore } = useAuthStore();
  useEffect(() => { restore(); }, []);
  if (isLoading) return null;

  if (!token) return <AuthStack />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#050505' } }}>
      <Stack.Screen name="Main" component={AppTabs} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="Hashtag" component={HashtagScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="Vibes" component={VibesScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="Chats" component={ChatsScreen} options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="Chat" component={ChatScreen} options={{ animation: 'slide_from_right' }} />
    </Stack.Navigator>
  );
}
