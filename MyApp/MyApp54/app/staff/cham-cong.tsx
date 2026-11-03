import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAttendance } from '@/context/attendance-context';
import { useTheme } from '@/context/theme-context';
import StaffHeader from '@/components/StaffHeader';

export default function ChamCong() {
    const router = useRouter();
    const { isWorking, checkInTime, checkOutTime } = useAttendance();
    const { colors } = useTheme();

  // Hàm định dạng giờ:phút từ đối tượng Date
  const formatClock = (date: Date | null) => {
    if (!date) return '--:--';
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
            <StaffHeader title="Chấm Công" />

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Hôm nay</Text>

      <View style={styles.summaryRow}>
        <View style={[styles.summaryBox, { backgroundColor: colors.card }]}>
          <Text style={[styles.summaryLabel, { color: colors.sub }]}>Vào lúc</Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>{formatClock(checkInTime)}</Text>
        </View>
        <View style={[styles.summaryBox, { backgroundColor: colors.card }]}>
          <Text style={[styles.summaryLabel, { color: colors.sub }]}>Trạng thái</Text>
          <Text style={[styles.summaryValue, { color: isWorking ? '#2ECC71' : '#999' }]}>
            {isWorking ? 'Đang làm việc' : 'Chưa chấm công'}
          </Text>
        </View>
      </View>

      {isWorking && (
        <View style={styles.tanCaCard}>
          <Text style={styles.tanCaLabel}>Tan ca</Text>
          <Text style={styles.tanCaTime}>{formatClock(checkOutTime)}</Text>
        </View>
      )}
      <TouchableOpacity onPress={() => router.push('/staff/lich-su-cham-cong')}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Lịch sử hôm nay</Text>
      </TouchableOpacity>

      <View style={[styles.historyCard, { backgroundColor: colors.card }]}>
        <View style={styles.historyRow}>
          <View style={[styles.dot, { backgroundColor: checkInTime ? '#2ECC71' : '#ccc' }]} />
          <View>
            <Text style={[styles.historyLabel, { color: colors.sub }]}>Vào lúc</Text>
            <Text style={[styles.historyTime, { color: colors.text }]}>{formatClock(checkInTime)}</Text>
          </View>
        </View>

        <View style={styles.historyRow}>
          <View style={[styles.dot, { backgroundColor: checkOutTime ? '#E74C3C' : '#ccc' }]} />
          <View>
            <Text style={[styles.historyLabel, { color: colors.sub }]}>Tan ca</Text>
            <Text style={[styles.historyTime, { color: colors.text }]}>{formatClock(checkOutTime)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  menuIcon: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 15,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    color: 'gray',
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  tanCaCard: {
    backgroundColor: '#E74C3C',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  tanCaLabel: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  tanCaTime: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  historyCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  historyLabel: {
    fontSize: 14,
    color: 'gray',
  },
  historyTime: {
    fontSize: 15,
    fontWeight: '600',
  },
});