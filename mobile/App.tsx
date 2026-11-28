import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { Building2, ScanLine, Wallet } from 'lucide-react-native';

import { AboutScreen } from './src/screens/AboutScreen';
import { AddCatalogItemScreen } from './src/screens/AddCatalogItemScreen';
import { CallScreen } from './src/screens/CallScreen';
import { CardModalScreen } from './src/screens/CardModalScreen';
import { CardScreen } from './src/screens/CardScreen';
import { CatalogScreen } from './src/screens/CatalogScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { CheckoutScreen } from './src/screens/CheckoutScreen';
import { ChangePasswordScreen } from './src/screens/ChangePasswordScreen';
import { ChatScreen } from './src/screens/ChatScreen';
import { ChatsScreen } from './src/screens/ChatsScreen';
import { CheckoutScreen } from './src/screens/CheckoutScreen';
import { ConfigScreen } from './src/screens/ConfigScreen';
import { CreateScreen } from './src/screens/CreateScreen';
import { EditProfileScreen } from './src/screens/EditProfileScreen';
import { ErrorLogsScreen } from './src/screens/ErrorLogsScreen';
import { FeedScreen } from './src/screens/FeedScreen';
import { HashtagScreen } from './src/screens/HashtagScreen';
import { KycScreen } from './src/screens/KycScreen';
import LiveStreamReal from './src/screens/LiveStreamReal';
import { LiveStreamScreen } from './src/screens/LiveStreamScreen';
import { LiveStreamsScreen } from './src/screens/LiveStreamsScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { MyDataScreen } from './src/screens/MyDataScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { PaymentSettingsScreen } from './src/screens/PaymentSettingsScreen';
import { PrivacyScreen } from './src/screens/PrivacyScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { CheckoutScreen } from './src/screens/CheckoutScreen';
import { RecoveryScreen } from './src/screens/RecoveryScreen';
import { ReelsScreen } from './src/screens/ReelsScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import { SearchScreen } from './src/screens/SearchScreen';
import { SendMoneyScreen } from './src/screens/SendMoneyScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { SplashScreen } from './src/screens/SplashScreen';
import { StartStreamScreen } from './src/screens/StartStreamScreen';
import { TermsScreen } from './src/screens/TermsScreen';
import { UserProfileScreen } from './src/screens/UserProfileScreen';
import { VibesScreen } from './src/screens/VibesScreen';
import { WalletScreen } from './src/screens/WalletScreen';
import { TicketViewScreen } from './src/screens/TicketViewScreen';
import { ContactScreen } from './src/screens/ContactScreen';
import OfflineVenueScreen from './src/screens/OfflineVenueScreen';

const Stack = createNativeStackNavigator();

const DarkTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: '#050505', card: '#0a0a0a', text: '#ffffff', primary: '#00E5FF', border: '#222222' },
};

const GlassHeader = ({ title }: { title: string }) => (
  <BlurView intensity={80} tint="dark" style={styles.headerContainer}>
    <Text style={styles.headerTitle}>{title}</Text>
  </BlurView>
);

const SplashWrapper = (props: any) => <SplashScreen {...props} onFinish={() => props.navigation.replace('Login')} />;
const CardModalWrapper = (props: any) => <CardModalScreen {...props} qrPayloads={[]} pins={[]} onConfirm={() => {}} />;
const ConfigWrapper = (props: any) => <ConfigScreen {...props} onClose={() => props.navigation.goBack()} />;

