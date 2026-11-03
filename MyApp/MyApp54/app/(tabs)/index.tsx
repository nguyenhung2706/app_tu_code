import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        QUẢN LÝ NHÂN SỰ
      </Text>

      <Text style={styles.welcome}>
        Xin chào 👋
      </Text>

      <Text style={styles.description}>
        Quản lý nhân sự một cách hiệu quả.
      </Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.buttonLeft]}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.buttonText}>
            Đăng Nhập
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonRight]}
          onPress={() => router.push('/login/register')}
        >
          <Text style={styles.buttonTextOutline}>
            Đăng Ký
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 30,
    color: 'black',
  },

  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },

  description: {
    fontSize: 16,
    color: 'black',
    marginBottom: 30,
  },

  buttonRow: {
    flexDirection: 'row',   // 👈 xếp ngang
    width: '100%',
    marginTop: 20,
    gap: 12,                // khoảng cách giữa 2 nút
  },

  button: {
    flex: 1,                // 👈 chia đều 50/50
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonLeft: {
    backgroundColor: 'black',
  },

  buttonRight: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: 'black',
  },

  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },

  buttonTextOutline: {
    color: 'black',
    fontSize: 17,
    fontWeight: 'bold',
  },
});