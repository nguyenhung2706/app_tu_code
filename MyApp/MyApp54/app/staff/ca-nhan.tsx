import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/theme-context';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const menuItems = [
  { icon: 'person-outline', label: 'Thông tin cá nhân', route: '/staff/thong-tin' },
  { icon: 'lock-closed-outline', label: 'Đổi mật khẩu', route: '/staff/mat-khau' },
  { icon: 'notifications-outline', label: 'Thông báo', route: '/staff/thong-bao' },
  { icon: 'settings-outline', label: 'Cài đặt', route: '/staff/cai-dat' },
];

export default function CaNhan() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất không?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/staff/cai-dat' as any)}>
          <Ionicons name="menu-outline" size={26} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>Cá Nhân</Text>

        <TouchableOpacity onPress={() => router.push('/staff/thong-bao' as any)}>
          <Ionicons name="notifications-outline" size={26} color={colors.text} />
          <View style={styles.dot} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name ? user.name.trim().split(' ').pop()!.charAt(0).toUpperCase() : '?'}
          </Text>
        </View>
        <View>
          <Text style={[styles.name, { color: colors.text }]}>{user?.name}</Text>
          <Text style={[styles.role, { color: colors.sub }]}>
            {user?.position} • {user?.role === 'manager' ? 'Quản lý' : 'Nhân viên'}
          </Text>
        </View>
      </View>

      <View style={[styles.menuCard, { backgroundColor: colors.card }]}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuRow,
              index !== menuItems.length - 1 && styles.menuRowBorder,
              index !== menuItems.length - 1 && { borderBottomColor: colors.border },
            ]}
            onPress={() => router.push(item.route as any)}
          >
            <Ionicons
              name={item.icon as any}
              size={22}
              color={colors.text}
              style={{ marginRight: 12 }}
            />
            <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.logoutCard, { backgroundColor: colors.card }]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color="#E74C3C" style={styles.logoutIcon} />
        <Text style={styles.logoutLabel}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingHorizontal: 20, paddingTop: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  profileSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  avatar: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: '#4A90E2',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  avatarText: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  name: { fontSize: 17, fontWeight: '600' },
  role: { fontSize: 14, marginTop: 2 },
  menuCard: { borderRadius: 10, marginBottom: 20 },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 15 },
  menuRowBorder: { borderBottomWidth: 0.5, borderBottomColor: '#eee' },
  menuLabel: { flex: 1, fontSize: 15 },
  chevron: { fontSize: 20, color: '#ccc' },
  logoutCard: {
    flexDirection: 'row', alignItems: 'center', borderRadius: 10,
    paddingVertical: 14, paddingHorizontal: 15,
  },
  logoutIcon: { marginRight: 12 },
  logoutLabel: { fontSize: 15, color: '#E74C3C', fontWeight: '600' },
  dot: {
    position: 'absolute', top: 0, right: 1, width: 9, height: 9,
    borderRadius: 5, backgroundColor: '#E74C3C',
  },
});