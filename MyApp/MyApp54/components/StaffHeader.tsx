import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/theme-context';

type Props = {
  title: string;
  showMenu?: boolean; // true: hiện ☰, false: ẩn (trang chỉ có chuông)
};

export default function ManagerHeader({ title, showMenu = true }: Props) {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      {showMenu ? (
        <TouchableOpacity
          onPress={() => router.push('/manager/cai-dat' as any)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="menu-outline" size={26} color={colors.text} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 26 }} />
      )}

      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

      <TouchableOpacity
        onPress={() => router.push('/manager/thong-bao' as any)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="notifications-outline" size={26} color={colors.text} />
        <View style={styles.dot} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 18, fontWeight: 'bold' },
  dot: {
    position: 'absolute',
    top: 0,
    right: 1,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#E74C3C',
  },
});