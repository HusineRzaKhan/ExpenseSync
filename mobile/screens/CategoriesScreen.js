import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ThemeContext } from '../theme';

export default function CategoriesScreen({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const categories = ['food','household','friends','personal','rent','fuel','loans','insurance','other'];
  return (
    <ScrollView style={{ flex: 1, padding: 12, backgroundColor: theme === 'dark' ? '#111' : '#f8fafc' }}>
      {categories.map(c => (
        <TouchableOpacity key={c} style={{ padding: 12, backgroundColor: theme === 'dark' ? '#222' : '#fff', marginBottom: 8, borderRadius: 8 }} onPress={() => navigation.navigate('CategoryList', { category: c })}>
          <Text style={{ fontWeight: '700', color: theme === 'dark' ? '#fff' : '#000' }}>{c.charAt(0).toUpperCase() + c.slice(1)}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
