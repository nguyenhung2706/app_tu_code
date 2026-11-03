import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { contracts } from '@/data/hop-dong-data';

export default function HopDongList() {
  const router = useRouter();
  const { filter } = useLocalSearchParams<{ filter?: string }>();

  const filteredContracts = contracts.filter((item) =>
    filter ? item.status === filter : true
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{filter ? filter : 'Hợp đồng'}</Text>
        <Text style={{ width: 22 }}>⟳</Text>
      </View>

      <Text style={styles.subTitle}>Có {filteredContracts.length} hợp đồng</Text>

      <FlatList
        data={filteredContracts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: './manager/hop-dong/[id]',
                params: { id: item.id },
              })
            }
          >
            <Text style={styles.contractId}>{item.id}</Text>
            <Text style={styles.employeeName}>{item.employeeName}</Text>
            <Text style={styles.contractType}>{item.type}</Text>
            <Text style={styles.signDate}>Ngày kí: {item.signDate}</Text>

            <View style={styles.footer}>
              <Text style={styles.viewDetail}>Xem chi tiết</Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
    marginBottom: 8,
  },
  backIcon: {
    fontSize: 22,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 15,
  },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  contractId: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
    marginBottom: 5,
  },
  employeeName: {
    fontSize: 18,
    fontWeight: '600',
  },
  contractType: {
    fontSize: 14,
    color: 'gray',
    marginTop: 2,
  },
  signDate: {
    fontSize: 13,
    color: 'gray',
    marginTop: 4,
  },
  footer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  viewDetail: {
    fontSize: 13,
    color: '#4A90E2',
    fontWeight: '600',
  },
});