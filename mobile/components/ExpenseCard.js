import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useContext } from 'react';
import { ThemeContext } from '../theme';

export default function ExpenseCard({ item, onPress, onEdit, onDelete }) {
  const { theme } = useContext(ThemeContext);
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {item.image ? <Image source={{ uri: item.image }} style={styles.image} /> : <View style={[styles.image, { backgroundColor: '#f0f0f0' }]} />}
      <View style={styles.body}>
        <Text style={{ fontWeight: '700', color: theme === 'dark' ? '#fff' : '#000' }}>{item.name || item.category}</Text>
        <Text style={{ color: theme === 'dark' ? '#ddd' : '#666' }}>{item.notes}</Text>
      </View>
      <View style={styles.right}>
        <Text style={{ fontWeight: '700', color: theme === 'dark' ? '#fff' : '#000' }}>PKR {item.amount}</Text>
        <View style={{ height: 8 }} />
        <TouchableOpacity onPress={() => onEdit && onEdit(item)}><Text style={{ color: '#007bff' }}>Edit</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete && onDelete(item)}><Text style={{ color: '#c0392b' }}>Delete</Text></TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', marginBottom: 12, borderRadius: 8, overflow: 'hidden', elevation: 2 },
  image: { width: 120, height: 80 },
  body: { padding: 8, flex: 1, justifyContent: 'center' },
  title: { fontWeight: '700' },
  desc: { color: '#666' },
  amountWrap: { justifyContent: 'center', padding: 8 },
  amount: { fontWeight: '700' },
});
