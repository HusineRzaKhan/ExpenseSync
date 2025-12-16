import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

const API = 'http://<SERVER_IP>:5000/api';

export default function RecordExpenseScreen({ route }) {
  const token = route.params?.token;
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('other');

  const submit = async () => {
    try {
      await axios.post(`${API}/transactions`, { amount: Number(amount), category }, { headers: { Authorization: `Bearer ${token}` } });
      Alert.alert('Saved', 'Expense recorded');
    } catch (err) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput placeholder="Amount" value={amount} onChangeText={setAmount} keyboardType="numeric" style={{ marginBottom: 8 }} />
      <TextInput placeholder="Category" value={category} onChangeText={setCategory} style={{ marginBottom: 8 }} />
      <Button title="Save" onPress={submit} />
    </View>
  );
}
