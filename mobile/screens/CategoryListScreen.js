import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import Config from '../config';

export default function CategoryListScreen({ route }) {
  const { category } = route.params || {};
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(`${Config.API_URL}/transactions`);
        const filtered = (res.data || []).filter(r => (r.category || '').toLowerCase() === (category || '').toLowerCase());
        setItems(filtered);
      } catch (err) {
        setItems([]);
      }
    }
    load();
  }, [category]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category} expenses</Text>
      <FlatList data={items} keyExtractor={i => i._id} renderItem={({ item }) => (
        <View style={styles.row}><Text style={{ fontWeight: '700' }}>{item.notes}</Text><Text>PKR {item.amount}</Text></View>
      )} />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 12 }, title: { fontSize: 20, fontWeight: '700', marginBottom: 8 }, row: { padding: 12, borderRadius: 8, backgroundColor: '#fff', marginBottom: 8 } });
