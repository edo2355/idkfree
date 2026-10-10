import { View, Text, TextInput, TextInputProps } from 'react-native';
import { useTheme } from '../stores/themeStore';
import { fonts } from '../theme/fonts';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, style, ...rest }: Props) {
  const theme = useTheme();
  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text
          style={{
            fontSize: 12,
            fontFamily: fonts.medium,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            color: theme.textMuted,
            marginBottom: 6,
          }}
        >
          {label}
        </Text>
      )}
      <TextInput
        placeholderTextColor={theme.textSubtle}
        style={[
          {
            padding: 14,
            fontSize: 15,
            fontFamily: fonts.regular,
            borderWidth: 1,
            borderColor: error ? theme.danger : theme.border,
            borderRadius: 8,
            backgroundColor: theme.surface,
            color: theme.text,
          },
          style,
        ]}
        {...rest}
      />
      {hint && !error && (
        <Text style={{ fontSize: 12, fontFamily: fonts.regular, color: theme.textMuted, marginTop: 4 }}>
          {hint}
        </Text>
      )}
      {error && (
        <Text style={{ fontSize: 12, fontFamily: fonts.medium, color: theme.danger, marginTop: 4 }}>
          {error}
        </Text>
      )}
    </View>
  );
}
