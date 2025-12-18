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
  const [editing, setEditing] = useState(null);
  const [detail, setDetail] = useState(null);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    // load recent records (placeholder)
    async function load() {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          setRecords([]);
          return;
        }
        const res = await axios.get(`${Config.API_URL}/transactions`, { headers: { Authorization: `Bearer ${token}` } });
        setRecords(res.data || []);
      } catch (err) {
        // on error, show empty list (no demo data for new users)
        setRecords([]);
      }
    }
    load();
  }, []);

  const onCreate = (rec) => {
    setRecords(r => [rec, ...r]);
    setModalVisible(false);
  };

  const onUpdate = (rec) => {
    setRecords(r => r.map(x => (x._id === rec._id ? rec : x)));
    setEditing(null);
    setModalVisible(false);
  };

  const onEdit = (item) => {
    // open modal in edit mode
    setEditing(item);
    setModalVisible(true);
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
    <View style={[styles.container, { backgroundColor: theme === 'dark' ? '#111' : '#fff' }] }>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme === 'dark' ? '#fff' : '#000' }]}>Home</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.newBtn, { backgroundColor: theme === 'dark' ? '#f6c23e' : '#f6c23e' }]}>
          <Text style={[styles.newBtnText, { color: theme === 'dark' ? '#000' : '#000' }]}>+ New Record</Text>
        </TouchableOpacity>
      </View>

      {records.length === 0 ? (
        <View style={{ padding: 24, alignItems: 'center' }}>
          <Text style={{ color: theme === 'dark' ? '#ddd' : '#444', fontSize: 16 }}>No records yet. Tap "+ New Record" to add one.</Text>
        </View>
      ) : (
        <FlatList data={records} keyExtractor={i => i._id} renderItem={({ item }) => <ExpenseCard item={item} onPress={() => setDetail(item)} onEdit={onEdit} onDelete={onDelete} />} contentContainerStyle={{ padding: 12 }} />
      )}

      <RecordModal visible={modalVisible} onClose={() => setModalVisible(false)} onCreate={onCreate} />
      <ExpenseDetailModal item={detail} onClose={() => setDetail(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700' },
  newBtn: { backgroundColor: '#f6c23e', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
  newBtnText: { fontWeight: '600' },
});
