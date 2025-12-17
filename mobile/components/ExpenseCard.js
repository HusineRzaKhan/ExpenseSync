import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function ExpenseCard({ item, onPress, onEdit, onDelete }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: 'https://picsum.photos/200/120' }} style={styles.image} />
      <View style={styles.body}>
        <Text style={styles.title}>{item.notes || 'Expense'}</Text>
        <Text style={styles.desc}>{item.category}</Text>
      </View>
      <View style={styles.amountWrap}>
        <Text style={styles.amount}>PKR {item.amount}</Text>
        <View style={{ height: 8 }} />
        <TouchableOpacity onPress={() => onEdit && onEdit(item)}>
          <Text style={{ color: '#007bff' }}>Edit</Text>
        </TouchableOpacity>
        <View style={{ height: 4 }} />
        <TouchableOpacity onPress={() => onDelete && onDelete(item)}>
          <Text style={{ color: '#ff3333' }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: '#fff', marginBottom: 12, borderRadius: 8, overflow: 'hidden', elevation: 2 },
  image: { width: 120, height: 80 },
  body: { padding: 8, flex: 1, justifyContent: 'center' },
  title: { fontWeight: '700' },
  desc: { color: '#666' },
  amountWrap: { justifyContent: 'center', padding: 8 },
  amount: { fontWeight: '700' },
});
