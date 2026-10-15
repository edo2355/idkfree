// ============================================================
// CardScreen.tsx — Carnet Digital Táctico (Diseño Original)
// ============================================================
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useAuthStore } from '../stores/authStore';
import { api } from '../api/client';
import { fonts } from '../theme/fonts';
import { DossierPhotoFilter } from '../components/DossierPhotoFilter';
import { resolveAssetUrl } from '../utils/assetUrl';

export function CardScreen({ navigation }: any) {
  const user = useAuthStore((s) => s.user);
  const [cardData, setCardData] = useState<any>(null);
  const [resolvedAvatarUri, setResolvedAvatarUri] = useState<string | null>(null);

  useEffect(() => {
    async function loadCard() {
      try {
        const res = await api.card.get();
        setCardData(res);
      } catch (e) {
        console.log('Error cargando carnet:', e);
      }
    }
    loadCard();
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function resolveAvatar() {
      if (user?.avatar_url) {
        const uri = await resolveAssetUrl(user.avatar_url);
        if (isMounted) setResolvedAvatarUri(uri);
      } else {
        if (isMounted) setResolvedAvatarUri(null);
      }
    }
    resolveAvatar();
    return () => { isMounted = false; };
  }, [user?.avatar_url]);

  const qrPayload = cardData?.qr_payload || `aldea:v1:${user?.id || 'guest'}`;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Card Container */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.logoText}>IDKFREE</Text>
            <Text style={styles.subLogoText}>CARD SYSTEM v1.0</Text>
          </View>

          <View style={styles.cardBody}>
            <View style={styles.photoContainer}>
              {resolvedAvatarUri ? (
                <DossierPhotoFilter source={{ uri: resolvedAvatarUri }} variant="noir" style={styles.photo} />
              ) : (
                <View style={styles.noPhoto}>
                  <Text style={styles.noPhotoText}>NO PHOTO</Text>
                </View>
              )}
            </View>

            <View style={styles.details}>
              <Text style={styles.label}>TITULAR</Text>
              <Text style={styles.valueName}>{user?.name || 'Sujeto Anónimo'}</Text>

              <Text style={styles.label}>ALIAS</Text>
              <Text style={styles.valueAlias}>@{user?.alias || 'alias'}</Text>

              <Text style={styles.label}>IDENTIFICADOR</Text>
              <Text style={styles.valueId}>{user?.id?.substring(0, 16) || 'IDK-000000'}</Text>
            </View>
          </View>

          <View style={styles.qrContainer}>
            <QRCode value={qrPayload} size={150} color="#FFFFFF" backgroundColor="#000000" />
            <Text style={styles.qrLabel}>SCAN TO VERIFY CREDENTIALS</Text>
          </View>

          <TouchableOpacity 
            style={styles.scanButton}
            onPress={() => navigation.navigate('Scanner')}
          >
            <Text style={styles.scanButtonText}>[ ABRIR ESCÁNER DE CAMARA ]</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 8,
    padding: 20,
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
    paddingBottom: 12,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  logoText: {
    fontFamily: fonts.displayBoldItalic,
    fontSize: 22,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  subLogoText: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#A855F7',
  },
  cardBody: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  photoContainer: {
    width: 100,
    height: 120,
    borderWidth: 1,
    borderColor: '#333333',
    backgroundColor: '#000000',
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  noPhoto: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPhotoText: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: '#555555',
  },
  details: {
    flex: 1,
    marginLeft: 16,
  },
  label: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: '#666666',
    marginTop: 6,
  },
  valueName: {
    fontFamily: fonts.displayBoldItalic,
    fontSize: 16,
    color: '#FFFFFF',
  },
  valueAlias: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#22D3EE',
  },
  valueId: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#A3A3A3',
  },
  qrContainer: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
  },
  qrLabel: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: '#555555',
    marginTop: 10,
    letterSpacing: 1,
  },
  scanButton: {
    marginTop: 16,
    backgroundColor: '#111111',
    borderWidth: 1,
    borderColor: '#333333',
    paddingVertical: 10,
    alignItems: 'center',
  },
  scanButtonText: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#32D3EE',
    fontWeight: 'bold',
  },
});
