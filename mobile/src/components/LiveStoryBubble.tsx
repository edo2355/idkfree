import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';

export function LiveStoryBubble() {
  const theme = useTheme();
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('StartStream')}
      style={{ alignItems: 'center', marginHorizontal: 8, marginBottom: 15, marginLeft: 16 }}
    >
      <View style={{
        width: 72, height: 72, borderRadius: 36,
        borderWidth: 2, borderColor: '#EF4444',
        padding: 3, justifyContent: 'center', alignItems: 'center',
        backgroundColor: theme.bg
      }}>
        <View style={{
          width: '100%', height: '100%', borderRadius: 32,
          backgroundColor: theme.surface, justifyContent: 'center', alignItems: 'center',
          borderWidth: 2, borderColor: theme.bg
        }}>
          <Text style={{ fontSize: 28 }}>🔴</Text>
        </View>
      </View>
      <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 12, marginTop: 6 }}>
        En Vivo
      </Text>
    </TouchableOpacity>
  );
}
