import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { useAuthStore } from '../stores/authStore';
import { NotificationIcon } from './icons/NotificationIcon';
import { CommentIcon } from './icons/CommentIcon';
import { Avatar } from './Avatar';

interface Props {
  showBack?: boolean;
  title?: string;
}

export function HeaderBar({ showBack = false, title }: Props) {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);

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

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Chats')} activeOpacity={0.6}>
          <CommentIcon size={22} color={theme.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Profile')} activeOpacity={0.6}>
          <Avatar name={user?.name ?? user?.alias} url={(user as any)?.avatar_url} size={32} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
