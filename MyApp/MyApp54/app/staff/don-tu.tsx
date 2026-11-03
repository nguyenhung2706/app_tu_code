import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useLeaveRequests } from '@/context/leave-repuest-context';
import { useTheme } from '@/context/theme-context';
import StaffHeader from '@/components/StaffHeader';

export default function DonTuNhanVien() {
  const router = useRouter();
  const { colors } = useTheme();
  const { requests } = useLeaveRequests();

  const statusStyle = (status: string) => {
    if (status === 'Đã duyệt') return { color: '#2ECC71', icon: '✓' };
    if (status === 'Từ chối') return { color: '#E74C3C', icon: '✕' };
    return { color: '#F39C12', icon: '⏳' }; // Chờ duyệt
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <StaffHeader title="Đơn từ" showMenu={false} />

      <View style={[styles.tabRow, { backgroundColor: colors.border }]}>
        <View style={[styles.tabButton, styles.tabButtonActive, { backgroundColor: colors.card }]}>
          <Text style={[styles.tabTextActive, { color: colors.text }]}>Đã gửi</Text>
        </View>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => router.push('/staff/tao-don')}
        >
          <Text style={[styles.tabText, { color: colors.sub }]}>Tạo đơn</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {requests.map((item) => {
          const { color, icon } = statusStyle(item.status);
          return (
            <View style={[styles.card, { backgroundColor: colors.card }]} key={item.id}>
              <View>
                <Text style={[styles.type, { color: colors.text }]}>{item.type}</Text>
                <Text style={[styles.date, { color: colors.sub }]}>{item.startDate}</Text>
                <Text style={[styles.status, { color }]}>{item.status}</Text>
              </View>
              <Text style={[styles.statusIcon, { color }]}>{icon}</Text>
            </View>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/staff/tao-don')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingHorizontal: 20, paddingTop: 15 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  menuIcon: { fontSize: 20 },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#e8e8e8',
    borderRadius: 8,
    padding: 4,
    marginBottom: 15,
  },
  tabButton: { flex: 1, paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  tabButtonActive: { backgroundColor: 'white' },
  tabText: { fontSize: 13, color: 'gray' },
  tabTextActive: { fontSize: 13, color: '#000', fontWeight: '600' },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  type: { fontSize: 15, fontWeight: '600' },
  date: { fontSize: 13, color: 'gray', marginTop: 2 },
  status: { fontSize: 13, fontWeight: '600', marginTop: 4 },
  statusIcon: { fontSize: 20, fontWeight: 'bold' },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: { color: 'white', fontSize: 28, fontWeight: 'bold' },
});