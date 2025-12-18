import React, { useState, useContext, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from '../config';

export default function NotificationsScreen() {
  const [list, setList] = useState([]);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    async function load() {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          setList([]);
          return;
        }
        const res = await axios.get(`${Config.API_URL}/notifications`, { headers: { Authorization: `Bearer ${token}` } });
        setList(res.data || []);
      } catch (err) {
        setList([]);
      }
    }
    load();
  }, []);

  const onPress = (item) => {
    setList(l => l.map(x => x.id === item.id ? { ...x, read: true } : x));
  };

  return (
    <View style={{ flex: 1, padding: 12, backgroundColor: theme === 'dark' ? '#111' : '#f8fafc' }}>
      {list.length === 0 ? (
        <Text style={{ color: theme === 'dark' ? '#ddd' : '#666' }}>No notifications</Text>
      ) : (
        <FlatList data={list} keyExtractor={i => i.id} renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onPress(item)} style={{ padding: 12, backgroundColor: item.read ? (theme === 'dark' ? '#222' : '#f7f7f7') : (theme === 'dark' ? '#222' : '#fff'), marginBottom: 8, borderRadius: 8 }}>
            <Text style={{ fontWeight: '700', color: theme === 'dark' ? '#fff' : '#000' }}>{item.title}</Text>
            <Text style={{ color: theme === 'dark' ? '#ddd' : '#000' }}>{item.body}</Text>
          </TouchableOpacity>
        )} />
      )}
    </View>
  );
}
