import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { ScreenBackground } from './ScreenBackground';

const MONO = 'monospace';

interface Section {
  title?: string;
  body: string;
  numbered?: boolean;
}

interface Props {
  title: string;
  subtitle: string;
  version: string;
  updatedAt: string;
  sections: Section[];
}

export function LegalScreen({ title, subtitle, version, updatedAt, sections }: Props) {
  const theme = useTheme();
  const navigation = useNavigation<any>();

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScreenBackground variant="grid" opacity={0.04} />
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 60, paddingBottom: 60 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6}>
          <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 15 }}>← Atrás</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={{ marginTop: 20, marginBottom: 24 }}>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 10, letterSpacing: 2, marginBottom: 6 }}>
            IDKFREE · LEGAL · v{version}
          </Text>
          <Text style={{ fontSize: 30, color: theme.text, fontFamily: fonts.displayBoldItalic, letterSpacing: 0.5 }}>
            {title}
          </Text>
          <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 13, marginTop: 8, lineHeight: 18 }}>
            {subtitle}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: theme.border }} />
            <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 9, letterSpacing: 1 }}>
              ACTUALIZADO {updatedAt}
            </Text>
          </View>
        </View>

        {/* Secciones */}
        {sections.map((s, i) => (
          <View key={i} style={{ marginBottom: 22 }}>
            {s.title ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Text style={{ color: theme.accent, fontFamily: MONO, fontSize: 10, letterSpacing: 1.5 }}>
                  {String(i + 1).padStart(2, '0')}
                </Text>
                <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 15, letterSpacing: 0.3 }}>
                  {s.title.toUpperCase()}
                </Text>
              </View>
            ) : null}
            <Text style={{ color: theme.textMuted, fontFamily: fonts.regular, fontSize: 14, lineHeight: 22 }}>
              {s.body}
            </Text>
          </View>
        ))}

        {/* Footer */}
        <View style={{ marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: theme.border }}>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 9, letterSpacing: 2, textAlign: 'center' }}>
            IDKFREE.OS · © 2026 EDO AMATE
          </Text>
          <Text style={{ color: theme.textSubtle, fontFamily: MONO, fontSize: 9, letterSpacing: 2, textAlign: 'center', marginTop: 6 }}>
            "MÁS QUE UNA PREGUNTA"
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
