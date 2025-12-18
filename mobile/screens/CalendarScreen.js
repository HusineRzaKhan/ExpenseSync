import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, Button, Platform } from 'react-native';
import { ThemeContext } from '../theme';

import CustomPicker from '../components/CustomPicker';
import { Calendar } from 'react-native-calendars';
import axios from 'axios';
import Config from '../config';

export default function CalendarScreen() {
  const { theme } = useContext(ThemeContext);
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

  const bg = theme === 'dark' ? '#111' : '#fff';
  const cardBg = theme === 'dark' ? '#0f0f0f' : '#fff';
  const textColor = theme === 'dark' ? '#fff' : '#000';
  const calendarTheme = theme === 'dark' ? {
    backgroundColor: '#111',
    calendarBackground: '#111',
    textSectionTitleColor: '#bbb',
    selectedDayBackgroundColor: '#F6C23E',
    selectedDayTextColor: '#000',
    todayTextColor: '#fff',
    dayTextColor: '#fff',
    monthTextColor: '#fff',
    arrowColor: '#fff'
  } : {
    backgroundColor: '#fff',
    calendarBackground: '#fff',
    textSectionTitleColor: '#333',
    selectedDayBackgroundColor: '#F6C23E',
    selectedDayTextColor: '#000',
    todayTextColor: '#000',
    dayTextColor: '#000',
    monthTextColor: '#000',
    arrowColor: '#000'
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <View style={{ flexDirection: 'row', padding: 12, alignItems: 'center', backgroundColor: cardBg }}>
        <CustomPicker value={day} onValueChange={setDay} style={{ flex: 1, marginRight: 8 }} items={Array.from({ length: 31 }, (_, i) => ({ label: `${i+1}`, value: i+1 }))} />
        <CustomPicker value={month} onValueChange={setMonth} style={{ flex: 1, marginRight: 8 }} items={Array.from({ length: 12 }, (_, i) => ({ label: `${i+1}`, value: i+1 }))} />
        <CustomPicker value={year} onValueChange={setYear} style={{ flex: 1 }} items={Array.from({ length: 5 }, (_, i) => ({ label: `${today.getFullYear() - i}`, value: today.getFullYear() - i }))} />
      </View>
      <View style={{ padding: 12 }}>
        <Button title={showCalendar ? 'Hide calendar' : 'Show calendar'} onPress={() => setShowCalendar(s => !s)} />
        {showCalendar && <Calendar theme={calendarTheme} onDayPress={d => { const parts = d.dateString.split('-'); setYear(Number(parts[0])); setMonth(Number(parts[1])); setDay(Number(parts[2])); setSelected(d.dateString); }} markedDates={{ [selected]: { selected: true } }} />}
        <Text style={{ fontSize: 18, marginTop: 8, color: textColor }}>Selected: {selected || 'None'}</Text>
        <Text style={{ fontSize: 18, marginTop: 8, color: textColor }}>Total: PKR {total}</Text>
      </View>
      <FlatList data={records} keyExtractor={i => i._id} renderItem={({ item }) => <Text style={{ padding: 8, color: textColor }}>{item.notes} - PKR {item.amount}</Text>} />
    </View>
  );
}
