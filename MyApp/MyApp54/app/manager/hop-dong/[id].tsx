import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { contracts } from '@/data/hop-dong-data';

export default function ChiTietHopDong() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const contract = contracts.find((item) => item.id === id);

  if (!contract) {
    return (
      <View style={styles.container}>
        <Text>Không tìm thấy hợp đồng</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết</Text>
        <View style={{ width: 22 }} />
      </View>

      <Text style={styles.contractTitle}>HỢP ĐỒNG {contract.id}</Text>

      <View style={styles.infoCard}>
        <View style={styles.row}>
          <Text style={styles.label}>Nhân viên</Text>
          <Text style={styles.value}>{contract.employeeName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Loại hợp đồng</Text>
          <Text style={styles.value}>{contract.type}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Ngày bắt đầu</Text>
          <Text style={styles.value}>{contract.startDate}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Ngày kết thúc</Text>
          <Text style={styles.value}>{contract.endDate}</Text>
        </View>
        <View style={[styles.row, { borderBottomWidth: 0 }]}>
          <Text style={styles.label}>Trạng thái</Text>
          <Text style={styles.value}>{contract.status}</Text>
        </View>
      </View>

      {contract.status === 'Chờ ký' && (
        <TouchableOpacity style={styles.signButton}>
          <Text style={styles.signButtonText}>Ký hợp đồng</Text>
        </TouchableOpacity>
      )}
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
    marginBottom: 20,
  },
  backIcon: {
    fontSize: 22,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contractTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 14,
    color: 'gray',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
  signButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  signButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
});