import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/theme-context';

// ====== DỮ LIỆU MẪU (thay bằng dữ liệu thật từ API / context) ======
const PROFILE = {
  name: 'Nguyễn Văn B',
  maNV: 'QL001',
  chucVu: 'Quản lý',
  phongBan: 'Phòng Kinh doanh',
  soNhanVien: 12,
  ngayVaoLam: '01/03/2022',
  ngaySinh: '15/08/1990',
  gioiTinh: 'Nam',
  soDienThoai: '0901 234 567',
  email: 'quanly@congty.vn',
  diaChi: 'Hà Nội',
};

export default function ThongTinCaNhan() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState(PROFILE.soDienThoai);
  const [email, setEmail] = useState(PROFILE.email);
  const [address, setAddress] = useState(PROFILE.diaChi);

  const handleSave = () => {
    if (!phone.trim() || !email.trim()) {
      Alert.alert('Lỗi', 'Số điện thoại và email không được để trống');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return;
    }
    // TODO: gọi API cập nhật thông tin ở đây
    setEditing(false);
    Alert.alert('Thành công', 'Đã cập nhật thông tin');
  };

  const handleCancel = () => {
    setPhone(PROFILE.soDienThoai);
    setEmail(PROFILE.email);
    setAddress(PROFILE.diaChi);
    setEditing(false);
  };

  // Dòng chỉ xem
  const readRow = (label: string, value: string, last = false) => (
    <View style={[styles.row, !last && { borderBottomWidth: 0.5, borderBottomColor: colors.border }]}>
      <Text style={[styles.rowLabel, { color: colors.sub }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: colors.text }]}>{value}</Text>
    </View>
  );

  // Dòng có thể sửa
  const editRow = (
    label: string,
    value: string,
    onChange: (t: string) => void,
    opts: { keyboardType?: any; last?: boolean } = {}
  ) => (
    <View
      style={[
        styles.row,
        !opts.last && { borderBottomWidth: 0.5, borderBottomColor: colors.border },
      ]}
    >
      <Text style={[styles.rowLabel, { color: colors.sub }]}>{label}</Text>
      {editing ? (
        <TextInput
          value={value}
          onChangeText={onChange}
          keyboardType={opts.keyboardType}
          autoCapitalize="none"
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        />
      ) : (
        <Text style={[styles.rowValue, { color: colors.text }]}>{value}</Text>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: insets.top + 15,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace('/manager/ca-nhan')}>
            <Text style={[styles.back, { color: colors.text }]}>‹</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Thông tin cá nhân</Text>
          {editing ? (
            <TouchableOpacity onPress={handleCancel}>
              <Text style={styles.headerAction}>Hủy</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setEditing(true)}>
              <Text style={styles.headerAction}>Sửa</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Avatar + tên */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{PROFILE.name.trim().charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={[styles.name, { color: colors.text }]}>{PROFILE.name}</Text>
          <Text style={[styles.role, { color: colors.sub }]}>
            {PROFILE.chucVu} · {PROFILE.phongBan}
          </Text>
        </View>

        {/* Thông tin công việc (chỉ xem) */}
        <Text style={[styles.sectionTitle, { color: colors.sub }]}>Thông tin công việc</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {readRow('Mã nhân viên', PROFILE.maNV)}
          {readRow('Chức vụ', PROFILE.chucVu)}
          {readRow('Phòng ban', PROFILE.phongBan)}
          {readRow('Số nhân viên quản lý', String(PROFILE.soNhanVien))}
          {readRow('Ngày vào làm', PROFILE.ngayVaoLam, true)}
        </View>

        {/* Thông tin cá nhân (chỉ xem) */}
        <Text style={[styles.sectionTitle, { color: colors.sub }]}>Thông tin cá nhân</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {readRow('Họ và tên', PROFILE.name)}
          {readRow('Ngày sinh', PROFILE.ngaySinh)}
          {readRow('Giới tính', PROFILE.gioiTinh, true)}
        </View>

        {/* Liên hệ (sửa được) */}
        <Text style={[styles.sectionTitle, { color: colors.sub }]}>Liên hệ</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {editRow('Số điện thoại', phone, setPhone, { keyboardType: 'phone-pad' })}
          {editRow('Email', email, setEmail, { keyboardType: 'email-address' })}
          {editRow('Địa chỉ', address, setAddress, { last: true })}
        </View>

        {editing && (
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
            <Text style={styles.saveText}>Lưu thay đổi</Text>
          </TouchableOpacity>
        )}

        {!editing && (
          <Text style={[styles.hint, { color: colors.sub }]}>
            Thông tin công việc do công ty quản lý, liên hệ HR nếu cần thay đổi.
          </Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  back: { fontSize: 32, lineHeight: 32 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  headerAction: { fontSize: 15, fontWeight: '600', color: '#4A90E2', minWidth: 24, textAlign: 'right' },

  profileSection: { alignItems: 'center', marginBottom: 24 },
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
  name: { fontSize: 18, fontWeight: '700' },
  role: { fontSize: 14, marginTop: 3 },

  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  card: { borderRadius: 10, marginBottom: 20 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 15,
  },
  rowLabel: { fontSize: 14, marginRight: 12 },
  rowValue: { fontSize: 15, fontWeight: '500', flexShrink: 1, textAlign: 'right' },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 15,
    textAlign: 'right',
  },

  saveBtn: {
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveText: { color: 'white', fontSize: 16, fontWeight: '600' },
  hint: { fontSize: 12, textAlign: 'center', marginTop: 4 },
});