import React, { useState, useContext } from 'react';
import { View, TextInput, Button, Alert, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { ThemeContext } from '../theme';
import AppBar from '../components/AppBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Config from '../config';

const API = Config.API_URL;

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
  return re.test(String(email).toLowerCase());
}

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const doLogin = async () => {
    if (!validateEmail(email)) return Alert.alert('Invalid email');
    if (!password) return Alert.alert('Enter password');
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      const token = res.data.token;
      await AsyncStorage.setItem('token', token);
      navigation.replace('Main');
    } catch (err) {
      Alert.alert('Login failed', err.response?.data?.message || 'Network error');
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: useContext(ThemeContext).theme === 'dark' ? '#111' : '#f1f6fb' }]}>
      <AppBar showAvatar={false} />
      <View style={styles.center}>
        <View style={[styles.card, { backgroundColor: useContext(ThemeContext).theme === 'dark' ? '#222' : '#fff' }]}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
          <Text style={styles.heading}>Sign In</Text>
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
          <TextInput placeholder="Password" value={password} secureTextEntry onChangeText={setPassword} style={styles.input} />
          <View style={{ marginTop: 8 }}>
            <Button title="Sign In" onPress={doLogin} />
          </View>
          <TouchableOpacity style={{ marginTop: 12, alignSelf: 'center' }} onPress={() => navigation.navigate('Signup')}>
            <Text style={{ color: '#007bff' }}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f1f6fb' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { width: '90%', maxWidth: 420, padding: 20, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 20, elevation: 6, alignItems: 'stretch' },
  logo: { width: 84, height: 84, alignSelf: 'center', marginBottom: 12, borderRadius: 12 },
  heading: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 12 },
  input: { marginBottom: 12, borderWidth: 1, borderColor: '#e6ecf1', padding: 10, borderRadius: 8 },
});
