import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTheme } from '@/context/theme-context';

export default function CaiDat() {
  const router = useRouter();
  const { colors, darkMode, setDarkMode } = useTheme();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [donTuEnabled, setDonTuEnabled] = useState(false);
  const [chamCongEnabled, setChamCongEnabled] = useState(true);
  const [chungEnabled, setChungEnabled] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/manager/ca-nhan')}>
          <Text style={[styles.back, { color: colors.text }]}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Cài đặt</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.sub }]}>Thông báo</Text>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={[styles.row, styles.rowBorder, { borderBottomColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.text }]}>Thông báo đẩy</Text>
          <Switch value={pushEnabled} onValueChange={setPushEnabled} trackColor={{ false: '#767577', true: '#4A90E2' }} />
        </View>

        <View style={[styles.row, styles.rowBorder, !pushEnabled && styles.disabled, { borderBottomColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.text }]}>Đơn từ</Text>
          <Switch value={donTuEnabled} onValueChange={setDonTuEnabled} disabled={!pushEnabled} trackColor={{ false: '#767577', true: '#4A90E2' }} />
        </View>

        <View style={[styles.row, styles.rowBorder, !pushEnabled && styles.disabled, { borderBottomColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.text }]}>Chấm công</Text>
          <Switch value={chamCongEnabled} onValueChange={setChamCongEnabled} disabled={!pushEnabled} trackColor={{ false: '#767577', true: '#4A90E2' }} />
        </View>

        <View style={[styles.row, !pushEnabled && styles.disabled]}>
          <Text style={[styles.label, { color: colors.text }]}>Thông báo chung từ công ty</Text>
          <Switch value={chungEnabled} onValueChange={setChungEnabled} disabled={!pushEnabled} trackColor={{ false: '#767577', true: '#4A90E2' }} />
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.sub }]}>Giao diện</Text>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]}>Chế độ tối</Text>
          <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ false: '#767577', true: '#4A90E2' }} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingHorizontal: 20, paddingTop: 15 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  back: { fontSize: 32, lineHeight: 32, color: '#4A90E2' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  sectionTitle: {
  fontSize: 12,
  color: 'gray',
  fontWeight: '600',
  marginBottom: 8,
  marginLeft: 4,
},
card: { backgroundColor: 'white', borderRadius: 10, marginBottom: 20 },
row: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingVertical: 12,
  paddingHorizontal: 15,
},
rowBorder: { borderBottomWidth: 0.5, borderBottomColor: '#eee' },
label: { fontSize: 15 },
disabled: { opacity: 0.4 },
});