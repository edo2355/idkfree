import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';
import { useAuthStore } from '../stores/authStore';
import { NotificationIcon } from './icons/NotificationIcon';
import { CommentIcon } from './icons/CommentIcon';

interface Props {
  showBack?: boolean;
  title?: string;
}

export function HeaderBar({ showBack = false, title }: Props) {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const user = useAuthStore((s) => s.user);

  const initial = (user?.name ?? user?.alias ?? '?').charAt(0).toUpperCase();

  return (
    <View
      style={{
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
      }}
    >
      {showBack ? (
        <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.6}>
          <Text style={{ color: theme.text, fontSize: 22 }}>←</Text>
        </TouchableOpacity>
      ) : (
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
      )}

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Chats')} activeOpacity={0.6}>
          <CommentIcon size={22} color={theme.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Notifications')} activeOpacity={0.6}>
          <NotificationIcon size={22} color={theme.text} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Profile')} activeOpacity={0.6}>
          <View
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: theme.surfaceElevated,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: theme.border,
            }}
          >
            <Text style={{ color: theme.text, fontFamily: fonts.medium, fontSize: 14 }}>
              {initial}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
