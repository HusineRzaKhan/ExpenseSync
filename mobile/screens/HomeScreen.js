import React from 'react';
import { View, Text, Button } from 'react-native';
import QRShare from '../components/QRShare';

export default function HomeScreen({ route, navigation }) {
  const token = route.params?.token;
  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 12 }}>Welcome to ExpenseSync</Text>
      <Button title="Record Expense" onPress={() => navigation.navigate('Record', { token })} />
      <View style={{ marginTop: 24 }}>
        <QRShare url={'https://example.com/download/expensesync'} />
      </View>
    </View>
  );
}
