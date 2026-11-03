import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/context/theme-context';

// ====== CẤU HÌNH ======
const BROWN = '#7B4F32';
const BLUE_PENDING = '#2F5BA8';
const DRAFT_KEY = 'dangkyca_draft_v1';

const SHIFTS = [
  { id: 'sang', name: 'Ca sáng', time: '07:00-12:00', hours: 5 },
  { id: 'chieu', name: 'Ca chiều', time: '12:00-17:00', hours: 5 },
  { id: 'toi', name: 'Ca tối', time: '17:00-22:00', hours: 5 },
];
const DAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

// ====== TIỆN ÍCH ======
const pad = (n: number) => String(n).padStart(2, '0');
const toKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** 7 ngày (T2 -> CN) của tuần cách hiện tại `offset` tuần */
function getWeekDates(offset = 1) {
  const today = new Date();
  const diffToMonday = (today.getDay() + 6) % 7;
  const monday = new Date(today);
  monday.setDate(today.getDate() - diffToMonday + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

// ====== DỮ LIỆU GIẢ (thay bằng API) — key = `${ngày}_${idCa}` ======
const MOCK_PENDING: string[] = [];
const MOCK_SCHEDULED: string[] = [];

export default function DangKyCaPanel() {
  const { colors } = useTheme();

  const [weekOffset] = useState(1); // 1 = tuần sau
  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset]);

  const [selected, setSelected] = useState<string[]>([]);
  const [pending, setPending] = useState<string[]>(MOCK_PENDING);
  const [scheduled] = useState<string[]>(MOCK_SCHEDULED);
  const [note, setNote] = useState('');
  const [loaded, setLoaded] = useState(false);

  // Tải nháp
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(DRAFT_KEY);
        if (raw) {
          const draft = JSON.parse(raw);
          setSelected(draft.selected ?? []);
          setNote(draft.note ?? '');
        }
      } catch {}
      setLoaded(true);
    })();
  }, []);

  // Tự lưu nháp
  useEffect(() => {
    if (!loaded) return;
    if (selected.length === 0 && note.trim() === '') AsyncStorage.removeItem(DRAFT_KEY);
    else AsyncStorage.setItem(DRAFT_KEY, JSON.stringify({ selected, note }));
  }, [selected, note, loaded]);

  const hasDraft = selected.length > 0 || note.trim() !== '';
  const totalHours = selected.length * 5;

  const toggleCell = (key: string) => {
    if (pending.includes(key) || scheduled.includes(key)) return;
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const clearDraft = () => {
    setSelected([]);
    setNote('');
    AsyncStorage.removeItem(DRAFT_KEY);
  };

  const submit = () => {
    if (selected.length === 0) {
      Alert.alert('Chưa chọn ca', 'Hãy chọn ít nhất 1 ca để đăng ký.');
      return;
    }
    // TODO: gọi API gửi đăng ký ở đây
    setPending((prev) => [...prev, ...selected]);
    clearDraft();
    Alert.alert('Đã gửi', 'Đăng ký ca đã được gửi, chờ quản lý duyệt.');
  };

  const weekRange = `${pad(weekDates[0].getDate())}/${pad(weekDates[0].getMonth() + 1)} – ${pad(
    weekDates[6].getDate()
  )}/${pad(weekDates[6].getMonth() + 1)}`;
  const weekTitle = weekOffset === 1 ? 'Tuần sau' : weekOffset === 0 ? 'Tuần này' : 'Tuần';

  return (
    <View style={styles.section}>
      <View style={styles.weekRow}>
        <Text style={[styles.weekTitle, { color: colors.text }]}>
          {weekTitle} · {weekRange}
        </Text>
        <Text style={[styles.weekSummary, { color: colors.sub }]}>
          Đã chọn {selected.length} ca · {totalHours} giờ
        </Text>
      </View>

      {/* Hàng tiêu đề các ngày */}
      <View style={styles.gridRow}>
        <View style={styles.shiftLabelCol} />
        {weekDates.map((d, i) => (
          <View key={i} style={styles.dayCol}>
            <Text style={[styles.dayName, { color: i === 6 ? '#C0392B' : colors.text }]}>
              {DAY_LABELS[i]}
            </Text>
            <Text style={[styles.dayNum, { color: colors.sub }]}>{d.getDate()}</Text>
          </View>
        ))}
      </View>

      {/* Các hàng ca */}
      {SHIFTS.map((shift) => (
        <View key={shift.id} style={styles.gridRow}>
          <View style={styles.shiftLabelCol}>
            <Text style={[styles.shiftName, { color: colors.text }]}>{shift.name}</Text>
            <Text style={[styles.shiftTime, { color: colors.sub }]}>{shift.time}</Text>
          </View>

          {weekDates.map((d, i) => {
            const key = `${toKey(d)}_${shift.id}`;
            const isSelected = selected.includes(key);
            const isPending = pending.includes(key);
            const isScheduled = scheduled.includes(key);
            return (
              <View key={i} style={styles.dayCol}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => toggleCell(key)}
                  style={[
                    styles.cell,
                    { backgroundColor: colors.card, borderColor: colors.border },
                    isScheduled && { backgroundColor: '#EADBCB', borderColor: '#EADBCB' },
                    isPending && styles.cellPending,
                    isSelected && { backgroundColor: BROWN, borderColor: BROWN },
                  ]}
                >
                  {isSelected && <Ionicons name="checkmark" size={20} color="#fff" />}
                  {isPending && <Text style={styles.pendingText}>Chờ</Text>}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      ))}

      {/* Chú thích */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: BROWN }]} />
          <Text style={[styles.legendText, { color: colors.sub }]}>Bạn chọn</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, styles.legendDashed]} />
          <Text style={[styles.legendText, { color: colors.sub }]}>Đã gửi, chờ duyệt</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendBox, { backgroundColor: '#EADBCB' }]} />
          <Text style={[styles.legendText, { color: colors.sub }]}>Đã xếp lịch</Text>
        </View>
      </View>

      {/* Ghi chú */}
      <Text style={[styles.noteLabel, { color: colors.text }]}>Ghi chú (không bắt buộc)</Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="VD: Thứ Tư em chỉ làm được ca chiều"
        placeholderTextColor={colors.sub}
        multiline
        style={[
          styles.noteInput,
          { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
        ]}
      />

      {/* Nháp */}
      <View style={styles.draftRow}>
        <Text style={[styles.draftText, { color: colors.sub }]}>Nháp được tự lưu trên máy này.</Text>
        {hasDraft && (
          <TouchableOpacity onPress={clearDraft}>
            <Text style={[styles.draftClear, { color: colors.text }]}>Xoá nháp</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={submit}
        style={[styles.submitBtn, selected.length === 0 && { opacity: 0.5 }]}
      >
        <Text style={styles.submitText}>Gửi đăng ký</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 20, marginTop: 14 },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  weekTitle: { fontSize: 15, fontWeight: '700' },
  weekSummary: { fontSize: 12 },

  gridRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  shiftLabelCol: { width: 78, paddingRight: 4 },
  shiftName: { fontSize: 13, fontWeight: '700' },
  shiftTime: { fontSize: 11, marginTop: 2 },
  dayCol: { flex: 1, alignItems: 'center', paddingHorizontal: 2 },
  dayName: { fontSize: 12, fontWeight: '700' },
  dayNum: { fontSize: 11, marginTop: 2, marginBottom: 4 },

  cell: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellPending: {
    backgroundColor: '#EAF1FB',
    borderColor: BLUE_PENDING,
    borderStyle: 'dashed',
    borderWidth: 1.5,
  },
  pendingText: { fontSize: 11, fontWeight: '700', color: BLUE_PENDING },

  legendRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, marginBottom: 18 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 14 },
  legendBox: { width: 14, height: 14, borderRadius: 4, marginRight: 6 },
  legendDashed: {
    backgroundColor: '#EAF1FB',
    borderColor: BLUE_PENDING,
    borderStyle: 'dashed',
    borderWidth: 1.5,
  },
  legendText: { fontSize: 12 },

  noteLabel: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  noteInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 50,
    fontSize: 14,
  },
  draftRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 18,
  },
  draftText: { fontSize: 13 },
  draftClear: { fontSize: 14, fontWeight: '700' },

  submitBtn: {
    backgroundColor: BROWN,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});