import React, { useContext } from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import { ThemeContext } from '../theme';

export default function ExpenseDetailModal({ item, onClose }) {
  const { theme } = useContext(ThemeContext);
  if (!item) return null;
  const bg = theme === 'dark' ? '#111' : '#fff';
  const textColor = theme === 'dark' ? '#fff' : '#000';
  const labelColor = theme === 'dark' ? '#ddd' : '#333';
  return (
    <Modal visible={!!item} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: bg }] }>
        <Text style={[styles.title, { color: textColor }]}>{item.notes || 'Expense Detail'}</Text>
        <Text style={{ color: labelColor }}>Amount: <Text style={{ color: textColor }}>PKR {item.amount}</Text></Text>
        <Text style={{ color: labelColor }}>Category: <Text style={{ color: textColor }}>{item.category}</Text></Text>
        <Text style={{ color: labelColor }}>Date: <Text style={{ color: textColor }}>{new Date(item.date).toLocaleString()}</Text></Text>
        <View style={{ marginTop: 12 }}>
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 }, title: { fontSize: 18, fontWeight: '700' } });
