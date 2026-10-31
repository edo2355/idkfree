import { registerGlobals } from '@livekit/react-native';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// 🔥 ESTO ES OBLIGATORIO PARA QUE LIVeKIT FUNCIONE EN MÓVIL 🔥
registerGlobals();

AppRegistry.registerComponent(appName, () => App);
