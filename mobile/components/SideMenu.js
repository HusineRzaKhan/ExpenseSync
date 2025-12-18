import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { ThemeContext } from '../theme';

export default function SideMenu({ onClose, onProfile, onToggleTheme, onLogout }) {
  const { theme } = useContext(ThemeContext);
  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>
      <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#111' : '#fff' }]}>
        <View style={styles.handle} />
        <TouchableOpacity style={styles.item} onPress={() => { onProfile(); onClose(); }}>
        <Text style={[styles.text, { color: theme === 'dark' ? '#fff' : '#000' }]}>Profile settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => { onToggleTheme(); }}>
        <Text style={[styles.text, { color: theme === 'dark' ? '#fff' : '#000' }]}>Change theme</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => { onLogout(); }}>
        <Text style={[styles.text, { color: '#c0392b' }]}>Logout</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <View style={styles.qrBlock}>
          <Text style={{ fontWeight: '700', marginBottom: 8, color: theme === 'dark' ? '#fff' : '#000' }}>Get the app</Text>
          <Text style={{ color: theme === 'dark' ? '#ccc' : '#666', marginBottom: 8 }}>Scan to download</Text>
          <QRCode value={'https://expo.dev/accounts/hussainrazakhan/projects/expensesync/builds/65b2dee0-91ac-48e8-99e9-3c1950807f27'} size={120} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  container: { position: 'absolute', right: 0, top: 0, bottom: 0, width: '70%', padding: 12, elevation: 6 },
  handle: { width: 40, height: 4, backgroundColor: '#ccc', borderRadius: 4, alignSelf: 'center', marginVertical: 8 },
  item: { paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
  text: { fontSize: 16 },
  separator: { height: 12 },
  qrBlock: { alignItems: 'center', marginTop: 8 }
});
