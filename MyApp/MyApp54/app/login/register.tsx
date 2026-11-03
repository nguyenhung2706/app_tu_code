import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

/* ---------- Bong bóng màu trôi ở nền ---------- */
function Blob({ size, color, delay, style }: any) {
  const y = useSharedValue(0);
  const x = useSharedValue(0);

  useEffect(() => {
    y.value = withDelay(
      delay,
      withRepeat(withTiming(30, { duration: 3500, easing: Easing.inOut(Easing.quad) }), -1, true)
    );
    x.value = withDelay(
      delay,
      withRepeat(withTiming(20, { duration: 4500, easing: Easing.inOut(Easing.quad) }), -1, true)
    );
  }, []);

  const anim = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }, { translateX: x.value }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity: 0.35,
        },
        style,
        anim,
      ]}
    />
  );
}

/* ---------- Logo nhịp thở ---------- */
function Logo() {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.quad) })
      ),
      -1
    );
  }, []);

  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View entering={FadeInDown.duration(600).springify()} style={anim}>
      <LinearGradient
        colors={['#EC4899', '#6366F1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.logo}>
        <Ionicons name="person-add" size={38} color="white" />
      </LinearGradient>
    </Animated.View>
  );
}

/* ---------- Ô nhập có icon, viền sáng khi focus ---------- */
function Field({ icon, right, focused, children }: any) {
  return (
    <View style={[styles.field, focused && styles.fieldFocused]}>
      <Ionicons name={icon} size={20} color={focused ? '#6366F1' : '#9CA3AF'} />
      {children}
      {right}
    </View>
  );
}

