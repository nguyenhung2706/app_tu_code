import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ReactNode } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/theme-context';

export const MAU_NAU = '#7A4B2A';
export const MAU_NAU_MO = '#C9B3A5';

export const them0 = (n: number) => n.toString().padStart(2, '0');

const THU = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

// danh sách `soNgay` ngày, bắt đầu sau hôm nay `lech` ngày (0 = hôm nay)
export function layNgayTiep(soNgay: number, lech = 0) {
  return Array.from({ length: soNgay }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + lech + i);
    return {
      ngay: d,
      thu: THU[d.getDay()],
      ngayThang: `${them0(d.getDate())}/${them0(d.getMonth() + 1)}`,
    };
  });
}

// tiêu đề nhỏ phía trên mỗi nhóm lựa chọn
export function TieuDe({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  return <Text style={[s.tieuDe, { color: colors.text }]}>{children}</Text>;
}

type LuaChonProps = {
  nhan: string;
  phu?: string;
  daChon: boolean;
  khiBam: () => void;
  voHieu?: boolean;
};

// ô lựa chọn (chip) bấm để chọn
export function LuaChon({ nhan, phu, daChon, khiBam, voHieu }: LuaChonProps) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      disabled={voHieu}
      onPress={khiBam}
      activeOpacity={0.8}
      style={[
        s.o,
        { backgroundColor: colors.card, borderColor: colors.border },
        daChon && { backgroundColor: MAU_NAU, borderColor: MAU_NAU },
        voHieu && { opacity: 0.4 },
      ]}
    >
      <Text style={[s.chu, { color: colors.text }, daChon && { color: 'white' }]}>{nhan}</Text>
      {phu ? (
        <Text style={[s.chuPhu, { color: colors.sub }, daChon && { color: 'rgba(255,255,255,0.85)' }]}>
          {phu}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

// nút Gửi: mờ khi chưa nhập đủ
export function NutGui({
  choPhep, nhan, khiBam,
}: { choPhep: boolean; nhan: string; khiBam: () => void }) {
  return (
    <TouchableOpacity
      disabled={!choPhep}
      onPress={khiBam}
      activeOpacity={0.85}
      style={[s.nutGui, { backgroundColor: choPhep ? MAU_NAU : MAU_NAU_MO }]}
    >
      <Text style={s.chuNutGui}>{nhan}</Text>
    </TouchableOpacity>
  );
}

// bộ chỉnh giờ có nút - / +
export function BoChinhGio({
  tieuDe, giaTri, bamTru, bamCong,
}: { tieuDe: string; giaTri: string; bamTru: () => void; bamCong: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={[s.boChinh, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[s.tieuDeBo, { color: colors.sub }]}>{tieuDe}</Text>
      <View style={s.hangBo}>
        <TouchableOpacity onPress={bamTru} style={s.nutBo}>
          <Ionicons name="remove" size={18} color={MAU_NAU} />
        </TouchableOpacity>
        <Text style={[s.giaTriBo, { color: colors.text }]}>{giaTri}</Text>
        <TouchableOpacity onPress={bamCong} style={s.nutBo}>
          <Ionicons name="add" size={18} color={MAU_NAU} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  boChinh: { flex: 1, borderWidth: 1, borderRadius: 12, padding: 12 },
  tieuDeBo: { fontSize: 12, marginBottom: 6 },
  hangBo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  nutBo: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3EBE4', justifyContent: 'center', alignItems: 'center' },
  giaTriBo: { fontSize: 20, fontWeight: 'bold' },
  tieuDe: { fontSize: 15, fontWeight: 'bold', marginTop: 18, marginBottom: 10 },
  o: {
    borderWidth: 1, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 14,
    marginRight: 8, marginBottom: 8, alignItems: 'center', minWidth: 56,
  },
  chu: { fontSize: 13, fontWeight: '600' },
  chuPhu: { fontSize: 11, marginTop: 2 },
  nutGui: { borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 22 },
  chuNutGui: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});