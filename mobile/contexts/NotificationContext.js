import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from '../config';

export const NotificationContext = createContext({
  unreadCount: 0,
  refreshNotifications: () => {},
});

export function NotificationProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setUnreadCount(0);
        return;
      }
      const res = await axios.get(`${Config.API_URL}/notifications`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      const notifications = res.data || [];
      const unread = notifications.filter(n => !n.read || n.read === false).length;
      setUnreadCount(unread);
    } catch (err) {
      console.warn('Failed to refresh notifications', err.message);
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    refreshNotifications();
    // Refresh every 30 seconds
    const interval = setInterval(refreshNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider value={{ unreadCount, refreshNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

