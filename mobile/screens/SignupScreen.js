import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Alert, Text, Image, StyleSheet } from 'react-native';
import { ThemeContext } from '../theme';
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

  const { theme } = useContext(ThemeContext);
  return (
    <View style={[styles.screen, { backgroundColor: theme === 'dark' ? '#111' : '#f1f6fb' }]}>
      <AppBar showAvatar={false} />
      <View style={styles.center}>
        <View style={[styles.card, { backgroundColor: theme === 'dark' ? '#222' : '#fff' }] }>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
          <Text style={styles.heading}>Create Account</Text>
          <TextInput placeholder="Full name" value={name} onChangeText={setName} style={styles.input} />
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
          <TextInput placeholder="Password" value={password} secureTextEntry onChangeText={setPassword} style={styles.input} />
          <Text style={{ marginBottom: 8, color: '#666' }}>Password rules shown below</Text>
          <Text>- Minimum 8 characters: {pwCheck.length ? '✓' : '✗'}</Text>
          <Text>- Uppercase letter: {pwCheck.upper ? '✓' : '✗'}</Text>
          <Text>- Lowercase letter: {pwCheck.lower ? '✓' : '✗'}</Text>
          <Text>- Number: {pwCheck.number ? '✓' : '✗'}</Text>
          <Text>- Special character: {pwCheck.special ? '✓' : '✗'}</Text>
          <View style={{ marginTop: 12 }}>
            <Button title="Sign Up" onPress={doSignup} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f1f6fb' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { width: '90%', maxWidth: 520, padding: 20, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 20, elevation: 6 },
  logo: { width: 84, height: 84, alignSelf: 'center', marginBottom: 12, borderRadius: 12 },
  heading: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
  input: { marginBottom: 12, borderWidth: 1, borderColor: '#e6ecf1', padding: 10, borderRadius: 8 },
});
