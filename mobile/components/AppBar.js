import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { ThemeContext } from '../theme';

export default function AppBar({ onAvatarPress }) {
  const { theme } = useContext(ThemeContext);
  return (
    <SafeAreaView style={[styles.safe, theme === 'dark' && { backgroundColor: '#111' }]}>
      <View style={[styles.bar, theme === 'dark' && { backgroundColor: '#333' }]}>
        <Text style={styles.title}>Expense Sync</Text>
        <TouchableOpacity onPress={onAvatarPress}>
          <Image source={{ uri: 'https://i.pravatar.cc/100' }} style={styles.avatar} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: '#F6C23E' },
  bar: { height: 56, backgroundColor: '#F6C23E', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12 },
  title: { fontSize: 20, fontWeight: '700' },
  avatar: { width: 40, height: 40, borderRadius: 20 }
});
