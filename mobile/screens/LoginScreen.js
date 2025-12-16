import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

const API = 'http://<SERVER_IP>:5000/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const doLogin = async () => {
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      // store token locally in real app; pass to Home for demo
      navigation.replace('Home', { token: res.data.token });
    } catch (err) {
      Alert.alert('Login failed', err.response?.data?.message || err.message);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ marginBottom: 8 }} />
      <TextInput placeholder="Password" value={password} secureTextEntry onChangeText={setPassword} style={{ marginBottom: 8 }} />
      <Button title="Login" onPress={doLogin} />
    </View>
  );
}
