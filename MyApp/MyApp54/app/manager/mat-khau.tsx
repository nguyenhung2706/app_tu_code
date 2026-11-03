import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function DoiMatKhau() {
  const router = useRouter();
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [show, setShow] = useState(false);

  const handleSubmit = () => {
    if (!oldPass || !newPass || !confirmPass) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (newPass.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    if (newPass !== confirmPass) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }
    // TODO: gọi API đổi mật khẩu ở đây
    Alert.alert('Thành công', 'Đổi mật khẩu thành công', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const renderInput = (
    label: string,
    value: string,
    onChange: (t: string) => void
  ) => (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        secureTextEntry={!show}
        placeholder="••••••••"
        autoCapitalize="none"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/manager/ca-nhan')}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đổi mật khẩu</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.card}>
        {renderInput('Mật khẩu hiện tại', oldPass, setOldPass)}
        {renderInput('Mật khẩu mới', newPass, setNewPass)}
        {renderInput('Xác nhận mật khẩu mới', confirmPass, setConfirmPass)}

        <TouchableOpacity onPress={() => setShow(!show)}>
          <Text style={styles.toggle}>{show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Cập nhật mật khẩu</Text>
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
    marginBottom: 20,
  },
  back: { fontSize: 32, lineHeight: 32, color: '#4A90E2' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  card: { backgroundColor: 'white', borderRadius: 10, padding: 15, marginBottom: 20 },
  field: { marginBottom: 15 },
  label: { fontSize: 13, color: 'gray', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  toggle: { color: '#4A90E2', fontSize: 14, fontWeight: '600' },
  button: {
    backgroundColor: '#4A90E2',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});