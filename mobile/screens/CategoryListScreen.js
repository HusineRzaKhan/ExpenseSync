import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { ThemeContext } from '../theme';
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

  const { theme } = useContext(ThemeContext);
  return (
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#111' : '#fff' }]}>
      <Text style={[styles.title, { color: theme === 'dark' ? '#fff' : '#000' }]}>{category} expenses</Text>
      <FlatList data={items} keyExtractor={i => i._id} renderItem={({ item }) => (
        <View style={[styles.row, { backgroundColor: theme === 'dark' ? '#222' : '#fff' }]}><Text style={{ fontWeight: '700', color: theme === 'dark' ? '#fff' : '#000' }}>{item.notes}</Text><Text style={{ color: theme === 'dark' ? '#ddd' : '#000' }}>PKR {item.amount}</Text></View>
      )} />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 12 }, title: { fontSize: 20, fontWeight: '700', marginBottom: 8 }, row: { padding: 12, borderRadius: 8, marginBottom: 8 } });
