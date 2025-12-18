import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text } from 'react-native';
import AppBar from '../components/AppBar';
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
      // do not auto-login; show success and go to sign in
      Alert.alert('Success', 'Account created. Please sign in.', [{ text: 'OK', onPress: () => navigation.replace('Login') }]);
    } catch (err) {
      Alert.alert('Signup failed', err.response?.data?.message || 'Network error');
    }
  };

  const pwCheck = validatePassword(password);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AppBar showAvatar={false} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: '90%', maxWidth: 420, padding: 16 }}>
          <Text style={{ fontSize: 20, marginBottom: 12, textAlign: 'center' }}>Sign Up</Text>
          <TextInput placeholder="Full name" value={name} onChangeText={setName} style={{ marginBottom: 12, borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6 }} />
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ marginBottom: 12, borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6 }} keyboardType="email-address" autoCapitalize="none" />
          <TextInput placeholder="Password" value={password} secureTextEntry onChangeText={setPassword} style={{ marginBottom: 8, borderWidth: 1, borderColor: '#ddd', padding: 8, borderRadius: 6 }} />
          <Text style={{ marginTop: 8 }}>Password rules:</Text>
          <Text>- Minimum 8 characters: {pwCheck.length ? '✓' : '✗'}</Text>
          <Text>- Uppercase letter: {pwCheck.upper ? '✓' : '✗'}</Text>
          <Text>- Lowercase letter: {pwCheck.lower ? '✓' : '✗'}</Text>
          <Text>- Number: {pwCheck.number ? '✓' : '✗'}</Text>
          <Text>- Special character: {pwCheck.special ? '✓' : '✗'}</Text>
          <Button title="Sign Up" onPress={doSignup} />
        </View>
      </View>
    </View>
  );
}
