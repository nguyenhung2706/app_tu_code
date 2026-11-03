import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { useTheme } from '@/context/theme-context';
import {
  LuaChon, TieuDe, NutGui, BoChinhGio, MAU_NAU, layNgayTiep, them0,
} from './FormChung';

const CA_BAT_DAU = 8 * 60 + 30;   // ca hành chính vào 08:30
const CA_KET_THUC = 17 * 60 + 30; // ra 17:30
const BUOC = 15;                  // mỗi lần bấm +/- là 15 phút

type Loai = 'muon' | 'som';

const CAC_LY_DO = [
  { ma: 'ketxe', ten: 'Kẹt xe' },
  { ma: 'giadinh', ten: 'Việc gia đình' },
  { ma: 'khambenh', ten: 'Khám bệnh' },
  { ma: 'khac', ten: 'Khác' },
];

const dinhDangGio = (phut: number) => `${them0(Math.floor(phut / 60))}:${them0(phut % 60)}`;

// 75 -> "1 giờ 15 phút", 20 -> "20 phút"
const chuPhut = (phut: number) => {
  const h = Math.floor(phut / 60);
  const m = phut % 60;
  if (h === 0) return `${m} phút`;
  return m === 0 ? `${h} giờ` : `${h} giờ ${m} phút`;
};

type Props = { khiGui?: (duLieu: any) => void };

export default function FormMuonSom({ khiGui }: Props) {
  const { colors } = useTheme();
  const cacNgay = layNgayTiep(5, -2); // 2 ngày trước, hôm nay (vị trí 2), 2 ngày sau

  const [loai, setLoai] = useState<Loai>('muon');
  const [ngayChon, setNgayChon] = useState(2);
  const [gio, setGio] = useState(9 * 60);
  const [lyDo, setLyDo] = useState<string | null>(null);
  const [ghiChu, setGhiChu] = useState('');

  const doiLoai = (l: Loai) => {
    setLoai(l);
    // giờ gợi ý mặc định cho từng loại
    setGio(l === 'muon' ? 9 * 60 : 16 * 60 + 30);
  };

  const doiGio = (delta: number) => setGio(Math.min(Math.max(0, gio + delta), 23 * 60 + 45));

  // số phút lệch so với ca
  const lech = loai === 'muon' ? gio - CA_BAT_DAU : CA_KET_THUC - gio;

  const hopLe =
    lech > 0 &&
    !!lyDo &&
    (lyDo !== 'khac' || ghiChu.trim().length >= 5);

  const guiDon = () => {
    const n = cacNgay[ngayChon];
    khiGui?.({
      ngay: n.ngay.toISOString(),
      loai,
      gio: dinhDangGio(gio),
      soPhut: lech,
      lyDo,
      ghiChu: ghiChu.trim(),
    });
    Alert.alert(
      loai === 'muon' ? 'Đã gửi đơn đi muộn' : 'Đã gửi đơn về sớm',
      `${n.thu} ${n.ngayThang} · ${dinhDangGio(gio)} (${chuPhut(lech)})`
    );
    setLyDo(null);
    setGhiChu('');
  };

  return (
    <View>
      <TieuDe>Loại đơn</TieuDe>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <LuaChon nhan="Đi muộn" daChon={loai === 'muon'} khiBam={() => doiLoai('muon')} />
        <LuaChon nhan="Về sớm" daChon={loai === 'som'} khiBam={() => doiLoai('som')} />
      </View>

      <TieuDe>Ngày</TieuDe>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {cacNgay.map((n, i) => (
          <LuaChon
            key={i}
            nhan={n.thu}
            phu={i === 2 ? 'Hôm nay' : n.ngayThang}
            daChon={i === ngayChon}
            khiBam={() => setNgayChon(i)}
          />
        ))}
      </ScrollView>

      <TieuDe>{loai === 'muon' ? 'Giờ dự kiến đến' : 'Giờ dự kiến về'}</TieuDe>
      <View style={{ flexDirection: 'row' }}>
        <BoChinhGio
          tieuDe={loai === 'muon' ? 'Đến lúc' : 'Về lúc'}
          giaTri={dinhDangGio(gio)}
          bamTru={() => doiGio(-BUOC)}
          bamCong={() => doiGio(BUOC)}
        />
      </View>

      <View style={[s.tomTat, { backgroundColor: lech > 0 ? '#FFF6E0' : '#FDECEA' }]}>
        <Text style={[s.tomTatChinh, { color: lech > 0 ? '#B9770E' : '#C0392B' }]}>
          {lech > 0
            ? loai === 'muon'
              ? `Muộn ${chuPhut(lech)} so với ca ${dinhDangGio(CA_BAT_DAU)}`
              : `Sớm ${chuPhut(lech)} so với giờ ra ca ${dinhDangGio(CA_KET_THUC)}`
            : loai === 'muon'
              ? `Giờ đến phải sau ${dinhDangGio(CA_BAT_DAU)}`
              : `Giờ về phải trước ${dinhDangGio(CA_KET_THUC)}`}
        </Text>
      </View>

      <TieuDe>Lý do</TieuDe>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {CAC_LY_DO.map((l) => (
          <LuaChon key={l.ma} nhan={l.ten} daChon={lyDo === l.ma} khiBam={() => setLyDo(l.ma)} />
        ))}
      </View>

      <TieuDe>Ghi chú {lyDo === 'khac' ? '(bắt buộc)' : '(không bắt buộc)'}</TieuDe>
      <TextInput
        style={[s.oNhap, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
        placeholder="VD: Xe hỏng giữa đường, em đang gọi sửa"
        placeholderTextColor="#999"
        value={ghiChu}
        onChangeText={setGhiChu}
        multiline
      />

      <NutGui
        choPhep={hopLe}
        nhan={loai === 'muon' ? 'Gửi đơn đi muộn' : 'Gửi đơn về sớm'}
        khiBam={guiDon}
      />
    </View>
  );
}

const s = StyleSheet.create({
  tomTat: { borderRadius: 12, padding: 12, marginTop: 12 },
  tomTatChinh: { fontSize: 14, fontWeight: 'bold' },
  oNhap: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 14, minHeight: 80, textAlignVertical: 'top' },
});