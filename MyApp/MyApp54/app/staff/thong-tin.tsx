import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

const profile = {
  name: 'Nguyễn Văn A',
  status: 'Đang làm việc',
  department: 'Phòng Kinh doanh',
  position: 'Nhân viên',
  phone: '0901 234 567',
  email: 'nguyenvana@congty.com',
  birthday: '15/05/1995',
  joinDate: '01/03/2022',
  address: '123 Cầu Giấy, Hà Nội',
};

const fields = [
  { label: 'Họ tên', value: profile.name },
  { label: 'Phòng ban', value: profile.department },
  { label: 'Chức vụ', value: profile.position },
  { label: 'Số điện thoại', value: profile.phone },
  { label: 'Email', value: profile.email },
  { label: 'Ngày sinh', value: profile.birthday },
  { label: 'Ngày vào công ty', value: profile.joinDate },
  { label: 'Địa chỉ', value: profile.address },
];

export default function ThongTinCaNhan() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/staff/ca-nhan')}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profile.name.charAt(0)}</Text>
          </View>
          <Text style={styles.name}>{profile.name}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{profile.status}</Text>
          </View>
        </View>

        <View style={styles.card}>
          {fields.map((item, index) => (
            <View
              key={item.label}
              style={[styles.row, index !== fields.length - 1 && styles.rowBorder]}
            >
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
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
  profileSection: { alignItems: 'center', marginBottom: 25 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: { color: 'white', fontSize: 32, fontWeight: 'bold' },
  name: { fontSize: 18, fontWeight: '600' },
  badge: {
    marginTop: 8,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { color: '#2E7D32', fontSize: 13, fontWeight: '600' },
  card: { backgroundColor: 'white', borderRadius: 10, marginBottom: 20 },
  row: { paddingVertical: 14, paddingHorizontal: 15 },
  rowBorder: { borderBottomWidth: 0.5, borderBottomColor: '#eee' },
  label: { fontSize: 13, color: 'gray', marginBottom: 4 },
  value: { fontSize: 15, color: '#222' },
});