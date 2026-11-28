import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Share } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Calendar, MapPin, Share2, Download } from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';
import { GlassCard } from '../components/ui/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';

export function TicketViewScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const route = useRoute<any>();

  // Datos simulados del ticket (en el futuro vendrán del backend)
  const ticket = route.params?.ticket || {
    id: 'TKT-9824-1102',
    eventName: 'Concierto IDKMEDIA Live',
    date: '15 DIC 2026',
    time: '20:00',
    venue: 'Estadio de la Habana',
    seats: 'A-12, A-13',
    price: 50.00,
    qrData: 'https://idkmedia.com/validate/TKT-9824-1102'
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `¡Mira mi ticket para ${ticket.eventName}! ID: ${ticket.id}`,
      });
    } catch (error) {
      console.log('Error compartiendo:', error);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Ticket</Text>
        <TouchableOpacity onPress={handleShare} style={styles.backBtn}>
          <Share2 size={22} color="#00E5FF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Tarjeta del Ticket */}
        <GlassCard style={styles.ticketCard} intensity={30}>
          {/* Cabecera con degradado */}
          <LinearGradient 
            colors={['#00E5FF', '#0055FF']} 
            start={{ x: 0, y: 0 }} 
            end={{ x: 1, y: 1 }} 
            style={styles.ticketHeader}
          >
            <Text style={styles.eventName}>{ticket.eventName}</Text>
            <Text style={styles.ticketId}>{ticket.id}</Text>
          </LinearGradient>

          {/* Detalles */}
          <View style={styles.detailsContainer}>
            <View style={styles.row}>
              <View style={styles.iconBox}>
                <Calendar size={20} color="#fff" />
              </View>
              <View>
                <Text style={styles.label}>FECHA Y HORA</Text>
                <Text style={styles.value}>{ticket.date} • {ticket.time}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={styles.iconBox}>
                <MapPin size={20} color="#fff" />
              </View>
              <View>
                <Text style={styles.label}>RECINTO</Text>
                <Text style={styles.value}>{ticket.venue}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.seatsRow}>
              <View>
                <Text style={styles.label}>ASIENTOS</Text>
                <Text style={styles.value}>{ticket.seats}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.label}>TOTAL PAGADO</Text>
                <Text style={[styles.value, { color: '#00E5FF', fontWeight: 'bold' }]}>${ticket.price.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {/* Separador perforado (Efecto ticket) */}
          <View style={styles.perforation}>
            <View style={styles.notchLeft} />
            <View style={styles.dashedLine} />
            <View style={styles.notchRight} />
          </View>

          {/* Zona del QR */}
          <View style={styles.qrContainer}>
            <Text style={styles.qrLabel}>ESCANEA PARA VALIDAR</Text>
            <View style={styles.qrWrapper}>
              <QRCode
                value={ticket.qrData}
                size={200}
                color="#000"
                backgroundColor="#fff"
              />
            </View>
            <Text style={styles.qrFooter}>Presenta este código en la entrada</Text>
          </View>
        </GlassCard>

        {/* Botón de descarga */}
        <TouchableOpacity style={styles.downloadBtn}>
          <Download size={20} color="#fff" />
          <Text style={styles.downloadBtnText}>Guardar en mi galería</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 15,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)'
  },
  backBtn: { padding: 5 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  content: { padding: 20, paddingBottom: 40 },
  
  ticketCard: { borderRadius: 24, overflow: 'hidden', padding: 0 },
  ticketHeader: { padding: 24, alignItems: 'center' },
  eventName: { color: '#fff', fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 6 },
  ticketId: { color: 'rgba(255,255,255,0.7)', fontSize: 12, letterSpacing: 2, fontWeight: '600' },

  detailsContainer: { padding: 24 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBox: { 
    width: 44, height: 44, borderRadius: 22, 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    alignItems: 'center', justifyContent: 'center' 
  },
  label: { color: '#888', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  value: { color: '#fff', fontSize: 16, fontWeight: '500' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 16 },
  seatsRow: { flexDirection: 'row', justifyContent: 'space-between' },

  perforation: { flexDirection: 'row', alignItems: 'center', height: 20 },
  notchLeft: { width: 20, height: 40, backgroundColor: '#050505', borderRadius: 20, marginLeft: -10 },
  dashedLine: { flex: 1, height: 1, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderStyle: 'dashed' },
  notchRight: { width: 20, height: 40, backgroundColor: '#050505', borderRadius: 20, marginRight: -10 },

  qrContainer: { padding: 24, alignItems: 'center' },
  qrLabel: { color: '#888', fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 16 },
  qrWrapper: { padding: 16, backgroundColor: '#fff', borderRadius: 16 },
  qrFooter: { color: '#666', fontSize: 12, marginTop: 16 },

  downloadBtn: {
    flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 16, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
    marginTop: 24, gap: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)'
  },
  downloadBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' }
});
