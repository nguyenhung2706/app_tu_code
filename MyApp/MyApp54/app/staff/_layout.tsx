import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AttendanceProvider } from '@/context/attendance-context';
import { LeaveRequestProvider } from '@/context/leave-repuest-context';
import { TaskProvider } from '@/context/task-context';
import { ThemeProvider, useTheme } from '@/context/theme-context';

const GREEN = '#2ECC71';

// Nút tròn xanh nổi ở giữa
function CenterTabButton({ onPress, accessibilityState }: any) {
  const { colors } = useTheme();
  const focused = accessibilityState?.selected;

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.centerWrap}>
      <View style={[styles.centerCircle, { borderColor: colors.bg }]}>
        <Ionicons name="add" size={30} color="#fff" />
      </View>
      <Text style={[styles.centerLabel, { color: focused ? GREEN : colors.sub }]}>Tạo đơn</Text>
    </TouchableOpacity>
  );
}

function StaffTabs() {
  const { colors } = useTheme();

  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: GREEN,
        tabBarInactiveTintColor: 'gray',
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
          title: 'Chấm công',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="lich-cong"
        options={{
          title: 'Lịch & công',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="don-tu"
        options={{
          title: 'Tạo đơn',
          tabBarButton: (props) => <CenterTabButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="luong"
        options={{
          title: 'Lương',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ca-nhan"
        options={{
          title: 'Tôi',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      {/* ẩn các màn hình không hiện trên thanh tab */}
      <Tabs.Screen name="cham-cong" options={{ href: null }} />
      <Tabs.Screen name="cong-viec" options={{ href: null }} />
      <Tabs.Screen name="lich-su-cham-cong" options={{ href: null }} />
      <Tabs.Screen name="tao-don" options={{ href: null }} />
      <Tabs.Screen name="thong-tin" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="mat-khau" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="thong-bao" options={{ href: null, tabBarStyle: { display: 'none' } }} />
      <Tabs.Screen name="cai-dat" options={{ href: null, tabBarStyle: { display: 'none' } }} />
    </Tabs>
  );
}

export default function StaffTabsLayout() {
  return (
    <AttendanceProvider>
      <LeaveRequestProvider>
        <TaskProvider>
          <ThemeProvider>
            <StaffTabs />
          </ThemeProvider>
        </TaskProvider>
      </LeaveRequestProvider>
    </AttendanceProvider>
  );
}

const styles = StyleSheet.create({
  centerWrap: {
    flex: 1,
    alignItems: 'center',
  },
  centerCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -22,
    borderWidth: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  centerLabel: {
    fontSize: 12,
    marginTop: 2,
  },
});