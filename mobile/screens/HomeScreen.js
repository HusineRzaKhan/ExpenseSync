import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import ExpenseCard from '../components/ExpenseCard';
import RecordModal from '../components/RecordModal';
import Config from '../config';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExpenseDetailModal from '../components/ExpenseDetailModal';
import { ThemeContext } from '../theme';

export default function HomeScreen({ navigation }) {
  const [records, setRecords] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [detail, setDetail] = useState(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    // load recent records (placeholder)
    async function load() {
      try {
        const res = await axios.get(`${Config.API_URL}/transactions`);
        setRecords(res.data || []);
      } catch (err) {
        // fallback to local sample
        setRecords([
          { _id: '1', amount: 250, category: 'food', notes: 'Lunch', date: new Date() },
          { _id: '2', amount: 1200, category: 'fuel', notes: 'Petrol', date: new Date() },
        ]);
      }
    }
    load();
  }, []);

  const onCreate = (rec) => {
    setRecords(r => [rec, ...r]);
    setModalVisible(false);
  };

  const onEdit = async (item) => {
    // open modal with item details for edit - simple inline prompt for demo
    const newNotes = prompt('Edit description', item.notes || '');
    if (newNotes == null) return;
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const res = await axios.put(`${Config.API_URL}/transactions/${item._id}`, { notes: newNotes }, { headers: { Authorization: `Bearer ${token}` } });
        setRecords(r => r.map(x => (x._id === item._id ? res.data : x)));
        return;
      }
    } catch (err) {
      console.warn(err.message);
    }
    setRecords(r => r.map(x => (x._id === item._id ? { ...x, notes: newNotes } : x)));
  };

  const onDelete = async (item) => {
    Alert.alert('Delete', 'Delete this record?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (token) {
            await axios.delete(`${Config.API_URL}/transactions/${item._id}`, { headers: { Authorization: `Bearer ${token}` } });
            setRecords(r => r.filter(x => x._id !== item._id));
            return;
          }
        } catch (err) { console.warn(err.message); }
        setRecords(r => r.filter(x => x._id !== item._id));
      }}
    ]);
  };

  return (
    <View style={[styles.container, theme === 'dark' && styles.dark]}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.newBtn}>
          <Text style={styles.newBtnText}>+ New Record</Text>
        </TouchableOpacity>
      </View>

      <FlatList data={records} keyExtractor={i => i._id} renderItem={({ item }) => <ExpenseCard item={item} onPress={() => setDetail(item)} onEdit={onEdit} onDelete={onDelete} />} contentContainerStyle={{ padding: 12 }} />

      <RecordModal visible={modalVisible} onClose={() => setModalVisible(false)} onCreate={onCreate} />
      <ExpenseDetailModal item={detail} onClose={() => setDetail(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  dark: { backgroundColor: '#111' },
  header: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700' },
  newBtn: { backgroundColor: '#f6c23e', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  newBtnText: { fontWeight: '600' },
});
