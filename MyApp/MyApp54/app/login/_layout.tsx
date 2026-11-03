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
    if (loading) return;
    const first = segments[0] as string | undefined;
    const inLogin = first === 'login';

    if (!user) {
      if (!inLogin) router.replace('/login' as any);
      return;
    }
    const target = user.role === 'manager' ? 'manager' : 'staff';
    if (inLogin || first !== target) router.replace(`/${target}` as any);
  }, [user, loading, segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
  <Stack.Screen name="dangnhap" options={{ headerShown: false }} />
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