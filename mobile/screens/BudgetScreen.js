import React, { useState, useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { ThemeContext } from '../theme';
import { LineChart } from 'react-native-chart-kit';
import { Share } from 'react-native';
import axios from 'axios';
import Config from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import AppBar from '../components/AppBar';
import { TextInput } from 'react-native';

export default function BudgetScreen() {
  const { theme } = useContext(ThemeContext);
  const [days, setDays] = useState(7);
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 6); return d.toISOString().slice(0,10);
  });
  const [toDate, setToDate] = useState(new Date().toISOString().slice(0,10));
  const data = {
    labels: Array.from({ length: days }, (_, i) => `${i+1}`),
    datasets: [ { data: Array.from({ length: days }, () => Math.floor(Math.random()*1000)) } ]
  };

  return (
    <View style={{ flex: 1, padding: 12, backgroundColor: theme === 'dark' ? '#111' : '#fff' }}>
      <Text style={{ fontSize: 18, color: theme === 'dark' ? '#fff' : '#000' }}>Budget Tracking (last {days} days)</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginVertical: 8 }}>
        <TextInput value={fromDate} onChangeText={setFromDate} style={{ borderWidth: 1, borderColor: '#ddd', padding: 8, flex: 1 }} />
        <TextInput value={toDate} onChangeText={setToDate} style={{ borderWidth: 1, borderColor: '#ddd', padding: 8, flex: 1 }} />
      </View>
      <LineChart data={data} width={350} height={220} chartConfig={{ backgroundGradientFrom: theme === 'dark' ? '#111' : '#fff', backgroundGradientTo: theme === 'dark' ? '#111' : '#fff', color:()=>'#4caf50' }} />
      <View style={{ marginTop: 12 }}>
        <Button title="Set 7 days" onPress={() => setDays(7)} />
        <View style={{ height: 8 }} />
        <Button title="Set 30 days" onPress={() => setDays(30)} />
        <View style={{ height: 8 }} />
        <Button title="Export report (PDF)" onPress={async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            const qs = `from=${fromDate}&to=${toDate}`;
            const filename = FileSystem.documentDirectory + `expenses_${Date.now()}.pdf`;
            const url = `${Config.API_URL}/transactions/export/pdf?${qs}${token ? `&token=${token}` : ''}`;
            const dl = await FileSystem.downloadAsync(url, filename);
            if (dl.status !== 200) {
              console.warn('Download response', dl);
              alert('Export failed: server returned ' + dl.status);
              return;
            }
            if (await Sharing.isAvailableAsync()) {
              await Sharing.shareAsync(dl.uri);
            } else {
              alert('PDF saved: ' + dl.uri);
            }
          } catch (err) { console.warn('Export error', err); alert('Export failed'); }
        }} />
      </View>
    </View>
  );
}
