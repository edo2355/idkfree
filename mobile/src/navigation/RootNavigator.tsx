// ============================================================
// RootNavigator.tsx — Navegador Principal con Scanner Táctico
// ============================================================
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppTabs } from './AppTabs';
import { AuthStack } from './AuthStack';
import { ScannerScreen } from '../screens/ScannerScreen';
import { ChatsScreen } from '../screens/ChatsScreen';
import { ChatScreen } from '../screens/ChatScreen';
import { UserProfileScreen } from '../screens/UserProfileScreen';
import { LiveStreamScreen } from '../screens/LiveStreamScreen';
import { CallScreen } from '../screens/CallScreen';
import { StartStreamScreen } from '../screens/StartStreamScreen';
import { VibesScreen } from '../screens/VibesScreen';
import { HashtagScreen } from '../screens/HashtagScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';

import { useAuthStore } from '../stores/authStore';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const token = useAuthStore((s) => s.token);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <>
                    <Stack.Screen name="MainTabs" component={AppTabs} />
          <Stack.Screen name="Chats" component={ChatsScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="UserProfile" component={UserProfileScreen} />
          <Stack.Screen name="Vibes" component={VibesScreen} />
          <Stack.Screen name="LiveStream" component={LiveStreamScreen} options={{ presentation: 'fullScreenModal' }} />
          <Stack.Screen name="CallScreen" component={CallScreen} options={{ presentation: 'fullScreenModal' }} />
          <Stack.Screen name="StartStream" component={StartStreamScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="Hashtag" component={HashtagScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />

          <Stack.Screen name="Scanner" component={ScannerScreen} options={{ presentation: 'fullScreenModal' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Auth" component={AuthStack} />
          <Stack.Screen name="Scanner" component={ScannerScreen} options={{ presentation: 'fullScreenModal' }} />
        </>
      )}
    </Stack.Navigator>
  );
}
