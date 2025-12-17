import React from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';

export default function ExpenseDetailModal({ item, onClose }) {
  if (!item) return null;
  return (
    <Modal visible={!!item} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>{item.notes || 'Expense Detail'}</Text>
        <Text>Amount: PKR {item.amount}</Text>
        <Text>Category: {item.category}</Text>
        <Text>Date: {new Date(item.date).toLocaleString()}</Text>
        <View style={{ marginTop: 12 }}>
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 16 }, title: { fontSize: 18, fontWeight: '700' } });
