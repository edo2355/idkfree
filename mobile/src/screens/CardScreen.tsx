// ============================================================
// CardScreen.tsx — Carnet Digital Táctico con Escáner Integrado
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
        {/* Header Táctico */}
        <View style={styles.header}>
          <View>
            <Text style={styles.systemTag}>// ORBITAL_IDENTIFIER_CARD</Text>
            <Text style={styles.title}>Carnet Digital</Text>
          </View>
          <TouchableOpacity 
            style={styles.scanHeaderButton}
            onPress={() => navigation.navigate('Scanner')}
          >
            <Text style={styles.scanHeaderButtonText}>📷 ESCANEAR</Text>
          </TouchableOpacity>
        </View>

        {/* Tarjeta de Carnet */}
        <View style={styles.cardContainer}>
          <View style={styles.cardTop}>
            <Text style={styles.brandTitle}>IDKFREE ✦</Text>
            <Text style={styles.cardId}>ID: {user?.id?.substring(0, 12) || 'UNKNOWN'}</Text>
          </View>

          <View style={styles.cardBody}>
            {/* Foto con Filtro Dossier */}
            <View style={styles.photoBox}>
              {resolvedAvatarUri ? (
                <DossierPhotoFilter source={{ uri: resolvedAvatarUri }} variant="noir" showCoordinates style={styles.photo} />
              ) : (
                <View style={styles.noPhoto}>
                  <Text style={styles.noPhotoText}>SIN FOTO</Text>
                </View>
              )}
            </View>

            {/* Datos Personales */}
            <View style={styles.infoBox}>
              <Text style={styles.nameText}>{user?.name || 'Sujeto Anónimo'}</Text>
              <Text style={styles.aliasText}>@{user?.alias || 'alias'}</Text>
              <Text style={styles.statusBadge}>STATUS: ACTIVO / VERIFICADO</Text>
            </View>
          </View>

          {/* Código QR Táctico */}
          <View style={styles.qrSection}>
            <View style={styles.qrFrame}>
              <QRCode value={qrPayload} size={140} color="#FFF" backgroundColor="#000" />
            </View>
            <Text style={styles.qrHint}>[ PAYLOAD CIFRADO ORBITAL ]</Text>
          </View>
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
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  systemTag: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#32D3EE',
    letterSpacing: 1,
  },
  title: {
    fontFamily: fonts.displayBoldItalic,
    fontSize: 28,
    color: '#FFF',
  },
  scanHeaderButton: {
    backgroundColor: '#0F0F0F',
    borderWidth: 1,
    borderColor: '#32D3EE',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  scanHeaderButtonText: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
    color: '#32D3EE',
  },
  cardContainer: {
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#222',
    padding: 20,
    borderRadius: 4,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    paddingBottom: 12,
    marginBottom: 16,
  },
  brandTitle: {
    fontFamily: fonts.displayBoldItalic,
    fontSize: 20,
    color: '#FFF',
  },
  cardId: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#888',
  },
  cardBody: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  photoBox: {
    width: 90,
    height: 110,
    borderWidth: 1,
    borderColor: '#333',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  noPhoto: {
    flex: 1,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPhotoText: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: '#555',
  },
  infoBox: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  nameText: {
    fontFamily: fonts.displayBoldItalic,
    fontSize: 18,
    color: '#FFF',
  },
  aliasText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#AB55F7',
    marginBottom: 8,
  },
  statusBadge: {
    fontFamily: 'monospace',
    fontSize: 8,
    color: '#32D3EE',
    letterSpacing: 0.5,
  },
  qrSection: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#222',
    paddingTop: 16,
  },
  qrFrame: {
    padding: 10,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#333',
  },
  qrHint: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: '#666',
    marginTop: 10,
    letterSpacing: 1,
  },
});
