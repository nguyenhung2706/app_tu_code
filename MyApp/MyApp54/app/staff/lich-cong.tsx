import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/theme-context';
import DangKyCaPanel from '@/components/dang-ky-ca-panel';
import FormDoiCa from '@/components/forms/FormDoiCa';
import FormLamThem from '@/components/forms/FormLamThem';
import FormNghiPhep from '@/components/forms/FormNghiPhep';
import FormMuonSom from '@/components/forms/FormMuonSom';
import FormQuenCham from '@/components/forms/FormQuenCham';


const REQUEST_TYPES = [
  { id: 'nghiphep', label: 'Nghỉ phép', icon: 'calendar-outline', color: '#F39C12' },
  { id: 'muonsom', label: 'Muộn / sớm', icon: 'time-outline', color: '#F5B041' },
  { id: 'lamthem', label: 'Làm thêm', icon: 'stopwatch-outline', color: '#8E6BD8' },
  { id: 'doica', label: 'Đổi ca', icon: 'swap-horizontal', color: '#4A90E2' },
  { id: 'dangkyca', label: 'Đăng ký ca', icon: 'calendar', color: '#333' },
  { id: 'quencham', label: 'Quên chấm', icon: 'finger-print', color: '#E74C3C' },
] as const;

export default function LichVaCong() {
  const { colors } = useTheme();
  // null = chưa chọn ô nào -> chưa hiện nội dung bên dưới
  const [activeType, setActiveType] = useState<string | null>(null);

  const onPressType = (id: string) => {
    // bấm lại ô đang chọn thì đóng lại
    setActiveType((prev) => (prev === id ? null : id));
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.bg }]}
      contentContainerStyle={{ paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, { color: colors.text }]}>Lịch & công</Text>
      <Text style={[styles.subtitle, { color: colors.sub }]}>
        Gửi tới quản lý trực tiếp của bạn để duyệt
      </Text>

      {/* 6 ô chức năng */}
      <View style={styles.typeGrid}>
        {REQUEST_TYPES.map((t) => {
          const active = activeType === t.id;
          return (
            <TouchableOpacity
              key={t.id}
              activeOpacity={0.8}
              onPress={() => onPressType(t.id)}
              style={[
                styles.typeCard,
                {
                  backgroundColor: colors.card,
                  borderColor: active ? '#3B2A20' : colors.border,
                  borderWidth: active ? 2 : 1,
                },
              ]}
            >
              <View style={[styles.typeIconWrap, { backgroundColor: t.color + '22' }]}>
                <Ionicons name={t.icon as any} size={18} color={t.color} />
              </View>
              <Text style={[styles.typeLabel, { color: colors.text }]}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Nội dung hiện ra khi bấm 1 trong 6 ô */}
      {activeType === 'dangkyca' && <DangKyCaPanel />}

      {activeType === 'doica' && (
        <View style={styles.formWrap}>
          <FormDoiCa />
        </View>
      )}

      {activeType === 'lamthem' && (
        <View style={styles.formWrap}>
          <FormLamThem />
        </View>
      )}

      {activeType === 'nghiphep' && (
        <View style={styles.formWrap}>
          <FormNghiPhep />
        </View>
      )}

      {activeType === 'muonsom' && (
        <View style={styles.formWrap}>
          <FormMuonSom />
        </View>
      )}

      {activeType === 'quencham' && (
        <View style={styles.formWrap}>
          <FormQuenCham />
        </View>
      )}

      {/* {activeType === 'nghiphep' && <NghiPhepPanel />} */}
      {/* {activeType === 'muonsom' && <MuonSomPanel />} */}
      {/* {activeType === 'quencham' && <QuenChamPanel />} */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', paddingHorizontal: 20, paddingTop: 20 },
  subtitle: { paddingHorizontal: 20, fontSize: 13, marginTop: 4, marginBottom: 14 },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
    justifyContent: 'space-between',
  },
  typeCard: {
    width: '31%',
    marginHorizontal: '1%',
    marginBottom: 10,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  typeIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  typeLabel: { fontSize: 13, fontWeight: '600' },
  formWrap: { paddingHorizontal: 20, marginTop: 6 },
});