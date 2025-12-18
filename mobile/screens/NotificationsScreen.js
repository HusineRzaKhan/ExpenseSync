import React, { useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../theme';

const sampleInit = [
  { id: '1', title: 'Expense recorded', body: 'Lunch recorded: PKR 250', read: false },
  { id: '2', title: 'Weekly summary', body: 'You spent PKR 8,230 this week', read: false },
  { id: '3', title: 'Profile updated', body: 'Your profile was updated', read: true },
];

export default function NotificationsScreen() {
  const [list, setList] = useState(sampleInit);
  const { theme } = useContext(ThemeContext);
  const onPress = (item) => {
    setList(l => l.map(x => x.id === item.id ? { ...x, read: true } : x));
  };
  return (
    <View style={{ flex: 1, padding: 12, backgroundColor: theme === 'dark' ? '#111' : '#f8fafc' }}>
      <FlatList data={list} keyExtractor={i => i.id} renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onPress(item)} style={{ padding: 12, backgroundColor: item.read ? (theme === 'dark' ? '#222' : '#f7f7f7') : (theme === 'dark' ? '#222' : '#fff'), marginBottom: 8, borderRadius: 8 }}>
          <Text style={{ fontWeight: '700', color: theme === 'dark' ? '#fff' : '#000' }}>{item.title}</Text>
          <Text style={{ color: theme === 'dark' ? '#ddd' : '#000' }}>{item.body}</Text>
        </TouchableOpacity>
      )} />
    </View>
  );
}
