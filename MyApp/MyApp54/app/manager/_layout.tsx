import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from '@/context/theme-context';

function ManagerTabs() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: colors.bg,
          borderTopWidth: 0.5,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tổng quan',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="nhan-vien"
        options={{
          title: 'Nhân viên',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cong-viec"
        options={{
          title: 'Chấm công',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="don-tu"
        options={{
          title: 'Đơn từ',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ca-nhan"
        options={{
          title: 'Cá nhân',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      {/* ẩn các màn hình không hiện trên thanh tab */}
      <Tabs.Screen name="hop-dong" options={{ href: null }} />
      <Tabs.Screen name="reports" options={{ href: null }} />
      <Tabs.Screen name="thong-tin" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="cai-dat" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="mat-khau" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="thong-bao" options={{ href: null, tabBarStyle: { display: 'none' } }} />

    </Tabs>
  );
}

export default function ManagerTabsLayout() {
  return (
    <ThemeProvider>
      <ManagerTabs />
    </ThemeProvider>
  );
}