import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { leaveRequests as initialRequests, LeaveRequest, RequestStatus } from '@/data/don-tu-data';
const TABS: RequestStatus[] = ['Chờ duyệt', 'Đã duyệt', 'Từ chối'];

export default function DonTu() {
  // Bước quan trọng: đưa mảng gốc vào useState để có thể thay đổi được
  const [requests, setRequests] = useState<LeaveRequest[]>(initialRequests);
  const [activeTab, setActiveTab] = useState<RequestStatus>('Chờ duyệt');

  const filteredRequests = requests.filter((item) => item.status === activeTab);

  // Hàm cập nhật trạng thái của 1 đơn cụ thể
  const updateStatus = (id: string, newStatus: RequestStatus) => {
    setRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.menuIcon}>☰</Text>
        <Text style={styles.headerTitle}>Đơn từ</Text>
        <Text style={styles.menuIcon}>⋮</Text>
      </View>

      {/* Thanh tab con: Chờ duyệt / Đã duyệt / Từ chối */}
      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.tabButtonActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {filteredRequests.length === 0 && (
          <Text style={styles.emptyText}>Không có đơn nào</Text>
        )}

        {filteredRequests.map((item) => (
          <View style={styles.card} key={item.id}>
            <View style={styles.cardHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.employeeName.charAt(0)}</Text>
              </View>
              <View>
                <Text style={styles.employeeName}>{item.employeeName}</Text>
                <Text style={styles.requestType}>{item.type}</Text>
              </View>
            </View>

            <Text style={styles.date}>{item.date}</Text>
            <Text style={styles.reason}>Lý do: {item.reason}</Text>

            {item.status === 'Chờ duyệt' && (
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.rejectButton}
                  onPress={() => updateStatus(item.id, 'Từ chối')}
                >
                  <Text style={styles.actionText}>Từ chối</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.approveButton}
                  onPress={() => updateStatus(item.id, 'Đã duyệt')}
                >
                  <Text style={styles.actionText}>Duyệt</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  menuIcon: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#e8e8e8',
    borderRadius: 8,
    padding: 4,
    marginBottom: 15,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: 'white',
  },
  tabText: {
    fontSize: 13,
    color: 'gray',
  },
  tabTextActive: {
    color: '#000',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 30,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
  },
  employeeName: {
    fontSize: 15,
    fontWeight: '600',
  },
  requestType: {
    fontSize: 13,
    color: 'gray',
  },
  date: {
    fontSize: 13,
    color: 'gray',
    marginBottom: 4,
  },
  reason: {
    fontSize: 14,
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  rejectButton: {
    flex: 1,
    backgroundColor: '#E74C3C',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveButton: {
    flex: 1,
    backgroundColor: '#2ECC71',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontWeight: '600',
  },
});