import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { ThemeContext } from '../theme';

export default function AppBar({ onAvatarPress }) {
  const { theme } = useContext(ThemeContext);
  return (
    <View style={[styles.safe, theme === 'dark' && { backgroundColor: '#111' }, Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight }]}>
      <View style={[styles.bar, theme === 'dark' && { backgroundColor: '#333' }]}>
        <Text style={styles.title}>Expense Sync</Text>
        <TouchableOpacity onPress={onAvatarPress}>
          <Image source={{ uri: 'https://i.pravatar.cc/100' }} style={styles.avatar} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: '#F6C23E' },
  bar: { height: 56, backgroundColor: '#F6C23E', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  title: { fontSize: 20, fontWeight: '700' },
  avatar: { width: 40, height: 40, borderRadius: 20 }
});
