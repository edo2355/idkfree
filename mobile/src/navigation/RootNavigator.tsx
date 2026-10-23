import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppTabs } from './AppTabs';
import { AuthStack } from './AuthStack';
import { useAuthStore } from '../stores/authStore';
import { View, ActivityIndicator, Text } from 'react-native';

// Imports de todas las pantallas
import { SettingsScreen } from '../screens/SettingsScreen';
import { KycScreen } from '../screens/KycScreen';
import { MyDataScreen } from '../screens/MyDataScreen';
import { TermsScreen } from '../screens/TermsScreen';
import { PrivacyScreen } from '../screens/PrivacyScreen';
import { AboutScreen } from '../screens/AboutScreen';
import { ChangePasswordScreen } from '../screens/ChangePasswordScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { CardScreen } from '../screens/CardScreen';
import { StartStreamScreen } from '../screens/StartStreamScreen';
import { ChatsScreen } from '../screens/ChatsScreen';
import { UserProfileScreen } from '../screens/UserProfileScreen';
import { LiveStreamScreen } from '../screens/LiveStreamScreen';
import { CallScreen } from '../screens/CallScreen';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const token = useAuthStore((s) => s.token);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00E5FF" />
        <Text style={{ color: '#888', marginTop: 10, fontFamily: 'monospace' }}>CARGANDO_SESIÓN...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <>
          <Stack.Screen name="Main" component={AppTabs} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Kyc" component={KycScreen} />
          <Stack.Screen name="MyData" component={MyDataScreen} />
          <Stack.Screen name="Terms" component={TermsScreen} />
          <Stack.Screen name="Privacy" component={PrivacyScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Card" component={CardScreen} />
          <Stack.Screen name="StartStream" component={StartStreamScreen} />
          <Stack.Screen name="Chats" component={ChatsScreen} />
          <Stack.Screen name="UserProfile" component={UserProfileScreen} />
          <Stack.Screen name="LiveStream" component={LiveStreamScreen} />
          <Stack.Screen name="Call" component={CallScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}
