import {
  View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert,
} from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/theme-context';
import { LuaChon, TieuDe, NutGui, MAU_NAU, layNgayTiep } from './FormChung';

const PHEP_CON_LAI = 8; // số ngày phép năm còn lại (sau này lấy từ dữ liệu thật)

const CAC_LOAI = [
  { ma: 'phepnam', ten: 'Phép năm' },
  { ma: 'om', ten: 'Nghỉ ốm' },
  { ma: 'viecrieng', ten: 'Việc riêng' },
  { ma: 'khongluong', ten: 'Không lương' },
];

const CAC_NUA_NGAY = [
  { ma: 'ca', ten: 'Cả ngày' },
  { ma: 'sang', ten: 'Buổi sáng' },
  { ma: 'chieu', ten: 'Buổi chiều' },
];

type Props = { khiGui?: (duLieu: any) => void };

export default function FormNghiPhep({ khiGui }: Props) {
  const { colors } = useTheme();
  const cacNgay = layNgayTiep(14, 0);

  const [loai, setLoai] = useState<string>('phepnam');
  const [batDau, setBatDau] = useState<number | null>(null);
  const [ketThuc, setKetThuc] = useState<number | null>(null);
  const [nuaNgay, setNuaNgay] = useState('ca');
  const [lyDo, setLyDo] = useState('');
  const [banGiao, setBanGiao] = useState('');
  const [anh, setAnh] = useState<string | null>(null);

  // bấm lần 1 chọn ngày bắt đầu, bấm lần 2 chọn ngày kết thúc, bấm lần 3 chọn lại từ đầu
  const chonNgay = (i: number) => {
    if (batDau === null || ketThuc !== null) {
      setBatDau(i);
      setKetThuc(null);
      setNuaNgay('ca');
    } else if (i < batDau) {
      setBatDau(i);
    } else {
      setKetThuc(i);
    }
  };

  const denNgay = ketThuc ?? batDau; // chưa chọn ngày kết thúc thì coi như nghỉ 1 ngày
  const motNgay = batDau !== null && denNgay === batDau;

  let soNgay = 0;
  if (batDau !== null && denNgay !== null) {
    soNgay = motNgay && nuaNgay !== 'ca' ? 0.5 : denNgay - batDau + 1;
  }
  const chuSoNgay = `${soNgay}`.replace('.', ',');

  const vuotPhep = loai === 'phepnam' && soNgay > PHEP_CON_LAI;
  const hopLe = soNgay > 0 && lyDo.trim().length >= 5 && !vuotPhep;

  const chonAnh = async () => {
    const kq = await ImagePicker.launchImageLibraryAsync({ quality: 0.5 });
    if (!kq.canceled) setAnh(kq.assets[0].uri);
  };

  const guiDon = () => {
    const tu = cacNgay[batDau!];
    const den = cacNgay[denNgay!];
    khiGui?.({
      loai,
      tuNgay: tu.ngay.toISOString(),
      denNgay: den.ngay.toISOString(),
      nuaNgay: motNgay ? nuaNgay : 'ca',
      soNgay,
      lyDo: lyDo.trim(),
      banGiao: banGiao.trim(),
      anh,
    });
    Alert.alert(
      'Đã gửi đơn nghỉ phép',
      `${tu.ngayThang}${motNgay ? '' : ' → ' + den.ngayThang} · ${chuSoNgay} ngày`
    );
    setBatDau(null);
    setKetThuc(null);
    setNuaNgay('ca');
    setLyDo('');
    setBanGiao('');
    setAnh(null);
  };

  return (
    <View>
      <TieuDe>Loại nghỉ</TieuDe>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {CAC_LOAI.map((l) => (
          <LuaChon key={l.ma} nhan={l.ten} daChon={loai === l.ma} khiBam={() => setLoai(l.ma)} />
        ))}
      </View>
      {loai === 'phepnam' && (
        <Text style={[s.ghiChu, { color: colors.sub }]}>Phép năm còn lại: {PHEP_CON_LAI} ngày</Text>
      )}

      <TieuDe>Chọn ngày nghỉ</TieuDe>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {cacNgay.map((n, i) => (
          <LuaChon
            key={i}
            nhan={n.thu}
            phu={n.ngayThang}
            daChon={batDau !== null && denNgay !== null && i >= batDau && i <= denNgay}
            khiBam={() => chonNgay(i)}
          />
        ))}
      </ScrollView>
      <Text style={[s.ghiChu, { color: colors.sub }]}>
        Bấm ngày bắt đầu, rồi bấm ngày kết thúc. Nghỉ 1 ngày thì chỉ cần bấm một lần.
      </Text>

      {motNgay && (
        <>
          <TieuDe>Nghỉ nửa ngày?</TieuDe>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {CAC_NUA_NGAY.map((n) => (
              <LuaChon key={n.ma} nhan={n.ten} daChon={nuaNgay === n.ma} khiBam={() => setNuaNgay(n.ma)} />
            ))}
          </View>
        </>
      )}

      <View style={[s.tomTat, { backgroundColor: vuotPhep ? '#FDECEA' : '#F3EBE4' }]}>
        <Text style={[s.tomTatChinh, { color: vuotPhep ? '#C0392B' : MAU_NAU }]}>
          {soNgay > 0 ? `Tổng nghỉ: ${chuSoNgay} ngày` : 'Chưa chọn ngày nghỉ'}
        </Text>
        {vuotPhep && (
          <Text style={[s.tomTatPhu, { color: '#C0392B' }]}>
            Vượt số phép năm còn lại ({PHEP_CON_LAI} ngày). Hãy đổi sang loại khác hoặc chọn ít ngày hơn.
          </Text>
        )}
      </View>

      <TieuDe>Lý do</TieuDe>
      <TextInput
        style={[s.oNhap, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
        placeholder="VD: Về quê có việc gia đình"
        placeholderTextColor="#999"
        value={lyDo}
        onChangeText={setLyDo}
        multiline
      />

      <TieuDe>Người bàn giao (không bắt buộc)</TieuDe>
      <TextInput
        style={[s.oMot, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
        placeholder="VD: Trần Minh Quân"
        placeholderTextColor="#999"
        value={banGiao}
        onChangeText={setBanGiao}
      />

      {loai === 'om' && (
        <>
          <TieuDe>Giấy khám bệnh (không bắt buộc)</TieuDe>
          <TouchableOpacity
            onPress={chonAnh}
            activeOpacity={0.8}
            style={[s.nutAnh, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Ionicons name="image-outline" size={20} color={MAU_NAU} />
            <Text style={[s.chuNutAnh, { color: colors.text }]}>
              {anh ? 'Đổi ảnh khác' : 'Chọn ảnh từ máy'}
            </Text>
          </TouchableOpacity>
          {anh && <Image source={{ uri: anh }} style={s.anh} />}
        </>
      )}

      <NutGui choPhep={hopLe} nhan="Gửi đơn nghỉ phép" khiBam={guiDon} />
    </View>
  );
}

const s = StyleSheet.create({
  ghiChu: { fontSize: 12, marginTop: 4 },
  tomTat: { borderRadius: 12, padding: 12, marginTop: 12 },
  tomTatChinh: { fontSize: 14, fontWeight: 'bold' },
  tomTatPhu: { fontSize: 12, marginTop: 2 },
  oNhap: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 14, minHeight: 80, textAlignVertical: 'top' },
  oMot: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14 },
  nutAnh: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, padding: 12 },
  chuNutAnh: { marginLeft: 8, fontSize: 14 },
  anh: { width: 110, height: 110, borderRadius: 12, marginTop: 10 },
});