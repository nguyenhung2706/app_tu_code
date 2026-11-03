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
import { useAuth } from '@/context/AuthContext';

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
    <Animated.View entering={FadeInDown.duration(600)}>
      <Animated.View style={anim}>
        <LinearGradient
          colors={['#6366F1', '#EC4899']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logo}>
          <Ionicons name="people" size={42} color="white" />
        </LinearGradient>
      </Animated.View>
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

export default function LoginScreen() {
  const { login } = useAuth();

  const [role, setRole] = useState<'staff' | 'manager'>('staff');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focus, setFocus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  // Rung khi nhập thiếu hoặc sai
  const shake = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shake.value }] }));

  const shakeForm = () => {
    shake.value = withSequence(
      withTiming(-10, { duration: 60 }),
      withTiming(10, { duration: 60 }),
      withTiming(-8, { duration: 60 }),
      withTiming(8, { duration: 60 }),
      withTiming(0, { duration: 60 })
    );
  };

  const handleLogin = async () => {
    if (loading) return;

    if (!username.trim() || !password || !code.trim()) {
      shakeForm();
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);
    try {
      const res = await login(username.trim(), password, role, code.trim());
      if (!res.ok) {
        shakeForm();
        alert(res.message || 'Đăng nhập thất bại');
        return;
      }
      setPassword('');
      setCode('');
      // Guard trong app/_layout.tsx tự chuyển sang /manager hoặc /staff
    } catch (e) {
      console.log('Lỗi đăng nhập:', e);
      alert('Có lỗi khi đăng nhập, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#EEF2FF', '#FDF2F8', '#ECFEFF']} style={styles.container}>
      <Blob size={260} color="#A5B4FC" delay={0} style={{ top: -80, left: -90 }} />
      <Blob size={200} color="#F9A8D4" delay={600} style={{ bottom: 40, right: -70 }} />
      <Blob size={120} color="#67E8F9" delay={300} style={{ top: 260, right: -30 }} />

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
            Đăng Nhập
          </Animated.Text>

          <Animated.Text entering={FadeInDown.delay(250).duration(500)} style={styles.description}>
            Chào mừng bạn quay lại 👋
          </Animated.Text>

          {/* Thẻ form: lớp ngoài chỉ có entering, lớp trong có hiệu ứng rung */}
          <Animated.View entering={FadeInUp.delay(350).duration(500)} style={{ width: '100%' }}>
            <Animated.View style={[styles.card, shakeStyle]}>
              {/* Chọn vai trò */}
              <View
                style={styles.roleRow}
                onLayout={(e) => setRowWidth(e.nativeEvent.layout.width)}>
                <Animated.View style={[styles.indicator, { width: indicatorW }, indicatorStyle]} />

                <TouchableOpacity style={styles.roleButton} onPress={() => setRole('staff')}>
                  <Ionicons
                    name="person"
                    size={16}
                    color={role === 'staff' ? 'white' : '#6B7280'}
                  />
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

              {/* Tài khoản (email) */}
              <View>
                <Text style={styles.label}>Tài khoản</Text>
                <Field icon="mail-outline" focused={focus === 'user'}>
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập email"
                    placeholderTextColor="#9CA3AF"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onFocus={() => setFocus('user')}
                    onBlur={() => setFocus(null)}
                  />
                </Field>
              </View>

              {/* Mật khẩu */}
              <View>
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
              </View>

              {/* Mã nhân viên / quản lý */}
              <View>
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
              </View>

              {/* Nút đăng nhập: lớp ngoài là View thường, lớp trong có hiệu ứng nhún */}
              <Animated.View style={btnStyle}>
                <Pressable
                  disabled={loading}
                  onPressIn={() => (btnScale.value = withSpring(0.95))}
                  onPressOut={() => (btnScale.value = withSpring(1))}
                  onPress={handleLogin}>
                  <LinearGradient
                    colors={['#6366F1', '#8B5CF6', '#EC4899']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.button, loading && { opacity: 0.7 }]}>
                    <Text style={styles.buttonText}>
                      {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                    </Text>
                    {!loading && <Ionicons name="arrow-forward" size={20} color="white" />}
                  </LinearGradient>
                </Pressable>
              </Animated.View>
            </Animated.View>
          </Animated.View>

          {/* Link đăng ký */}
          <Animated.View entering={FadeInUp.delay(900).duration(500)}>
            <View style={styles.footer}>
              <Text style={styles.footerText}>Chưa có tài khoản? </Text>
              <TouchableOpacity onPress={() => router.push('/login/register' as any)}>
                <Text style={styles.footerLink}>Đăng ký</Text>
              </TouchableOpacity>
            </View>
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
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },

  title: { fontSize: 28, fontWeight: '800', color: '#111827', marginTop: 18 },

  description: { fontSize: 15, color: '#6B7280', marginTop: 4, marginBottom: 22 },

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

  label: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 6 },

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

  fieldFocused: { borderColor: '#6366F1', backgroundColor: '#F5F7FF' },

  input: { flex: 1, paddingVertical: 13, fontSize: 15, color: '#111827' },

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