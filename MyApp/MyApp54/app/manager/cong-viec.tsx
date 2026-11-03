import { View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { attendanceRecords, AttendanceStatus } from '@/data/cham-cong';
import { getTodayDMY } from '@/utils/date';
export default function CongViec() {
  const router = useRouter();
  const { filter } = useLocalSearchParams<{ filter?: string }>();

  // Tính số lượng theo từng trạng thái, để hiện lên 4 ô số liệu phía trên
  const countByStatus = (status: AttendanceStatus) =>
    attendanceRecords.filter((item) => item.status === status).length;

  const summary = [
    { label: 'Đi làm', count: countByStatus('Đúng giờ') + countByStatus('Đi muộn'), color: '#2ECC71', status: null },
    { label: 'Nghỉ phép', count: countByStatus('Nghỉ phép'), color: '#F5A623', status: 'Nghỉ phép' },
    { label: 'Nghỉ', count: countByStatus('Nghỉ'), color: '#E74C3C', status: 'Nghỉ' },
    { label: 'Đi muộn', count: countByStatus('Đi muộn'), color: '#F39C12', status: 'Đi muộn' },
  ];

  // Nếu có "filter" truyền từ trang Tổng quan (vd: 'Đang làm việc'), lọc bảng theo đó
  const filteredRecords = attendanceRecords.filter((item) => {
    if (!filter) return true;
    if (filter === 'Đang làm việc') return item.status === 'Đúng giờ' || item.status === 'Đi muộn';
    if (filter === 'Đang nghỉ') return item.status === 'Nghỉ phép' || item.status === 'Nghỉ';
    return true;
  });

  const statusColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'Đúng giờ':
        return '#2ECC71';
      case 'Đi muộn':
        return '#F39C12';
      case 'Nghỉ phép':
        return '#F5A623';
      case 'Nghỉ':
        return '#E74C3C';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chấm Công</Text>
        <Text style={styles.refreshIcon}>⟳</Text>
      </View>

      <Text style={styles.date}>{getTodayDMY()}</Text>

      <View style={styles.summaryGrid}>
        {summary.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.summaryCard, { backgroundColor: item.color + '22' }]}
            disabled={!item.status}
            onPress={() =>
              item.status &&
              router.push({ pathname: '/manager/cong-viec', params: { filter: item.status } })
            }
          >
            <Text style={[styles.summaryCount, { color: item.color }]}>{item.count}</Text>
            <Text style={[styles.summaryLabel, { color: item.color }]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Nhân viên</Text>
        <Text style={styles.tableHeaderText}>Vào</Text>
        <Text style={styles.tableHeaderText}>Ra</Text>
        <Text style={[styles.tableHeaderText, { flex: 1.2 }]}>Trạng thái</Text>
      </View>

      {filteredRecords.map((item) => (
        <View style={styles.tableRow} key={item.id}>
          <Text style={[styles.rowText, { flex: 1.5, fontWeight: '600' }]}>{item.name}</Text>
          <Text style={styles.rowText}>{item.checkInTime}</Text>
          <Text style={styles.rowText}>{item.checkOutTime}</Text>
          <Text style={[styles.rowText, { flex: 1.2, color: statusColor(item.status), fontWeight: '600' }]}>
            {item.status}
          </Text>
        </View>
      ))}
    </ScrollView>
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
    marginBottom: 5,
  },
  backIcon: {
    fontSize: 22,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  refreshIcon: {
    fontSize: 20,
  },
  date: {
    textAlign: 'center',
    color: 'gray',
    marginBottom: 15,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  summaryCard: {
    width: '47%',
    padding: 15,
    borderRadius: 10,
  },
  summaryCount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  summaryLabel: {
    fontSize: 13,
    marginTop: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
    marginBottom: 4,
  },
  tableHeaderText: {
    flex: 1,
    fontSize: 13,
    color: 'gray',
    fontWeight: '600',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  rowText: {
    flex: 1,
    fontSize: 14,
  },
});