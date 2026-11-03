
import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '@/context/AuthContext';

function Guard() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Đợi AuthContext kiểm tra trạng thái đăng nhập
    if (loading) return;

    const first = segments[0] as string | undefined;
    const inLogin = first === 'login';
    const inManager = first === 'manager';
    const inStaff = first === 'staff';

    console.log('GUARD PATH:', segments.join('/'));
    console.log('GUARD USER:', user?.role ?? null);
    console.log('GUARD LOADING:', loading);

    // Chưa đăng nhập: chỉ cho phép ở trang chào hoặc đăng nhập
    if (!user) {
      if (!inLogin && first !== undefined) {
        router.replace('/login' as any);
      }
      return;
    }

    // Đã đăng nhập: xác định trang theo quyền
    const target = user.role === 'manager' ? '/manager' : '/staff';

    // Đang ở trang đăng nhập thì chuyển đến trang tương ứng
    if (inLogin) {
      router.replace(target as any);
      return;
    }

    // Tài khoản quản lý không được vào khu vực nhân viên
    if (user.role === 'manager' && inStaff) {
      router.replace('/manager' as any);
      return;
    }

    // Tài khoản nhân viên không được vào khu vực quản lý
    if (user.role !== 'manager' && inManager) {
      router.replace('/staff' as any);
    }
  }, [user, loading, segments, router]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Guard />
      </AuthProvider>

      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
