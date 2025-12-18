import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { ThemeContext } from '../theme';

export default function CustomPicker({ value, onValueChange, items = [], style }) {
  const { theme } = useContext(ThemeContext);
  const [open, setOpen] = useState(false);
  const bg = theme === 'dark' ? '#0b0b0b' : '#fff';
  const itemBg = theme === 'dark' ? '#111' : '#fff';
  const textColor = theme === 'dark' ? '#fff' : '#000';

  const selectedLabel = items.find(i => i.value === value)?.label || '';

  return (
    <>
      <TouchableOpacity onPress={() => setOpen(true)} style={[styles.button, { backgroundColor: bg }, style]}>
        <Text style={{ color: textColor }}>{selectedLabel}</Text>
      </TouchableOpacity>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.backdrop} onPress={() => setOpen(false)} activeOpacity={1}>
          <View style={[styles.sheet, { backgroundColor: bg }] }>
            <FlatList data={items} keyExtractor={i => String(i.value)} renderItem={({ item }) => (
              <TouchableOpacity onPress={() => { onValueChange(item.value); setOpen(false); }} style={[styles.item, { backgroundColor: itemBg }] }>
                <Text style={{ color: textColor }}>{item.label}</Text>
              </TouchableOpacity>
            )} />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: { padding: 8, borderRadius: 6, borderWidth: 1, borderColor: '#333' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 },
  sheet: { maxHeight: '60%', borderRadius: 8, overflow: 'hidden' },
  item: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#222' }
});
