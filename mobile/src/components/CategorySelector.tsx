import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';

const CREATOR_CATEGORIES = ['Música', 'Tecnología', 'Arte', 'Gaming', 'Comedia', 'Deportes', 'Educación', 'Moda', 'Otro'];
const BUSINESS_CATEGORIES = ['Tienda', 'Restaurante', 'Tecnología', 'Salud', 'Educación', 'Inmobiliaria', 'Servicios', 'Otro'];

export function CategorySelector({ accountType, value, onChange }: { accountType: string, value: string, onChange: (val: string) => void }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [customText, setCustomText] = useState('');

  const list = accountType === 'creator' ? CREATOR_CATEGORIES : BUSINESS_CATEGORIES;

  return (
    <View>
      <TouchableOpacity onPress={() => setOpen(true)} style={{ backgroundColor: theme.surface, padding: 16, borderRadius: 10, borderWidth: 1, borderColor: theme.border }}>
        <Text style={{ color: value ? theme.text : theme.textMuted, fontFamily: fonts.regular }}>{value || 'Selecciona una categoría'}</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: theme.bg, padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '70%' }}>
            <Text style={{ color: theme.text, fontFamily: fonts.displayBoldItalic, fontSize: 24, marginBottom: 15 }}>Elige una categoría</Text>
            <FlatList
              data={list}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => { onChange(item); setOpen(false); }} style={{ paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: theme.border }}>
                  <Text style={{ color: theme.text, fontFamily: fonts.regular, fontSize: 16 }}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setOpen(false)} style={{ marginTop: 20, alignItems: 'center' }}>
              <Text style={{ color: theme.danger, fontFamily: fonts.medium }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
