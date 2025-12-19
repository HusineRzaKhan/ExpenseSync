import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ThemeContext } from '../theme';
import axios from 'axios';
import Config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

export default function ProfileScreen({ onClose }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const pick = async () => {
    const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!res.granted) return Alert.alert('Permission required');
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!r.cancelled) setImage(r.uri);
  };

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;
        const res = await axios.get(`${Config.API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
        const u = res.data || {};
        setName(u.name || '');
        setEmail(u.email || '');
      } catch (err) {
        console.warn('Failed to load profile', err.message);
      }
    })();
  }, []);

  const save = async () => {
    try {
      // validations
      if (!name) return Alert.alert('Name required');
      if (!name.trim()) return Alert.alert('Name cannot be empty');
      // Check for invalid characters: only letters, spaces, and dashes allowed
      if (!/^[a-zA-Z\s\-]+$/.test(name.trim())) {
        return Alert.alert('Invalid name', 'Name can only contain letters, spaces, and dashes (-)');
      }
      const emailRe = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
      if (!emailRe.test(String(email).toLowerCase())) return Alert.alert('Invalid email');
      if (password) {
        const length = password.length >= 8;
        const upper = /[A-Z]/.test(password);
        const lower = /[a-z]/.test(password);
        const number = /[0-9]/.test(password);
        const special = /[^A-Za-z0-9]/.test(password);
        if (!(length && upper && lower && number && special)) return Alert.alert('Password must be 8+ chars and include upper, lower, number and special char');
      }
      const token = await AsyncStorage.getItem('token');
      const body = { name, email, password };
      if (token) {
        const res = await axios.put(`${Config.API_URL}/auth/profile`, body, { headers: { Authorization: `Bearer ${token}` } });
        const u = res.data || {};
        setName(u.name || name);
        setEmail(u.email || email);
        Alert.alert('Saved', 'Profile updated');
      } else {
        Alert.alert('Saved (local)', 'No token found');
      }
      if (onClose) onClose();
    } catch (err) {
      console.warn(err.message);
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const bg = theme === 'dark' ? '#111' : '#fff';
  const textColor = theme === 'dark' ? '#fff' : '#000';
  const labelColor = theme === 'dark' ? '#ddd' : '#333';
  const inputBorder = theme === 'dark' ? '#444' : '#ddd';
  const placeholderColor = theme === 'dark' ? '#999' : '#666';

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: bg }}>
      <View style={{ alignItems: 'center', marginBottom: 12 }}>
        <TouchableOpacity onPress={pick}>
          <Image source={{ uri: image || 'https://i.pravatar.cc/150' }} style={{ width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: theme === 'dark' ? '#333' : '#eee' }} />
        </TouchableOpacity>
      </View>
      <Text style={{ color: labelColor, marginBottom: 4 }}>Full name</Text>
      <TextInput 
        value={name} 
        onChangeText={(text) => {
          // Only allow letters, spaces, and dashes
          const filtered = text.replace(/[^a-zA-Z\s\-]/g, '');
          setName(filtered);
        }} 
        style={[styles.input, { color: textColor, borderColor: inputBorder }]} 
        placeholderTextColor={placeholderColor}
        placeholder="Enter your full name"
      />
      <Text style={{ color: labelColor, marginBottom: 4 }}>Email</Text>
      <TextInput value={email} onChangeText={setEmail} style={[styles.input, { color: textColor, borderColor: inputBorder }]} keyboardType="email-address" placeholderTextColor={placeholderColor} />
      <Text style={{ color: labelColor, marginBottom: 4 }}>Change password</Text>
      <TextInput value={password} onChangeText={setPassword} style={[styles.input, { color: textColor, borderColor: inputBorder }]} secureTextEntry placeholderTextColor={placeholderColor} />

      <View style={{ marginTop: 12 }}>
        <Button title="Save" onPress={save} />
        <View style={{ height: 8 }} />
        <Button title="Close" onPress={onClose} color="#888" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({ input: { borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6, marginBottom: 8 } });
