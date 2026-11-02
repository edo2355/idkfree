import { registerRootComponent } from 'expo';
import App from './App';

// ⚠️ LIVEKIT DESACTIVADO TEMPORALMENTE PARA PRUEBAS EN EXPO
// try {
//   const { registerGlobals } = require('@livekit/react-native');
//   registerGlobals();
//   console.log("✅ LiveKit Globals registrados");
// } catch (error) {
//   console.warn("⚠️ LiveKit no disponible");
// }

registerRootComponent(App);
