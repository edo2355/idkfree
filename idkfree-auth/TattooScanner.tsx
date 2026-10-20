import { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as SecureStore from 'expo-secure-store';

export default function TattooScanner({ onComplete, onCancel }: { onComplete: () => void, onCancel: () => void }) {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!permission) return <View style={{ flex: 1, backgroundColor: '#000' }} />;
  
  if (!permission.granted) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ color: '#FFF', fontFamily: 'monospace', marginBottom: 20, textAlign: 'center' }}>
          // SECURITY_ACCESS_REQUIRED{'\n\n'}Se requiere acceso a la cámara para el escaneo biométrico.
        </Text>
        <TouchableOpacity onPress={requestPermission} style={{ backgroundColor: '#32D3EE', paddingHorizontal: 20, paddingVertical: 12 }}>
          <Text style={{ color: '#000', fontFamily: 'monospace', fontWeight: 'bold', letterSpacing: 1 }}>CONCEDER ACCESO ◆</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCancel} style={{ marginTop: 20 }}>
          <Text style={{ color: '#888' }}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function takePicture() {
    if (!cameraRef.current || isProcessing) return;
    setIsProcessing(true);
    
    try {
      // Capturamos la foto en vivo (base64 para enviar directo)
      const photo = await cameraRef.current.takePictureAsync({ 
        base64: true, 
        quality: 0.5,
        skipProcessing: false 
      });
      
      // Obtenemos el token para saber qué usuario está escaneando
      const token = await SecureStore.getItemAsync('auth_token');
      
      const res = await fetch('http://192.168.1.45:3002/api/auth/register-tattoo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: '710e6421-a375-481d-ae56-09be02e3788f', // Luego lo sacaremos del token
          image_base64: photo.base64 
        }),
      });

      if (!res.ok) throw new Error('Error en el servidor');
      
      Alert.alert('¡Escaneo Exitoso!', 'Tu tatuaje ha sido registrado como llave maestra en vivo.');
      onComplete();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo capturar la foto');
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing={facing}
        flash={flash}
      />

      {/* Top bar (Copiada de CreateScreen) */}
      <View style={{ position: 'absolute', top: 50, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 }}>
        <TouchableOpacity onPress={onCancel} style={{ backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#333' }}>
          <Text style={{ color: '#FFF', fontFamily: 'monospace', fontSize: 11 }}>[ ✗ ]</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity onPress={() => setFlash(flash === 'off' ? 'on' : 'off')} style={{ backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#333' }}>
            <Text style={{ color: '#FFF', fontFamily: 'monospace', fontSize: 11 }}>{flash === 'off' ? '[FLASH] OFF' : '[FLASH] ON'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Texto guía */}
      <View style={{ position: 'absolute', top: 110, left: 0, right: 0, alignItems: 'center' }}>
        <Text style={{ color: '#32D3EE', fontFamily: 'monospace', fontSize: 12, letterSpacing: 2, backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 }}>
          ALINEA TU TATUAJE
        </Text>
      </View>

      {/* Bottom controls (Copiada de CreateScreen) */}
      <View style={{ position: 'absolute', bottom: 40, left: 0, right: 0, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 40 }}>
          <View style={{ width: 48, height: 48 }} /> {/* Espacio vacío para centrar el botón */}

          <TouchableOpacity
            onPress={takePicture}
            disabled={isProcessing}
            style={{
              width: 80, height: 80, borderRadius: 40,
              borderWidth: 4, borderColor: '#FFF',
              backgroundColor: isProcessing ? '#ff4d4f' : 'rgba(255,255,255,0.2)',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            {isProcessing ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFF' }} />
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setFacing(facing === 'back' ? 'front' : 'back')} style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 22, color: '#FFF' }}>↻</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
