import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { employees } from '@/data/manager-data';

export default function ChiTietNhanVien() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const employee = employees.find((item) => item.id === id);

  if (!employee) {
    return (
      <View style={styles.container}>
        <Text>Không tìm thấy nhân viên</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết nhân viên</Text>
        <Text style={styles.refreshIcon}>⟳</Text>
      </View>

      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{employee.name.charAt(0)}</Text>
        </View>
        <Text style={styles.name}>{employee.name}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{employee.status}</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.row}>
          <Text style={styles.label}>Phòng ban</Text>
          <Text style={styles.value}>{employee.department}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Chức vụ</Text>
          <Text style={styles.value}>{employee.position}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Số điện thoại</Text>
          <Text style={styles.value}>{employee.phone}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{employee.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Ngày sinh</Text>
          <Text style={styles.value}>{employee.birthday}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Ngày vào công ty</Text>
          <Text style={styles.value}>{employee.joinDate}</Text>
        </View>
        <View style={[styles.row, { borderBottomWidth: 0 }]}>
          <Text style={styles.label}>Địa chỉ</Text>
          <Text style={styles.value}>{employee.address}</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionButton, styles.editButton]}>
          <Text style={styles.actionText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.deleteButton]}>
          <Text style={styles.actionText}>Xóa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.lockButton]}>
          <Text style={styles.actionText}>Khóa</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusBadge: {
    backgroundColor: '#E6F7EC',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 6,
  },
  statusText: {
    color: '#2E9E5B',
    fontSize: 13,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 20,
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
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginHorizontal: 20,
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#4A90E2',
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
  },
  lockButton: {
    backgroundColor: '#F5A623',
  },
  actionText: {
    color: 'white',
    fontWeight: '600',
  },
});