// ============================================================
// IDKAlert.tsx — Sistema de alertas cyber-brutalist IDKFREE
// API idéntica a Alert.alert de React Native
// ============================================================
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated, Pressable } from 'react-native';

type AlertButton = {
  text?: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

type AlertState = {
  title: string;
  message?: string;
  buttons?: AlertButton[];
  visible: boolean;
};

let _setAlert: ((s: AlertState) => void) | null = null;
let _hideAlert: (() => void) | null = null;

export const idkAlert = {
  alert: (title: string, message?: string, buttons?: AlertButton[]) => {
    if (!_setAlert) {
      console.warn('[IDKAlert] Provider not mounted. Fallback:', title, message);
      return;
    }
    _setAlert({
      title,
      message,
      buttons: buttons && buttons.length > 0 ? buttons : [{ text: 'OK' }],
      visible: true,
    });
  },
  _register: (setFn: (s: AlertState) => void, hideFn: () => void) => {
    _setAlert = setFn;
    _hideAlert = hideFn;
  },
};

// ---------- Componente visual ----------
export function IDKAlertProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AlertState>({
    title: '',
    visible: false,
  });

  useEffect(() => {
    idkAlert._register(
      (s) => setState(s),
      () => setState((prev) => ({ ...prev, visible: false }))
    );
  }, []);

  const handlePress = (btn: AlertButton) => {
    setState((prev) => ({ ...prev, visible: false }));
    // llamar onPress después de cerrar (pequeño delay para que se vea la transición)
    if (btn.onPress) {
      setTimeout(() => btn.onPress!(), 120);
    }
  };

  const buttons = state.buttons ?? [{ text: 'OK' }];
  const isStacked = buttons.length > 2;

  return (
    <>
      {children}
      <Modal
        visible={state.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setState((prev) => ({ ...prev, visible: false }))}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setState((prev) => ({ ...prev, visible: false }))}
        >
          <Pressable style={styles.panel} onPress={(e) => e.stopPropagation()}>
            {/* Header técnico */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.dot} />
                <Text style={styles.headerLabel}>IDKFREE · SYSTEM</Text>
              </View>
              <Text style={styles.headerCode}>[ALERT]</Text>
            </View>

            <View style={styles.divider} />

            {/* Contenido */}
            <View style={styles.body}>
              <Text style={styles.title}>{state.title}</Text>
              {state.message ? (
                <Text style={styles.message}>{state.message}</Text>
              ) : null}
            </View>

            <View style={styles.divider} />

            {/* Botones */}
            <View style={isStacked ? styles.buttonsStacked : styles.buttonsRow}>
              {buttons.map((btn, i) => {
                const isDestructive = btn.style === 'destructive';
                const isCancel = btn.style === 'cancel';
                return (
                  <TouchableOpacity
                    key={i}
                    style={[
                      styles.button,
                      isStacked && styles.buttonStacked,
                      isDestructive && styles.buttonDanger,
                      isCancel && styles.buttonCancel,
                    ]}
                    onPress={() => handlePress(btn)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        isDestructive && styles.buttonTextDanger,
                        isCancel && styles.buttonTextCancel,
                      ]}
                    >
                      {(btn.text ?? 'OK').toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Footer corner */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>▓▓▓▓▓▓▓░░░ SYS.MSG</Text>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  panel: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#0A0A0A',
    borderWidth: 1,
    borderColor: '#333333',
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#0F0F0F',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22C55E',
  },
  headerLabel: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#A3A3A3',
    letterSpacing: 1.5,
  },
  headerCode: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#5F5F5F',
    letterSpacing: 1.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#222222',
  },
  body: {
    padding: 20,
  },
  title: {
    fontFamily: 'monospace',
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 10,
  },
  message: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#A3A3A3',
    lineHeight: 18,
    letterSpacing: 0.3,
  },
  buttonsRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },
  buttonsStacked: {
    padding: 12,
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
    backgroundColor: '#0F0F0F',
  },
  buttonStacked: {
    width: '100%',
  },
  buttonDanger: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239,68,68,0.1)',
  },
  buttonCancel: {
    borderColor: '#333333',
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  buttonTextDanger: {
    color: '#EF4444',
  },
  buttonTextCancel: {
    color: '#5F5F5F',
  },
  footer: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#0F0F0F',
  },
  footerText: {
    fontFamily: 'monospace',
    fontSize: 8,
    color: '#5F5F5F',
    letterSpacing: 2,
  },
});
