import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { CommentIcon } from './icons/CommentIcon';

interface Props {
  showBack?: boolean;
  title?: string;
}

export function HeaderBar({ showBack = false, title }: Props) {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top + 10,
        paddingHorizontal: 20,
        paddingBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
        position: 'relative',
      }}
    >
      {showBack ? (
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6}>
          <Text style={{ color: theme.text, fontSize: 22 }}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} />
      )}

      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        <Text
          style={{
            fontSize: 26,
            color: theme.text,
            fontFamily: fonts.displayBoldItalic,
            letterSpacing: 0.5,
          }}
        >
          {title ?? 'IDKFREE'}
        </Text>
      </View>

      {/* Solo dejamos el icono de chats a la derecha */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Chats')} activeOpacity={0.6}>
          <CommentIcon size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