export default function RegisterScreen() {
  const [role, setRole] = useState<'staff' | 'manager'>('staff');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focus, setFocus] = useState<string | null>(null);

  // Thanh trượt chọn vai trò
  const [rowWidth, setRowWidth] = useState(0);
  const indicatorX = useSharedValue(0);
  const indicatorW = rowWidth > 0 ? (rowWidth - 8) / 2 : 0;

  useEffect(() => {
    indicatorX.value = withSpring(role === 'manager' ? indicatorW : 0, { damping: 15 });
  }, [role, rowWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  // Nút nhún khi bấm
  const btnScale = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({ transform: [{ scale: btnScale.value }] }));

  // Rung khi nhập thiếu
  const shake = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.value }] }));

  const handleLogin = () => {
    if (!username || !password || !code) {
      shake.value = withSequence(
        withTiming(-10, { duration: 60 }),
        withTiming(10, { duration: 60 }),
        withTiming(-8, { duration: 60 }),
        withTiming(8, { duration: 60 }),
        withTiming(0, { duration: 60 })
      );
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    // TODO: gọi API đăng ký thật ở đây, kiểm tra đúng sai trước khi điều hướng
    console.log('Đăng ký:', { role, username, password, code });

    // Điều hướng theo vai trò
    if (role === 'manager') {
      router.replace('/manager');
    } else {
      router.replace('/staff');
    }
  };

  return (
    <LinearGradient colors={['#FDF2F8', '#EEF2FF', '#ECFEFF']} style={styles.container}>
      <Blob size={240} color="#F9A8D4" delay={0} style={{ top: -80, right: -80 }} />
      <Blob size={200} color="#A5B4FC" delay={600} style={{ bottom: 40, left: -70 }} />
      <Blob size={120} color="#67E8F9" delay={300} style={{ top: 280, left: -30 }} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Logo + tiêu đề */}
          <Logo />

          <Animated.Text entering={FadeInDown.delay(150).duration(500)} style={styles.title}>
            Đăng Ký
          </Animated.Text>

          <Animated.Text entering={FadeInDown.delay(250).duration(500)} style={styles.description}>
            Tạo tài khoản mới để bắt đầu ✨
          </Animated.Text>

          {/* Thẻ form */}
          <Animated.View entering={FadeInUp.delay(350).springify()} style={{ width: '100%' }}>
            <Animated.View style={[styles.card, shakeStyle]}>
            {/* Chọn vai trò */}
            <View style={styles.roleRow} onLayout={(e) => setRowWidth(e.nativeEvent.layout.width)}>
              <Animated.View style={[styles.indicator, { width: indicatorW }, indicatorStyle]} />

              <TouchableOpacity style={styles.roleButton} onPress={() => setRole('staff')}>
                <Ionicons name="person" size={16} color={role === 'staff' ? 'white' : '#6B7280'} />
                <Text style={[styles.roleText, role === 'staff' && styles.roleTextActive]}>
                  Nhân Viên
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.roleButton} onPress={() => setRole('manager')}>
                <Ionicons
                  name="briefcase"
                  size={16}
                  color={role === 'manager' ? 'white' : '#6B7280'}
                />
                <Text style={[styles.roleText, role === 'manager' && styles.roleTextActive]}>
                  Quản Lý
                </Text>
              </TouchableOpacity>
            </View>

            {/* Tài khoản */}
            <Animated.View entering={FadeInDown.delay(500).duration(400)}>
              <Text style={styles.label}>Tài khoản</Text>
              <Field icon="mail-outline" focused={focus === 'user'}>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập tên đăng nhập hoặc email"
                  placeholderTextColor="#9CA3AF"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  onFocus={() => setFocus('user')}
                  onBlur={() => setFocus(null)}
                />
              </Field>
            </Animated.View>

            {/* Mật khẩu */}
            <Animated.View entering={FadeInDown.delay(600).duration(400)}>
              <Text style={styles.label}>Mật khẩu</Text>
              <Field
                icon="lock-closed-outline"
                focused={focus === 'pass'}
                right={
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                }>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập mật khẩu"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => setFocus('pass')}
                  onBlur={() => setFocus(null)}
                />
              </Field>
            </Animated.View>

            {/* Mã nhân viên / quản lý */}
            <Animated.View entering={FadeInDown.delay(700).duration(400)}>
              <Text style={styles.label}>
                {role === 'staff' ? 'Mã Nhân Viên' : 'Mã Quản Lý'}
              </Text>
              <Field icon="id-card-outline" focused={focus === 'code'}>
                <TextInput
                  style={styles.input}
                  placeholder={role === 'staff' ? 'Nhập mã Nhân Viên' : 'Nhập mã Quản Lý'}
                  placeholderTextColor="#9CA3AF"
                  value={code}
                  onChangeText={setCode}
                  autoCapitalize="none"
                  onFocus={() => setFocus('code')}
                  onBlur={() => setFocus(null)}
                />
              </Field>
            </Animated.View>

            {/* Nút đăng ký */}
            <Animated.View entering={FadeInDown.delay(800).duration(400)}>
              <Animated.View style={btnStyle}>
              <Pressable
                onPressIn={() => (btnScale.value = withSpring(0.95))}
                onPressOut={() => (btnScale.value = withSpring(1))}
                onPress={handleLogin}>
                <LinearGradient
                  colors={['#EC4899', '#8B5CF6', '#6366F1']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}>
                  <Text style={styles.buttonText}>Đăng Ký</Text>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </LinearGradient>
              </Pressable>
            </Animated.View>
            </Animated.View>
            </Animated.View>
          </Animated.View>

          {/* Link quay lại đăng nhập */}
          <Animated.View entering={FadeInUp.delay(900).duration(500)} style={styles.footer}>
            <Text style={styles.footerText}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => router.replace('/login')}>
              <Text style={styles.footerLink}>Đăng nhập</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden' },

  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 50,
  },

  logo: {
    width: 84,
    height: 84,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginTop: 18,
  },

  description: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 22,
  },

  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },

  roleRow: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },

  indicator: {
    position: 'absolute',
    top: 4,
    left: 4,
    bottom: 4,
    borderRadius: 11,
    backgroundColor: '#111827',
  },

  roleButton: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  roleText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  roleTextActive: { color: 'white' },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },

  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'white',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 16,
  },

  fieldFocused: {
    borderColor: '#6366F1',
    backgroundColor: '#F5F7FF',
  },

  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 15,
    color: '#111827',
  },

  button: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },

  buttonText: { color: 'white', fontSize: 17, fontWeight: '700' },

  footer: { flexDirection: 'row', marginTop: 22 },
  footerText: { color: '#6B7280', fontSize: 14 },
  footerLink: { color: '#6366F1', fontSize: 14, fontWeight: '700' },
});