import React, { useState, useEffect, useContext } from 'react';
import { Modal, View, Text, TextInput, Button, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { ThemeContext } from '../theme';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from '../config';

export default function RecordModal({ visible, onClose, onCreate, initial, onUpdate }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('PKR');
  const [method, setMethod] = useState('cash');
  const [category, setCategory] = useState('Other');
  const [date, setDate] = useState(new Date());
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (initial) {
      setName(initial.name || '');
      setDesc(initial.notes || '');
      setAmount(initial.amount ? String(initial.amount) : '');
      setCategory(initial.category ? initial.category.charAt(0).toUpperCase() + initial.category.slice(1) : 'Other');
      setDate(initial.date ? new Date(initial.date) : new Date());
      setImage(initial.image || null);
    }
  }, [initial]);

  const pickImage = async () => {
    const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!res.granted) return alert('Permission required');
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!r.cancelled) setImage(r.uri);
  };

  const { theme } = useContext(ThemeContext);
  const bg = theme === 'dark' ? '#111' : '#fff';
  const textColor = theme === 'dark' ? '#fff' : '#000';
  const labelColor = theme === 'dark' ? '#ddd' : '#333';
  const inputBorder = theme === 'dark' ? '#444' : '#ddd';
  const placeholderColor = theme === 'dark' ? '#999' : '#666';

  const submit = async () => {
    if (!amount) return alert('Enter amount');
    const cleaned = String(amount).trim();
    if (!/^[0-9]+(\.[0-9]{1,2})?$/.test(cleaned)) return alert('Amount must be a number');
    const token = await AsyncStorage.getItem('token');
    const body = { name, notes: desc, amount: Number(amount), category: category.toLowerCase(), date };
    try {
      if (initial && onUpdate) {
        // update flow
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const res = await axios.put(`${Config.API_URL}/transactions/${initial._id}`, body, { headers: { Authorization: `Bearer ${token}` } });
          onUpdate(res.data);
          return;
        }
        onUpdate({ ...initial, ...body, _id: initial._id });
        return;
      }
      if (token) {
        const res = await axios.post(`${Config.API_URL}/transactions`, body, { headers: { Authorization: `Bearer ${token}` } });
        onCreate(res.data);
        return;
      }
      const rec = { _id: Date.now().toString(), name, notes: desc, amount: Number(amount), category: category.toLowerCase(), date: date };
      onCreate(rec);
      return;
    } catch (err) {
      console.warn('Record submit failed', err.message);
      alert('Failed to save record');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: bg }] }>
        <Text style={[styles.title, { color: textColor }]}>{initial ? 'Edit Record' : 'New Record'}</Text>
        <TextInput placeholder="Name (optional)" placeholderTextColor={placeholderColor} value={name} onChangeText={setName} style={[styles.input, { color: textColor, borderColor: inputBorder }]} />
        <TextInput placeholder="Description" placeholderTextColor={placeholderColor} value={desc} onChangeText={setDesc} style={[styles.input, { color: textColor, borderColor: inputBorder }]} />
          <TextInput placeholder="Amount" placeholderTextColor={placeholderColor} value={amount} onChangeText={t => setAmount(t.replace(/[^0-9.]/g, ''))} keyboardType="numeric" style={[styles.input, { color: textColor, borderColor: inputBorder }]} />
          <Text style={{ marginTop: 6, color: labelColor }}>Currency</Text>
          <Picker selectedValue={currency} onValueChange={setCurrency} style={{ marginBottom: 8, color: textColor }} itemStyle={{ color: textColor }}>
            <Picker.Item label="PKR" value="PKR" color={Platform.OS === 'android' ? (theme === 'dark' ? '#000' : textColor) : textColor} />
            <Picker.Item label="USD" value="USD" color={Platform.OS === 'android' ? (theme === 'dark' ? '#000' : textColor) : textColor} />
            <Picker.Item label="GBP" value="GBP" color={Platform.OS === 'android' ? (theme === 'dark' ? '#000' : textColor) : textColor} />
          </Picker>
          <Text style={{ marginTop: 6, color: labelColor }}>Payment method</Text>
          <Picker selectedValue={method} onValueChange={setMethod} style={{ marginBottom: 8, color: textColor }} itemStyle={{ color: textColor }}>
            <Picker.Item label="Cash" value="cash" color={Platform.OS === 'android' ? (theme === 'dark' ? '#000' : textColor) : textColor} />
            <Picker.Item label="Card/Online" value="online" color={Platform.OS === 'android' ? (theme === 'dark' ? '#000' : textColor) : textColor} />
          </Picker>
          <Text style={{ marginTop: 6, color: labelColor }}>Category</Text>
          <Picker selectedValue={category} onValueChange={setCategory} style={{ marginBottom: 8, color: textColor }} itemStyle={{ color: textColor }}>
            <Picker.Item label="Food" value="Food" color={Platform.OS === 'android' ? (theme === 'dark' ? '#000' : textColor) : textColor} />
            <Picker.Item label="Household" value="Household" color={Platform.OS === 'android' ? (theme === 'dark' ? '#000' : textColor) : textColor} />
            <Picker.Item label="Friends" value="Friends" color={Platform.OS === 'android' ? (theme === 'dark' ? '#000' : textColor) : textColor} />
            <Picker.Item label="Personal" value="Personal" color={Platform.OS === 'android' ? (theme === 'dark' ? '#000' : textColor) : textColor} />
            <Picker.Item label="Rent" value="Rent" color={Platform.OS === 'android' ? (theme === 'dark' ? '#000' : textColor) : textColor} />
            <Picker.Item label="Fuel" value="Fuel" color={Platform.OS === 'android' ? (theme === 'dark' ? '#000' : textColor) : textColor} />
            <Picker.Item label="Loans" value="Loans" color={Platform.OS === 'android' ? (theme === 'dark' ? '#000' : textColor) : textColor} />
            <Picker.Item label="Insurance" value="Insurance" color={Platform.OS === 'android' ? (theme === 'dark' ? '#000' : textColor) : textColor} />
            <Picker.Item label="Other" value="Other" color={Platform.OS === 'android' ? (theme === 'dark' ? '#000' : textColor) : textColor} />
          </Picker>
        <Text style={{ marginTop: 6, color: labelColor }}>Date (ISO)</Text>
        <TextInput value={date instanceof Date ? date.toISOString() : String(date)} onChangeText={t => setDate(new Date(t))} style={[styles.input, { color: textColor, borderColor: inputBorder }]} placeholderTextColor={placeholderColor} />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button title="Pick Image" onPress={pickImage} />
        </View>
        <View style={{ marginTop: 12 }}>
          <Button title="Save" onPress={submit} />
          <View style={{ height: 8 }} />
          <Button title="Cancel" onPress={onClose} color="#888" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 8, marginBottom: 8, borderRadius: 6 },
});
