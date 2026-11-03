import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import { attendanceHistory } from '@/data/attendance-history-data';
import { useTheme } from '@/context/theme-context';
import { getToday } from '@/utils/date';


export default function LichSuChamCong() {
  const router = useRouter();
  const { colors, darkMode } = useTheme();
  const [selectedDate, setSelectedDate] = useState(getToday());

  const markedDates = attendanceHistory.reduce((acc, record) => {
    const dotColor =
      record.status === 'Đúng giờ' ? '#2ECC71' : record.status === 'Đi muộn' ? '#F39C12' : '#E74C3C';

    acc[record.date] = {
      marked: true,
      dotColor,
      selected: record.date === selectedDate,
      selectedColor: '#4A90E2',
    };
    return acc;
  }, {} as Record<string, any>);

  const recordsOfDay = attendanceHistory.filter((r) => r.date === selectedDate);

  const statusColor = (status: string) => {
    if (status === 'Đúng giờ') return '#2ECC71';
    if (status === 'Đi muộn') return '#F39C12';
    return '#E74C3C';
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/staff/cham-cong')}>
          <Text style={[styles.backIcon, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Lịch sử chấm công</Text>
        <Text style={[styles.menuIcon, { color: colors.text }]}>⋮</Text>
      </View>

      <Calendar
        key={darkMode ? 'dark' : 'light'}
        current={selectedDate}
        markedDates={markedDates}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        theme={{
          calendarBackground: colors.card,
          dayTextColor: colors.text,
          monthTextColor: colors.text,
          textSectionTitleColor: colors.sub,
          textDisabledColor: colors.border,
          selectedDayBackgroundColor: '#4A90E2',
          todayTextColor: '#4A90E2',
          arrowColor: '#4A90E2',
        }}
        style={styles.calendar}
      />

      <View style={styles.listSection}>
        {recordsOfDay.length === 0 && (
          <Text style={[styles.emptyText, { color: colors.sub }]}>Không có dữ liệu cho ngày này</Text>
        )}

        {recordsOfDay.map((record, index) => (
          <View style={[styles.recordCard, { backgroundColor: colors.card }]} key={index}>
            <View>
              <Text style={[styles.recordDate, { color: colors.text }]}>{record.date}</Text>
              <Text style={[styles.recordTime, { color: colors.sub }]}>
                {record.checkIn} - {record.checkOut}
              </Text>
            </View>
            <Text style={[styles.recordStatus, { color: statusColor(record.status) }]}>
              {record.status}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backIcon: { fontSize: 22 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  menuIcon: { fontSize: 20 },
  calendar: { marginHorizontal: 20, borderRadius: 10, marginBottom: 20 },
  listSection: { paddingHorizontal: 20 },
  emptyText: { textAlign: 'center', marginTop: 20 },
  recordCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  recordDate: { fontSize: 15, fontWeight: '600' },
  recordTime: { fontSize: 13, marginTop: 4 },
  recordStatus: { fontWeight: '600', fontSize: 14 },
});