function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>IDKMEDIA APP</Text>
      <Text style={styles.subtitle}>Modo Offline & Herramientas</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('OfflineVenue')}>
        <Building2 size={20} color="#00E5FF" style={styles.icon} />
        <Text style={styles.buttonText}>Crear Recinto Offline</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Scanner')}>
        <ScanLine size={20} color="#00E5FF" style={styles.icon} />
        <Text style={styles.buttonText}>Escanear Ticket QR</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Wallet')}>
        <Wallet size={20} color="#00E5FF" style={styles.icon} />
        <Text style={styles.buttonText}>Mi Billetera</Text>
      </TouchableOpacity>
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
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="About" component={AboutScreen} options={{ title: 'About' }} />
        <Stack.Screen name="AddCatalogItem" component={AddCatalogItemScreen} options={{ title: 'AddCatalogItem' }} />
        <Stack.Screen name="Call" component={CallScreen} options={{ title: 'Call' }} />
        <Stack.Screen name="CardModal" component={CardModalWrapper} options={{ title: 'CardModal' }} />
        <Stack.Screen name="Card" component={CardScreen} options={{ title: 'Card' }} />
        <Stack.Screen name="Catalog" component={CatalogScreen} options={{ title: 'Catalog' }} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: 'ChangePassword' }} />
        <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Chat' }} />
        <Stack.Screen name="Chats" component={ChatsScreen} options={{ title: 'Chats' }} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
        <Stack.Screen name="Config" component={ConfigWrapper} options={{ title: 'Config' }} />
        <Stack.Screen name="Create" component={CreateScreen} options={{ title: 'Create' }} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'EditProfile' }} />
        <Stack.Screen name="ErrorLogs" component={ErrorLogsScreen} options={{ title: 'ErrorLogs' }} />
        <Stack.Screen name="Feed" component={FeedScreen} options={{ title: 'Feed' }} />
        <Stack.Screen name="Hashtag" component={HashtagScreen} options={{ title: 'Hashtag' }} />
        <Stack.Screen name="Kyc" component={KycScreen} options={{ title: 'Kyc' }} />
        <Stack.Screen name="LiveStreamReal" component={LiveStreamReal} options={{ title: 'LiveStreamReal' }} />
        <Stack.Screen name="LiveStream" component={LiveStreamScreen} options={{ title: 'LiveStream' }} />
        <Stack.Screen name="LiveStreams" component={LiveStreamsScreen} options={{ title: 'LiveStreams' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MyData" component={MyDataScreen} options={{ title: 'MyData' }} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
        <Stack.Screen name="PaymentSettings" component={PaymentSettingsScreen} options={{ title: 'PaymentSettings' }} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} options={{ title: 'Privacy' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
        <Stack.Screen name="Recovery" component={RecoveryScreen} options={{ title: 'Recovery' }} />
        <Stack.Screen name="Reels" component={ReelsScreen} options={{ title: 'Reels' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Scanner" component={ScannerScreen} options={{ title: 'Scanner' }} />
        <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search' }} />
        <Stack.Screen name="SendMoney" component={SendMoneyScreen} options={{ title: 'SendMoney' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
        <Stack.Screen name="Splash" component={SplashWrapper} options={{ title: 'Splash' }} />
        <Stack.Screen name="StartStream" component={StartStreamScreen} options={{ title: 'StartStream' }} />
        <Stack.Screen name="Terms" component={TermsScreen} options={{ title: 'Terms' }} />
        <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ title: 'UserProfile' }} />
        <Stack.Screen name="Vibes" component={VibesScreen} options={{ title: 'Vibes' }} />
        <Stack.Screen name="Wallet" component={WalletScreen} options={{ title: 'Wallet' }} />
        <Stack.Screen name="Contact" component={ContactScreen} options={{ title: 'Contact' }} />
        <Stack.Screen name="OfflineVenue" component={OfflineVenueScreen} options={{ title: 'OfflineVenue' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { color: '#00E5FF', fontSize: 32, fontWeight: '900', marginBottom: 5, letterSpacing: 1 },
  subtitle: { color: '#888', fontSize: 16, marginBottom: 40, fontWeight: '500' },
  button: { backgroundColor: '#111', padding: 16, borderRadius: 16, width: '100%', marginBottom: 16, borderWidth: 1, borderColor: '#222', flexDirection: 'row', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600', flex: 1, textAlign: 'center' },
  icon: { position: 'absolute', left: 16 },
  headerContainer: { height: Platform.OS === 'ios' ? 100 : 70, paddingTop: Platform.OS === 'ios' ? 50 : 20, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600', marginTop: Platform.OS === 'ios' ? 0 : 10 }
});
