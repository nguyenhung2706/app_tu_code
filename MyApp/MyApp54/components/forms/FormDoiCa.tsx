import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { useTheme } from '@/context/theme-context';
import { LuaChon, TieuDe, NutGui, MAU_NAU, layNgayTiep } from './FormChung';

const CAC_CA = [
  { ma: 'sang', ten: 'Ca sáng', gio: '07:00-12:00' },
  { ma: 'chieu', ten: 'Ca chiều', gio: '12:00-17:00' },
  { ma: 'toi', ten: 'Ca tối', gio: '17:00-22:00' },
];

// dữ liệu mẫu, sau này lấy từ danh sách đồng nghiệp thật
const DONG_NGHIEP = [
  { id: 1, ten: 'Trần Minh Quân' },
  { id: 2, ten: 'Lê Thu Hà' },
  { id: 3, ten: 'Phạm Đức Anh' },
];

type CachDoi = 'dongnghiep' | 'catrong';
type Props = { khiGui?: (duLieu: any) => void };

export default function FormDoiCa({ khiGui }: Props) {
  const { colors } = useTheme();
  const cacNgay = layNgayTiep(7, 1); // chỉ đổi ca từ ngày mai trở đi

  const [ngayChon, setNgayChon] = useState<number | null>(null);
  const [caCuaToi, setCaCuaToi] = useState<string | null>(null);
  const [cachDoi, setCachDoi] = useState<CachDoi>('dongnghiep');
  const [dongNghiepChon, setDongNghiepChon] = useState<number | null>(null);
  const [caCuaHo, setCaCuaHo] = useState<string | null>(null);
  const [caMuonDoi, setCaMuonDoi] = useState<string | null>(null);
  const [lyDo, setLyDo] = useState('');

  const hopLe =
    ngayChon !== null &&
    !!caCuaToi &&
    lyDo.trim().length >= 5 &&
    (cachDoi === 'dongnghiep'
      ? dongNghiepChon !== null && !!caCuaHo && caCuaHo !== caCuaToi
      : !!caMuonDoi && caMuonDoi !== caCuaToi);

  const cacBuoc =
    cachDoi === 'dongnghiep'
      ? ['Gửi đơn', 'Đồng nghiệp đồng ý', 'Quản lý duyệt']
      : ['Gửi đơn', 'Quản lý duyệt'];

  const guiDon = () => {
    const n = cacNgay[ngayChon!];
    khiGui?.({
      ngay: n.ngay.toISOString(),
      caCuaToi,
      cachDoi,
      dongNghiepChon,
      caCuaHo,
      caMuonDoi,
      lyDo: lyDo.trim(),
    });
    Alert.alert(
      'Đã gửi đơn đổi ca',
      cachDoi === 'dongnghiep'
        ? 'Đang chờ đồng nghiệp xác nhận, sau đó đến quản lý duyệt.'
        : 'Đang chờ quản lý duyệt.'
    );
    setNgayChon(null);
    setCaCuaToi(null);
    setDongNghiepChon(null);
    setCaCuaHo(null);
    setCaMuonDoi(null);
    setLyDo('');
  };

  // hàng chọn ca; `chan` là ca bị làm mờ (trùng ca của mình)
  const renderChonCa = (giaTri: string | null, khiChon: (ma: string) => void, chan?: string | null) => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {CAC_CA.map((ca) => (
        <LuaChon
          key={ca.ma}
          nhan={ca.ten}
          phu={ca.gio}
          daChon={giaTri === ca.ma}
          voHieu={chan === ca.ma}
          khiBam={() => khiChon(ca.ma)}
        />
      ))}
    </View>
  );

  return (
    <View>
      <TieuDe>Ngày muốn đổi</TieuDe>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {cacNgay.map((n, i) => (
          <LuaChon key={i} nhan={n.thu} phu={n.ngayThang} daChon={i === ngayChon} khiBam={() => setNgayChon(i)} />
        ))}
      </ScrollView>

      <TieuDe>Ca của tôi hôm đó</TieuDe>
      {renderChonCa(caCuaToi, setCaCuaToi)}

      <TieuDe>Đổi bằng cách nào?</TieuDe>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <LuaChon nhan="Đổi với đồng nghiệp" daChon={cachDoi === 'dongnghiep'} khiBam={() => setCachDoi('dongnghiep')} />
        <LuaChon nhan="Đổi sang ca trống" daChon={cachDoi === 'catrong'} khiBam={() => setCachDoi('catrong')} />
      </View>

      {cachDoi === 'dongnghiep' ? (
        <>
          <TieuDe>Chọn đồng nghiệp</TieuDe>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {DONG_NGHIEP.map((d) => (
              <LuaChon key={d.id} nhan={d.ten} daChon={dongNghiepChon === d.id} khiBam={() => setDongNghiepChon(d.id)} />
            ))}
          </View>
          <TieuDe>Ca của đồng nghiệp hôm đó</TieuDe>
          {renderChonCa(caCuaHo, setCaCuaHo, caCuaToi)}
        </>
      ) : (
        <>
          <TieuDe>Muốn chuyển sang</TieuDe>
          {renderChonCa(caMuonDoi, setCaMuonDoi, caCuaToi)}
        </>
      )}

      <TieuDe>Lý do</TieuDe>
      <TextInput
        style={[s.oNhap, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
        placeholder="VD: Tối nay em có lịch khám bệnh"
        placeholderTextColor="#999"
        value={lyDo}
        onChangeText={setLyDo}
        multiline
      />

      <TieuDe>Quy trình duyệt</TieuDe>
      <View style={[s.khungBuoc, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {cacBuoc.map((ten, i) => (
          <View key={ten} style={s.dongBuoc}>
            <View style={[s.chamBuoc, { backgroundColor: i === 0 ? MAU_NAU : '#D8CCC3' }]}>
              <Text style={s.soBuoc}>{i + 1}</Text>
            </View>
            <Text style={[s.chuBuoc, { color: colors.text }]}>{ten}</Text>
          </View>
        ))}
      </View>

      <NutGui choPhep={hopLe} nhan="Gửi đơn đổi ca" khiBam={guiDon} />
    </View>
  );
}

const s = StyleSheet.create({
  oNhap: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 14, minHeight: 80, textAlignVertical: 'top' },
  khungBuoc: { borderWidth: 1, borderRadius: 12, padding: 12 },
  dongBuoc: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  chamBuoc: { width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  soBuoc: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  chuBuoc: { fontSize: 13 },
});