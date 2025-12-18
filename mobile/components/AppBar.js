import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { ThemeContext } from '../theme';

export default function AppBar({ onAvatarPress, showAvatar = true }) {
  const { theme } = useContext(ThemeContext);
  const bgSafe = theme === 'dark' ? '#0b0b0b' : '#F6C23E';
  const barBg = theme === 'dark' ? '#111' : '#F6C23E';
  const titleColor = theme === 'dark' ? '#fff' : '#000';
  return (
    <View style={[styles.safe, { backgroundColor: bgSafe }, Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight }]}>
      <View style={[styles.bar, { backgroundColor: barBg }]}>
        <Text style={[styles.title, { color: titleColor }]}>Expense Sync</Text>
        {showAvatar ? (
          <TouchableOpacity onPress={onAvatarPress}>
            <Image source={{ uri: 'https://i.pravatar.cc/100' }} style={styles.avatar} />
          </TouchableOpacity>
        ) : null}
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
