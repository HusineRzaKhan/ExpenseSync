import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';

export default function SideMenu({ onClose, onProfile, onToggleTheme, onLogout }) {
  return (
    <Modal transparent animationType="fade" visible onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>
      <View style={styles.container}>
        <View style={styles.handle} />
        <TouchableOpacity style={styles.item} onPress={() => { onProfile(); onClose(); }}>
          <Text style={styles.text}>Profile settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => { onToggleTheme(); }}>
          <Text style={styles.text}>Change theme</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => { onLogout(); }}>
          <Text style={[styles.text, { color: '#c0392b' }]}>Logout</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <View style={styles.qrBlock}>
          <Text style={{ fontWeight: '700', marginBottom: 8 }}>Get the app</Text>
          <Text style={{ color: '#666' }}>Scan to download the app (placeholder)</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  container: { position: 'absolute', right: 0, top: 0, bottom: 0, width: '70%', backgroundColor: '#fff', padding: 12, elevation: 6 },
  handle: { width: 40, height: 4, backgroundColor: '#ccc', borderRadius: 4, alignSelf: 'center', marginVertical: 8 },
  item: { paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
  text: { fontSize: 16 },
  separator: { height: 12 },
  qrBlock: { alignItems: 'center', marginTop: 8 }
});
