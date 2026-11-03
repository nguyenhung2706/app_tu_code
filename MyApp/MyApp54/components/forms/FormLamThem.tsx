import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/theme-context';
import { LuaChon, TieuDe, NutGui, MAU_NAU, layNgayTiep, them0 } from './FormChung';

const GIO_DA_DUNG = 12;  // số giờ làm thêm đã dùng trong tháng (sau này lấy từ dữ liệu thật)
const GIO_TOI_DA = 40;   // trần làm thêm mỗi tháng
const BUOC = 30;         // mỗi lần bấm +/- là 30 phút

type LoaiNgay = 'thuong' | 'cuoituan' | 'le';
const CAC_LOAI_NGAY: { ma: LoaiNgay; ten: string; heSo: number }[] = [
  { ma: 'thuong', ten: 'Ngày thường', heSo: 150 },
  { ma: 'cuoituan', ten: 'Cuối tuần', heSo: 200 },
  { ma: 'le', ten: 'Ngày lễ', heSo: 300 },
];

// đổi số phút trong ngày thành "HH:MM"
const dinhDangGio = (phut: number) => `${them0(Math.floor(phut / 60))}:${them0(phut % 60)}`;

type Props = { khiGui?: (duLieu: any) => void };

export default function FormLamThem({ khiGui }: Props) {
  const { colors } = useTheme();
  const cacNgay = layNgayTiep(7, 0);

  const [ngayChon, setNgayChon] = useState(0);
  const [loaiNgay, setLoaiNgay] = useState<LoaiNgay>('thuong');
  const [batDau, setBatDau] = useState(18 * 60);
  const [ketThuc, setKetThuc] = useState(20 * 60);
  const [noiDung, setNoiDung] = useState('');

  const chonNgay = (i: number) => {
    setNgayChon(i);
    const thu = cacNgay[i].ngay.getDay();
    // tự gợi ý loại ngày; ngày lễ thì người dùng tự chọn
    setLoaiNgay(thu === 0 || thu === 6 ? 'cuoituan' : 'thuong');
  };

  const soGio = Math.max(0, (ketThuc - batDau) / 60);
  const chuSoGio = `${soGio}`.replace('.', ',');
  const tongSauKhiGui = GIO_DA_DUNG + soGio;
  const vuotGioiHan = tongSauKhiGui > GIO_TOI_DA;
  const heSo = CAC_LOAI_NGAY.find((l) => l.ma === loaiNgay)!.heSo;

  const doiBatDau = (delta: number) =>
    setBatDau(Math.min(Math.max(0, batDau + delta), 23 * 60 + 30));
  const doiKetThuc = (delta: number) =>
    setKetThuc(Math.min(Math.max(BUOC, ketThuc + delta), 24 * 60));

  const hopLe = soGio > 0 && noiDung.trim().length >= 5 && !vuotGioiHan;

  const guiDon = () => {
    const n = cacNgay[ngayChon];
    khiGui?.({
      ngay: n.ngay.toISOString(),
      loaiNgay,
      batDau: dinhDangGio(batDau),
      ketThuc: dinhDangGio(ketThuc),
      soGio,
      noiDung: noiDung.trim(),
    });
    Alert.alert(
      'Đã gửi đơn làm thêm',
      `${n.thu} ${n.ngayThang} · ${dinhDangGio(batDau)} - ${dinhDangGio(ketThuc)} (${chuSoGio} giờ)`
    );
    setNoiDung('');
  };

  const renderBoChinhGio = (tieuDe: string, giaTri: string, bamTru: () => void, bamCong: () => void) => (
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

  return (
    <View>
      <TieuDe>Ngày làm thêm</TieuDe>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {cacNgay.map((n, i) => (
          <LuaChon key={i} nhan={n.thu} phu={n.ngayThang} daChon={i === ngayChon} khiBam={() => chonNgay(i)} />
        ))}
      </ScrollView>

      <TieuDe>Loại ngày</TieuDe>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {CAC_LOAI_NGAY.map((l) => (
          <LuaChon key={l.ma} nhan={l.ten} daChon={loaiNgay === l.ma} khiBam={() => setLoaiNgay(l.ma)} />
        ))}
      </View>
      <Text style={[s.ghiChu, { color: colors.sub }]}>Hệ số lương làm thêm: {heSo}%</Text>

      <TieuDe>Thời gian</TieuDe>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {renderBoChinhGio('Bắt đầu', dinhDangGio(batDau), () => doiBatDau(-BUOC), () => doiBatDau(BUOC))}
        {renderBoChinhGio('Kết thúc', dinhDangGio(ketThuc), () => doiKetThuc(-BUOC), () => doiKetThuc(BUOC))}
      </View>

      <View style={[s.tomTat, { backgroundColor: vuotGioiHan ? '#FDECEA' : '#F3EBE4' }]}>
        <Text style={[s.tomTatChinh, { color: vuotGioiHan ? '#C0392B' : MAU_NAU }]}>
          {soGio > 0 ? `Làm thêm ${chuSoGio} giờ` : 'Giờ kết thúc phải sau giờ bắt đầu'}
        </Text>
        <Text style={[s.tomTatPhu, { color: vuotGioiHan ? '#C0392B' : '#6B5B4E' }]}>
          Tháng này: {GIO_DA_DUNG} → {`${tongSauKhiGui}`.replace('.', ',')} / {GIO_TOI_DA} giờ
          {vuotGioiHan ? ' · vượt giới hạn' : ''}
        </Text>
      </View>

      <TieuDe>Nội dung công việc</TieuDe>
      <TextInput
        style={[s.oNhap, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
        placeholder="VD: Chốt báo cáo doanh thu quý 3 cho khách hàng"
        placeholderTextColor="#999"
        value={noiDung}
        onChangeText={setNoiDung}
        multiline
      />
      <Text style={[s.ghiChu, { color: colors.sub }]}>Bắt buộc, để quản lý biết lý do làm thêm.</Text>

      <NutGui choPhep={hopLe} nhan="Gửi đơn làm thêm" khiBam={guiDon} />
    </View>
  );
}

const s = StyleSheet.create({
  ghiChu: { fontSize: 12, marginTop: 4 },
  boChinh: { flex: 1, borderWidth: 1, borderRadius: 12, padding: 12 },
  tieuDeBo: { fontSize: 12, marginBottom: 6 },
  hangBo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  nutBo: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F3EBE4', justifyContent: 'center', alignItems: 'center' },
  giaTriBo: { fontSize: 20, fontWeight: 'bold' },
  tomTat: { borderRadius: 12, padding: 12, marginTop: 12 },
  tomTatChinh: { fontSize: 14, fontWeight: 'bold' },
  tomTatPhu: { fontSize: 12, marginTop: 2 },
  oNhap: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 14, minHeight: 80, textAlignVertical: 'top' },
});