import { View, Text, StyleSheet } from 'react-native';

export default function Reports() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Báo Cáo</Text>
      <Text>Đây là trang báo cáo.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
});