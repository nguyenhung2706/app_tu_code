import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import PageHeader from '@/components/page-header';
import { useTheme } from '@/context/theme-context';
import { useLeaveRequests, RequestKind } from '@/context/leave-repuest-context';

export type FormField = {
  key: string;
  label: string;
  placeholder?: string;
  multiline?: boolean;
  optional?: boolean;
};

type Props = {
  title: string;       // tiêu đề trên cùng của trang
  kind: RequestKind;   // loại yêu cầu, để phân biệt trong danh sách chung
  typeLabel: string;   // tên hiển thị, vd 'Quên chấm công'
  fields: FormField[]; // danh sách ô nhập
};

export default function RequestForm({ title, kind, typeLabel, fields }: Props) {
  const router = useRouter();
  const { colors } = useTheme();
  const { addRequest } = useLeaveRequests();
  const [values, setValues] = useState<Record<string, string>>({});

  const setValue = (key: string, text: string) =>
    setValues((prev) => ({ ...prev, [key]: text }));

  const handleSubmit = () => {
    const missing = fields.find((f) => !f.optional && !values[f.key]?.trim());
    if (missing) {
      Alert.alert('Thiếu thông tin', `Vui lòng điền "${missing.label}".`);
      return;
    }

    // Tách các ô có tên cố định ra, phần còn lại gom vào details
    const { startDate, endDate, date, reason, ...rest } = values;
    addRequest({
      kind,
      type: typeLabel,
      startDate: startDate ?? date ?? '',
      endDate: endDate ?? date ?? startDate ?? '',
      reason: reason ?? '',
      details: rest,
    });

    setValues({});
    Alert.alert('Đã gửi', 'Yêu cầu của bạn đã được gửi tới quản lý.');
    router.push('/staff/cham-cong');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <PageHeader title={title} />

        {fields.map((f) => (
          <View key={f.key}>
            <Text style={[styles.label, { color: colors.sub }]}>
              {f.label}
              {f.optional ? ' (không bắt buộc)' : ''}
            </Text>
            <TextInput
              style={[
                styles.input,
                f.multiline && styles.textArea,
                { backgroundColor: colors.card, color: colors.text },
              ]}
              placeholder={f.placeholder}
              placeholderTextColor={colors.sub}
              value={values[f.key] ?? ''}
              onChangeText={(t) => setValue(f.key, t)}
              multiline={f.multiline}
            />
          </View>
        ))}

        <TouchableOpacity style={styles.submit} onPress={handleSubmit}>
          <Text style={styles.submitText}>Gửi yêu cầu</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 40 },
  label: { fontSize: 14, marginBottom: 6, marginTop: 14 },
  input: {
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 14,
    fontSize: 15,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  submit: {
    backgroundColor: '#2ECC71',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 28,
  },
  submitText: { color: 'white', fontWeight: '600', fontSize: 15 },
});