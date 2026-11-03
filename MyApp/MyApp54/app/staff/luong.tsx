import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/theme-context';

const XANH = '#1E8E5A';

// ---- Quy định tính lương (sau này lấy từ dữ liệu thật) ----
const LUONG_CO_BAN = 9000000;
const LUONG_DONG_BH = 5000000; // mức lương đóng bảo hiểm
const TI_LE_BH = 0.105;        // 10,5%
const TIEN_AN_NGAY = 30000;
const PHAT_MOI_PHUT = 1000;    // phạt đi muộn / về sớm
const PHAT_THIEU_CONG = 50000; // mỗi lần thiếu chấm công
const TIEN_OT_GIO = 52000;

// ---- Dữ liệu chấm công từng tháng (mẫu) ----
const CAC_THANG = [
  { thang: 1, nam: 2026, cong: 24, congChuan: 26, ngayAn: 24, phutMuon: 60, lanMuon: 3, gioOT: 4, lanThieu: 9 },
  { thang: 2, nam: 2026, cong: 23, congChuan: 26, ngayAn: 24, phutMuon: 60, lanMuon: 2, gioOT: 7, lanThieu: 2 },
  { thang: 3, nam: 2026, cong: 24, congChuan: 26, ngayAn: 24, phutMuon: 60, lanMuon: 0, gioOT: 4, lanThieu: 8 },
  { thang: 4, nam: 2026, cong: 25, congChuan: 26, ngayAn: 24, phutMuon: 60, lanMuon: 3, gioOT: 8, lanThieu: 2 },
  { thang: 5, nam: 2026, cong: 24, congChuan: 26, ngayAn: 24, phutMuon: 60, lanMuon: 5, gioOT: 4, lanThieu: 4 },
  { thang: 6, nam: 2026, cong: 27, congChuan: 26, ngayAn: 24, phutMuon: 60, lanMuon: 3, gioOT: 7, lanThieu: 2 },
  { thang: 7, nam: 2026, cong: 24, congChuan: 26, ngayAn: 24, phutMuon: 60, lanMuon: 7, gioOT: 9, lanThieu: 6 },
  { thang: 8, nam: 2026, cong: 25, congChuan: 26, ngayAn: 24, phutMuon: 60, lanMuon: 3, gioOT: 4, lanThieu: 1 },
  { thang: 9, nam: 2026, cong: 26, congChuan: 26, ngayAn: 25, phutMuon: 35, lanMuon: 2, gioOT: 4, lanThieu: 0 },
  { thang: 10, nam: 2026, cong: 26, congChuan: 26, ngayAn: 25, phutMuon: 201, lanMuon: 1, gioOT: 0, lanThieu: 0 },
];

const pad = (n: number) => n.toString().padStart(2, '0');
// 9024000 -> "9.024.000"
const tien = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

function tinhLuong(d: (typeof CAC_THANG)[number]) {
  const luongCong = (LUONG_CO_BAN / d.congChuan) * d.cong;
  const anTrua = d.ngayAn * TIEN_AN_NGAY;
  const tienOT = d.gioOT * TIEN_OT_GIO;
  const phatMuon = d.phutMuon * PHAT_MOI_PHUT;
  const phatThieu = d.lanThieu * PHAT_THIEU_CONG;
  const bhxh = LUONG_DONG_BH * TI_LE_BH;
  const tongThu = luongCong + anTrua + tienOT;
  const tongTru = phatMuon + phatThieu + bhxh;
  return { luongCong, anTrua, tienOT, phatMuon, phatThieu, bhxh, tongThu, tongTru, thucLinh: tongThu - tongTru };
}

