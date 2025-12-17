import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text } from 'react-native';
import axios from 'axios';
import Config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = Config.API_URL;

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
  return re.test(String(email).toLowerCase());
}

function validatePassword(pw) {
  const length = pw.length >= 8;
  const upper = /[A-Z]/.test(pw);
  const lower = /[a-z]/.test(pw);
  const number = /[0-9]/.test(pw);
  const special = /[^A-Za-z0-9]/.test(pw);
  return { ok: length && upper && lower && number && special, length, upper, lower, number, special };
}

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const doSignup = async () => {
    if (!name) return Alert.alert('Enter name');
    if (!validateEmail(email)) return Alert.alert('Invalid email');
    const resPw = validatePassword(password);
    if (!resPw.ok) return Alert.alert('Password must be at least 8 chars and include upper, lower, number, special');
    try {
      const r = await axios.post(`${API}/auth/signup`, { name, email, password });
      const token = r.data.token;
      await AsyncStorage.setItem('token', token);
      navigation.replace('Main');
    } catch (err) {
      Alert.alert('Signup failed', err.response?.data?.message || 'Network error');
    }
  };

  const pwCheck = validatePassword(password);

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 8 }}>Sign Up</Text>
      <TextInput placeholder="Full name" value={name} onChangeText={setName} style={{ marginBottom: 8 }} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ marginBottom: 8 }} keyboardType="email-address" autoCapitalize="none" />
      <TextInput placeholder="Password" value={password} secureTextEntry onChangeText={setPassword} style={{ marginBottom: 8 }} />
      <Text>Password rules:</Text>
      <Text>- Minimum 8 characters: {pwCheck.length ? '✓' : '✗'}</Text>
      <Text>- Uppercase letter: {pwCheck.upper ? '✓' : '✗'}</Text>
      <Text>- Lowercase letter: {pwCheck.lower ? '✓' : '✗'}</Text>
      <Text>- Number: {pwCheck.number ? '✓' : '✗'}</Text>
      <Text>- Special character: {pwCheck.special ? '✓' : '✗'}</Text>
      <Button title="Sign up" onPress={doSignup} />
    </View>
  );
}
