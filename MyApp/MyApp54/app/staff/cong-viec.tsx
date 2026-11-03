import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTasks, TaskStatus } from '@/context/task-context';
import { useTheme } from '@/context/theme-context';
import StaffHeader from '@/components/StaffHeader';

export default function CongViec() {
  const { tasks, updateTaskStatus } = useTasks();
  const { colors } = useTheme();

  const statusColor = (status: TaskStatus) => {
    if (status === 'Hoàn Thành') return '#2ECC71';
    if (status === 'Đã Làm') return '#4A90E2';
    return '#999'; // Chưa Làm
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
            <StaffHeader title="Công Việc" showMenu={false}/>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {tasks.map((task) => (
          <View style={[styles.card, { backgroundColor: colors.card }]} key={task.id}>
            <Text style={[styles.title, { color: colors.text }]}>{task.title}</Text>
            <Text style={[styles.deadline, { color: colors.sub }]}>Hạn chót: {task.deadline}</Text>

            <View style={styles.statusRow}>
              <Text style={[styles.statusBadge, { color: statusColor(task.status) }]}>
                ● {task.status}
              </Text>
            </View>

            {task.status !== 'Hoàn Thành' && (
              <View style={styles.actionRow}>
                {task.status === 'Chưa Làm' && (
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#4A90E2' }]}
                    onPress={() => updateTaskStatus(task.id, 'Đã Làm')}
                  >
                    <Text style={styles.actionText }>Bắt đầu làm</Text>
                  </TouchableOpacity>
                )}
                {task.status === 'Đã Làm' && (
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#2ECC71' }]}
                    onPress={() => updateTaskStatus(task.id, 'Hoàn Thành')}
                  >
                    <Text style={styles.actionText}>Hoàn thành</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingHorizontal: 20, paddingTop: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  menuIcon: { fontSize: 20 },
  card: { backgroundColor: 'white', borderRadius: 10, padding: 15, marginBottom: 12 },
  title: { fontSize: 15, fontWeight: '600' },
  deadline: { fontSize: 13, color: 'gray', marginTop: 4 },
  statusRow: { marginTop: 8 },
  statusBadge: { fontSize: 13, fontWeight: '600' },
  actionRow: { marginTop: 10 },
  actionButton: { paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  actionText: { color: 'white', fontWeight: '600', fontSize: 13 },
});