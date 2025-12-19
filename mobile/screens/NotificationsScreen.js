import React, { useState, useContext, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from '../config';

export default function NotificationsScreen() {
  const [list, setList] = useState([]);
  const { theme } = useContext(ThemeContext);

  const loadNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setList([]);
        return;
      }
      const res = await axios.get(`${Config.API_URL}/notifications`, { headers: { Authorization: `Bearer ${token}` } });
      setList(res.data || []);
    } catch (err) {
      console.warn('Failed to load notifications', err.message);
      setList([]);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const onPress = async (item) => {
    // Don't mark as read if already read
    if (item.read) return;
    
    const itemId = item._id || item.id;
    
    // Optimistically update UI
    setList(l => l.map(x => (x._id || x.id) === itemId ? { ...x, read: true } : x));
    
    // Update in database
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        // Revert if no token
        loadNotifications();
        return;
      }
      const res = await axios.put(`${Config.API_URL}/notifications/${itemId}/read`, {}, { headers: { Authorization: `Bearer ${token}` } });
      
      // Refresh list to ensure sync with server
      if (res.data) {
        await loadNotifications();
      }
    } catch (e) { 
      console.warn('Mark read failed', e.message);
      // Revert on error by reloading
      loadNotifications();
    }
  };

  return (
    <View style={{ flex: 1, padding: 12, backgroundColor: theme === 'dark' ? '#111' : '#f8fafc' }}>
      {list.length === 0 ? (
        <Text style={{ color: theme === 'dark' ? '#ddd' : '#666' }}>No notifications</Text>
      ) : (
        <FlatList 
          data={list} 
          keyExtractor={item => String(item._id || item.id)} 
          renderItem={({ item }) => {
            const isRead = item.read === true;
            // Unread: brighter, Read: duller
            const bgColor = isRead 
              ? (theme === 'dark' ? '#1a1a1a' : '#f0f0f0')
              : (theme === 'dark' ? '#222' : '#fff');
            const titleColor = isRead
              ? (theme === 'dark' ? '#888' : '#666')
              : (theme === 'dark' ? '#fff' : '#000');
            const bodyColor = isRead
              ? (theme === 'dark' ? '#666' : '#888')
              : (theme === 'dark' ? '#ddd' : '#333');
            const opacity = isRead ? 0.6 : 1.0;
            
            return (
              <TouchableOpacity 
                onPress={() => onPress(item)} 
                style={{ 
                  padding: 12, 
                  backgroundColor: bgColor, 
                  marginBottom: 8, 
                  borderRadius: 8,
                  opacity: opacity,
                  borderLeftWidth: isRead ? 0 : 3,
                  borderLeftColor: isRead ? 'transparent' : (theme === 'dark' ? '#F6C23E' : '#023c69')
                }}
              >
                <Text style={{ fontWeight: '700', color: titleColor }}>{item.title}</Text>
                <Text style={{ color: bodyColor, marginTop: 4 }}>{item.body}</Text>
              </TouchableOpacity>
            );
          }} 
        />
      )}
    </View>
  );
}
