import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/theme-context';

export default function PageHeader({ title }: { title: string }) {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.push('/staff/cham-cong')}>
        <Text style={[styles.back, { color: colors.text }]}>←</Text>
      </TouchableOpacity>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <View style={{ width: 22 }} />
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
  back: { fontSize: 22 },
  title: { fontSize: 18, fontWeight: 'bold' },
});