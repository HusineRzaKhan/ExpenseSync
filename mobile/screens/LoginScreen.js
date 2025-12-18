import React, { useState } from 'react';
import { View, TextInput, Button, Alert, Text, TouchableOpacity } from 'react-native';
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
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <AppBar showAvatar={false} title="Sign In" />
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, marginBottom: 8 }}>Sign In</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ marginBottom: 8 }} keyboardType="email-address" autoCapitalize="none" />
      <TextInput placeholder="Password" value={password} secureTextEntry onChangeText={setPassword} style={{ marginBottom: 8 }} />
      <Button title="Sign In" onPress={doLogin} />
      <TouchableOpacity style={{ marginTop: 12 }} onPress={() => navigation.navigate('Signup')}>
        <Text style={{ color: '#007bff' }}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}
