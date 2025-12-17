import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button } from 'react-native';

import { Picker } from '@react-native-picker/picker';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import Config from '../config';

export default function CalendarScreen() {
  const [selected, setSelected] = useState();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [day, setDay] = useState(today.getDate());
  const [records, setRecords] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // build selected from pickers
    const y = year; const m = String(month).padStart(2,'0'); const d = String(day).padStart(2,'0');
    const sel = `${y}-${m}-${d}`;
    setSelected(sel);
    if (!sel) return;
    async function load() {
      try {
        const res = await axios.get(`${Config.API_URL}/transactions?date=${selected}`);
        setRecords(res.data || []);
        setTotal((res.data || []).reduce((s, r) => s + (r.amount || 0), 0));
      } catch (err) {
        setRecords([]);
        setTotal(0);
      }
    }
    load();
  }, [year, month, day]);

  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', padding: 12, alignItems: 'center' }}>
        <Picker selectedValue={day} style={{ flex: 1 }} onValueChange={v => setDay(v)}>
          {Array.from({ length: 31 }, (_, i) => <Picker.Item key={i+1} label={`${i+1}`} value={i+1} />)}
        </Picker>
        <Picker selectedValue={month} style={{ flex: 1 }} onValueChange={v => setMonth(v)}>
          {Array.from({ length: 12 }, (_, i) => <Picker.Item key={i+1} label={`${i+1}`} value={i+1} />)}
        </Picker>
        <Picker selectedValue={year} style={{ flex: 1 }} onValueChange={v => setYear(v)}>
          {Array.from({ length: 5 }, (_, i) => {
            const y = today.getFullYear() - i;
            return <Picker.Item key={y} label={`${y}`} value={y} />;
          })}
        </Picker>
      </View>
      <View style={{ padding: 12 }}>
        <Button title={showCalendar ? 'Hide calendar' : 'Show calendar'} onPress={() => setShowCalendar(s => !s)} />
        {showCalendar && <Calendar onDayPress={d => { const parts = d.dateString.split('-'); setYear(Number(parts[0])); setMonth(Number(parts[1])); setDay(Number(parts[2])); setSelected(d.dateString); }} markedDates={{ [selected]: { selected: true } }} />}
        <Text style={{ fontSize: 18, marginTop: 8 }}>Selected: {selected || 'None'}</Text>
        <Text style={{ fontSize: 18, marginTop: 8 }}>Total: PKR {total}</Text>
      </View>
      <FlatList data={records} keyExtractor={i => i._id} renderItem={({ item }) => <Text style={{ padding: 8 }}>{item.notes} - PKR {item.amount}</Text>} />
    </View>
  );
}
