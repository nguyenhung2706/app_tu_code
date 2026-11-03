import {
  View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert,
} from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/theme-context';
import {
  LuaChon, TieuDe, NutGui, BoChinhGio, MAU_NAU, layNgayTiep, them0,
} from './FormChung';

const SO_LAN_TOI_DA = 3; // mỗi tháng được bổ sung công tối đa 3 lần
const SO_LAN_DA_DUNG = 1; // (sau này lấy từ dữ liệu thật)
const BUOC = 5; // mỗi lần bấm +/- là 5 phút

type Loai = 'vao' | 'ra' | 'ca2';

const CAC_LOAI: { ma: Loai; ten: string }[] = [
  { ma: 'vao', ten: 'Quên vào ca' },
  { ma: 'ra', ten: 'Quên ra ca' },
  { ma: 'ca2', ten: 'Quên cả hai' },
];

const CAC_LY_DO = [
  { ma: 'hetpin', ten: 'Hết pin' },
  { ma: 'loigps', ten: 'Lỗi GPS' },
  { ma: 'loimang', ten: 'Lỗi mạng' },
  { ma: 'quen', ten: 'Quên' },
  { ma: 'khac', ten: 'Khác' },
];

const dinhDangGio = (phut: number) => `${them0(Math.floor(phut / 60))}:${them0(phut % 60)}`;

type Props = { khiGui?: (duLieu: any) => void };

export default function FormQuenCham({ khiGui }: Props) {
  const { colors } = useTheme();
  const cacNgay = layNgayTiep(7, -6); // 6 ngày trước và hôm nay (vị trí cuối)

  const [ngayChon, setNgayChon] = useState(5); // mặc định: hôm qua
  const [loai, setLoai] = useState<Loai>('vao');
  const [gioVao, setGioVao] = useState(8 * 60 + 30);
  const [gioRa, setGioRa] = useState(17 * 60 + 30);
  const [lyDo, setLyDo] = useState<string | null>(null);
  const [ghiChu, setGhiChu] = useState('');
  const [anh, setAnh] = useState<string | null>(null);

  const conLuot = SO_LAN_TOI_DA - SO_LAN_DA_DUNG;
  const canVao = loai === 'vao' || loai === 'ca2';
  const canRa = loai === 'ra' || loai === 'ca2';

  const chinhGio = (gio: number, delta: number) =>
    Math.min(Math.max(0, gio + delta), 23 * 60 + 55);

  const gioHopLe = loai !== 'ca2' || gioRa > gioVao;
  const hopLe =
    conLuot > 0 &&
    gioHopLe &&
    !!lyDo &&
    (lyDo !== 'khac' || ghiChu.trim().length >= 5);

  const chonAnh = async () => {
    const kq = await ImagePicker.launchImageLibraryAsync({ quality: 0.5 });
    if (!kq.canceled) setAnh(kq.assets[0].uri);
  };

  const guiDon = () => {
    const n = cacNgay[ngayChon];
    khiGui?.({
      ngay: n.ngay.toISOString(),
      loai,
      gioVao: canVao ? dinhDangGio(gioVao) : null,
      gioRa: canRa ? dinhDangGio(gioRa) : null,
      lyDo,
      ghiChu: ghiChu.trim(),
      anh,
    });
    const chuGio =
      loai === 'vao'
        ? `vào ca ${dinhDangGio(gioVao)}`
        : loai === 'ra'
          ? `ra ca ${dinhDangGio(gioRa)}`
          : `${dinhDangGio(gioVao)} - ${dinhDangGio(gioRa)}`;
    Alert.alert('Đã gửi đơn bổ sung công', `${n.thu} ${n.ngayThang} · ${chuGio}`);
    setLyDo(null);
    setGhiChu('');
    setAnh(null);
  };

  return (
    <View>
      <View style={[s.luot, { backgroundColor: conLuot > 0 ? '#F3EBE4' : '#FDECEA' }]}>
        <Text style={[s.luotChu, { color: conLuot > 0 ? MAU_NAU : '#C0392B' }]}>
          {conLuot > 0
            ? `Tháng này còn ${conLuot} lần bổ sung công`
            : 'Tháng này đã hết lượt bổ sung công'}
        </Text>
      </View>

      <TieuDe>Ngày quên chấm</TieuDe>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {cacNgay.map((n, i) => (
          <LuaChon
            key={i}
            nhan={n.thu}
            phu={i === cacNgay.length - 1 ? 'Hôm nay' : n.ngayThang}
            daChon={i === ngayChon}
            khiBam={() => setNgayChon(i)}
          />
        ))}
      </ScrollView>

      <TieuDe>Bạn quên gì?</TieuDe>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {CAC_LOAI.map((l) => (
          <LuaChon key={l.ma} nhan={l.ten} daChon={loai === l.ma} khiBam={() => setLoai(l.ma)} />
        ))}
      </View>

      <TieuDe>Giờ thực tế bạn đã làm</TieuDe>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {canVao && (
          <BoChinhGio
            tieuDe="Vào ca lúc"
            giaTri={dinhDangGio(gioVao)}
            bamTru={() => setGioVao(chinhGio(gioVao, -BUOC))}
            bamCong={() => setGioVao(chinhGio(gioVao, BUOC))}
          />
        )}
        {canRa && (
          <BoChinhGio
            tieuDe="Ra ca lúc"
            giaTri={dinhDangGio(gioRa)}
            bamTru={() => setGioRa(chinhGio(gioRa, -BUOC))}
            bamCong={() => setGioRa(chinhGio(gioRa, BUOC))}
          />
        )}
      </View>
      {!gioHopLe && (
        <Text style={[s.loi]}>Giờ ra ca phải sau giờ vào ca.</Text>
      )}

      <TieuDe>Lý do</TieuDe>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {CAC_LY_DO.map((l) => (
          <LuaChon key={l.ma} nhan={l.ten} daChon={lyDo === l.ma} khiBam={() => setLyDo(l.ma)} />
        ))}
      </View>

      <TieuDe>Ghi chú {lyDo === 'khac' ? '(bắt buộc)' : '(không bắt buộc)'}</TieuDe>
      <TextInput
        style={[s.oNhap, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
        placeholder="VD: Điện thoại hết pin lúc đến công ty"
        placeholderTextColor="#999"
        value={ghiChu}
        onChangeText={setGhiChu}
        multiline
      />

      <TieuDe>Bằng chứng (không bắt buộc)</TieuDe>
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

      <NutGui choPhep={hopLe} nhan="Gửi đơn bổ sung công" khiBam={guiDon} />
    </View>
  );
}

const s = StyleSheet.create({
  luot: { borderRadius: 12, padding: 12, marginTop: 4 },
  luotChu: { fontSize: 13, fontWeight: 'bold' },
  loi: { fontSize: 12, color: '#C0392B', marginTop: 6 },
  oNhap: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 14, minHeight: 80, textAlignVertical: 'top' },
  nutAnh: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, padding: 12 },
  chuNutAnh: { marginLeft: 8, fontSize: 14 },
  anh: { width: 110, height: 110, borderRadius: 12, marginTop: 10 },
});