export default function Luong() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const [chon, setChon] = useState(CAC_THANG.length - 1); // mặc định tháng mới nhất
  const [an, setAn] = useState(false); // ẩn số tiền

  const d = CAC_THANG[chon];
  const l = tinhLuong(d);
  const soTien = (n: number, dau = '') => (an ? '•••••••' : `${dau}${tien(n)}đ`);

  const ngayCuoi = new Date(d.nam, d.thang, 0).getDate();
  const thangSau = d.thang === 12 ? 1 : d.thang + 1;
  const namSau = d.thang === 12 ? d.nam + 1 : d.nam;

  const Dong = ({ ten, chiTiet, giaTri, mau }: { ten: string; chiTiet?: string; giaTri: string; mau?: string }) => (
    <View style={s.dong}>
      <View style={{ flex: 1, paddingRight: 10 }}>
        <Text style={[s.tenDong, { color: colors.text }]}>{ten}</Text>
        {chiTiet ? <Text style={[s.chiTiet, { color: colors.sub }]}>{chiTiet}</Text> : null}
      </View>
      <Text style={[s.giaTri, { color: mau ?? colors.text }]}>{giaTri}</Text>
    </View>
  );

  return (
    <View style={[s.container, { backgroundColor: colors.bg }]}>
      {/* Thanh tiêu đề + chọn tháng */}
      <View style={[s.dauTrang, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity disabled={chon === 0} onPress={() => setChon(chon - 1)} style={{ opacity: chon === 0 ? 0.3 : 1 }}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[s.tieuDe, { color: colors.text }]}>Phiếu lương tháng {pad(d.thang)}/{d.nam}</Text>
        <TouchableOpacity
          disabled={chon === CAC_THANG.length - 1}
          onPress={() => setChon(chon + 1)}
          style={{ opacity: chon === CAC_THANG.length - 1 ? 0.3 : 1 }}
        >
          <Ionicons name="chevron-forward" size={22} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text style={[s.tenNV, { color: colors.sub }]}>Nguyễn Văn B · Kinh doanh</Text>

        {/* Thẻ xanh thực lĩnh */}
        <View style={s.theXanh}>
          <View style={s.hangTren}>
            <Text style={s.nhanThe}>Thực lĩnh tháng {pad(d.thang)}/{d.nam}</Text>
            <TouchableOpacity onPress={() => setAn(!an)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name={an ? 'eye-off-outline' : 'eye-outline'} size={20} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={s.soLon}>{soTien(l.thucLinh)}</Text>
          <Text style={s.kyLuong}>
            Kỳ lương: 01/{pad(d.thang)} – {ngayCuoi}/{pad(d.thang)}/{d.nam} · Công bố: 01/{pad(thangSau)}/{namSau}
          </Text>
        </View>

        {/* 4 ô thống kê */}
        <View style={s.hangThongKe}>
          {[
            { so: d.cong, nhan: 'công' },
            { so: d.phutMuon, nhan: 'phút muộn' },
            { so: d.lanMuon, nhan: 'lần muộn' },
            { so: d.gioOT, nhan: 'giờ OT' },
          ].map((o) => (
            <View key={o.nhan} style={[s.oThongKe, { backgroundColor: colors.card }]}>
              <Text style={[s.soThongKe, { color: colors.text }]}>{o.so}</Text>
              <Text style={[s.nhanThongKe, { color: colors.sub }]}>{o.nhan}</Text>
            </View>
          ))}
        </View>

        {/* Bảng chi tiết */}
        <View style={[s.bang, { backgroundColor: colors.card }]}>
          <Text style={s.nhomTieuDe}>THU NHẬP</Text>
          <Dong
            ten="Lương theo công"
            chiTiet={`${tien(LUONG_CO_BAN)} ÷ ${d.congChuan} công chuẩn × ${d.cong} công`}
            giaTri={soTien(l.luongCong)}
          />
          <Dong ten="Ăn trưa" chiTiet={`${tien(TIEN_AN_NGAY)} × ${d.ngayAn} ngày`} giaTri={soTien(l.anTrua)} />
          {d.gioOT > 0 && (
            <Dong ten="Làm thêm (OT)" chiTiet={`${tien(TIEN_OT_GIO)} × ${d.gioOT} giờ`} giaTri={soTien(l.tienOT)} />
          )}

          <View style={[s.kenh, { backgroundColor: colors.border }]} />

          <Text style={[s.nhomTieuDe, { color: '#C0392B' }]}>KHẤU TRỪ</Text>
          <Dong
            ten="Phạt đi muộn / về sớm"
            chiTiet={`${d.phutMuon} phút × ${tien(PHAT_MOI_PHUT)}đ`}
            giaTri={soTien(l.phatMuon, '-')}
            mau="#C0392B"
          />
          <Dong
            ten="Phạt thiếu chấm công"
            chiTiet={`${d.lanThieu} lần × ${tien(PHAT_THIEU_CONG)}đ`}
            giaTri={soTien(l.phatThieu, l.phatThieu > 0 ? '-' : '')}
            mau={l.phatThieu > 0 ? '#C0392B' : colors.sub}
          />
          <Dong
            ten="BHXH"
            chiTiet={`${tien(LUONG_DONG_BH)} × ${TI_LE_BH * 100}%`.replace('.', ',')}
            giaTri={soTien(l.bhxh, '-')}
            mau="#C0392B"
          />

          <View style={[s.kenh, { backgroundColor: colors.border }]} />

          <View style={s.dongTong}>
            <Text style={[s.chuTong, { color: colors.text }]}>Thực lĩnh</Text>
            <Text style={[s.soTong, { color: XANH }]}>{soTien(l.thucLinh)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[s.nutChiTiet, { borderColor: XANH }]}
          onPress={() => Alert.alert('Sắp ra mắt', 'Chi tiết từng ngày công sẽ có ở bản sau.')}
        >
          <Text style={s.chuNutChiTiet}>Xem chi tiết {d.cong} ngày công</Text>
          <Ionicons name="chevron-forward" size={16} color={XANH} />
        </TouchableOpacity>

        <Text style={[s.luuY, { color: colors.sub }]}>
          Phiếu lương chỉ mang tính tham khảo. Nếu có sai sót, vui lòng liên hệ bộ phận nhân sự.
        </Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  dauTrang: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 6 },
  tieuDe: { fontSize: 17, fontWeight: 'bold' },
  tenNV: { fontSize: 13, textAlign: 'center', marginBottom: 14 },

  theXanh: { backgroundColor: XANH, borderRadius: 16, padding: 18 },
  hangTren: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nhanThe: { color: 'rgba(255,255,255,0.85)', fontSize: 13 },
  soLon: { color: 'white', fontSize: 34, fontWeight: 'bold', marginTop: 6 },
  kyLuong: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 8 },

  hangThongKe: { flexDirection: 'row', gap: 8, marginTop: 12 },
  oThongKe: { flex: 1, borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  soThongKe: { fontSize: 20, fontWeight: 'bold' },
  nhanThongKe: { fontSize: 11, marginTop: 2 },

  bang: { borderRadius: 16, padding: 16, marginTop: 14 },
  nhomTieuDe: { fontSize: 12, fontWeight: 'bold', color: XANH, letterSpacing: 0.5, marginBottom: 6 },
  dong: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 8 },
  tenDong: { fontSize: 14, fontWeight: '600' },
  chiTiet: { fontSize: 12, marginTop: 2 },
  giaTri: { fontSize: 14, fontWeight: 'bold' },
  kenh: { height: 1, marginVertical: 10 },
  dongTong: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 },
  chuTong: { fontSize: 16, fontWeight: 'bold' },
  soTong: { fontSize: 20, fontWeight: 'bold' },

  nutChiTiet: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderRadius: 12, paddingVertical: 13, marginTop: 14,
  },
  chuNutChiTiet: { color: XANH, fontWeight: '600', fontSize: 14, marginRight: 4 },
  luuY: { fontSize: 12, textAlign: 'center', marginTop: 14 },
});