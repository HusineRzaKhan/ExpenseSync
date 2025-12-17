import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function CategoriesScreen({ navigation }) {
  const categories = ['food','household','friends','personal','rent','fuel','loans','insurance','other'];
  return (
    <ScrollView style={{ flex: 1, padding: 12 }}>
      {categories.map(c => (
        <TouchableOpacity key={c} style={{ padding: 12, backgroundColor: '#fff', marginBottom: 8, borderRadius: 8 }} onPress={() => navigation.navigate('CategoryList', { category: c })}>
          <Text style={{ fontWeight: '700' }}>{c.charAt(0).toUpperCase() + c.slice(1)}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
