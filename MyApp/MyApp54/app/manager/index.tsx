import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const XANH = '#1E8E5A';
const DO = '#C0392B';
const CAM = '#E67E22';

// ---- Dữ liệu mẫu (sau này lấy từ dữ liệu thật) ----
const TONG_NV = 15;
const DA_VAO_CA = 12;
const DUNG_GIO = 9;
const DI_MUON = 3;
const CHUA_VAO = TONG_NV - DA_VAO_CA;

const CAN_XU_LY = [
  { id: 1, icon: 'document-text-outline', chu: 'đơn chờ duyệt', so: 5, mau: CAM, duongDan: '/manager/don-tu', nut: 'Duyệt nhanh' },
  { id: 2, icon: 'person-remove-outline', chu: 'người chưa chấm công hôm nay', so: 2, mau: DO, duongDan: '/manager/cong-viec' },
  { id: 3, icon: 'hourglass-outline', chu: 'hợp đồng sắp hết hạn trong 7 ngày', so: 1, mau: '#8E6BD8', duongDan: '/manager/hop-dong' },
];

const NGUOI_CAN_CHU_Y = [
  { id: 1, ten: 'Trần Văn C', tinhTrang: 'Muộn 25 phút', mau: CAM },
  { id: 2, ten: 'Lê Thu Hà', tinhTrang: 'Muộn 10 phút', mau: CAM },
  { id: 3, ten: 'Phạm Đức Anh', tinhTrang: 'Chưa vào ca', mau: DO },
];

const CANH_BAO = [
  'Thứ Sáu có 4/15 người nghỉ, có thể thiếu người ca sáng.',
  'Nguyễn Văn B đã làm thêm 38/40 giờ, sắp chạm trần.',
  'Trần Văn C đi muộn 4 lần trong tháng này.',
];

export default function ManagerHome() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const duLieuTongQuan = [
    {
      tieuDe: 'Hợp đồng mới',
      giaTri: '+4',
      khiBam: () => router.push({ pathname: '/manager/hop-dong', params: { filter: 'Chờ ký' } }),
    },
    {
      tieuDe: 'Hợp đồng kết thúc',
      giaTri: '+5',
      khiBam: () => router.push({ pathname: '/manager/hop-dong', params: { filter: 'Sắp hết hạn' } }),
    },
    {
      tieuDe: 'Đi làm',
      giaTri: '+10',
      khiBam: () => router.push('/manager/cong-viec'),
    },
  ];

  const thongBao = [
    { id: 1, noiDung: 'Bạn có 4 hợp đồng mới cần ký', thoiGian: '10 phút trước' },
    { id: 2, noiDung: 'Bạn có 5 hợp đồng sắp hết hạn', thoiGian: '30 phút trước' },
  ];

  const phanTram = `${(DA_VAO_CA / TONG_NV) * 100}%` as any;

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Thanh tiêu đề, chừa chỗ cho thanh trạng thái */}
      <View style={[s.dauTrang, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity onPress={() => router.push('/manager/cai-dat' as any)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="menu-outline" size={26} color="#222" />
        </TouchableOpacity>
        <Text style={s.tieuDeTrang}>Trang Quản lý</Text>
        <TouchableOpacity onPress={() => router.push('/manager/thong-bao' as any)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="notifications-outline" size={26} color="#222" />
          <View style={s.chamDo} />
        </TouchableOpacity>
      </View>

      <View style={s.khoiChao}>
        <Text style={s.loiChao}>Xin chào</Text>
        <Text style={s.tenNguoiDung}>Nguyễn Đức Hưng</Text>
        <Text style={s.vaiTro}>Quản Lý</Text>
      </View>

      {/* 1. Cần xử lý ngay */}
      <View style={s.khung}>
        <Text style={s.tieuDeMuc}>Cần xử lý ngay</Text>
        <View style={s.theBan}>
          {CAN_XU_LY.map((m, i) => (
            <TouchableOpacity
              key={m.id}
              activeOpacity={0.7}
              onPress={() => router.push(m.duongDan as any)}
              style={[s.dongXuLy, i > 0 && s.vachNgan]}
            >
              <View style={[s.bieuTuong, { backgroundColor: m.mau + '22' }]}>
                <Ionicons name={m.icon as any} size={18} color={m.mau} />
              </View>
              <Text style={s.chuXuLy}>
                <Text style={[s.soXuLy, { color: m.mau }]}>{m.so} </Text>
                {m.chu}
              </Text>
              {m.nut ? (
                <View style={[s.nutNho, { backgroundColor: m.mau }]}>
                  <Text style={s.chuNutNho}>{m.nut}</Text>
                </View>
              ) : (
                <Ionicons name="chevron-forward" size={18} color="#aaa" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 2. Bốn ô thống kê (bấm được) */}
      <View style={[s.khung, { marginTop: 16 }]}>
        <View style={s.hangTheThongKe}>
          <TouchableOpacity style={s.theThongKe} onPress={() => router.push('/manager/nhan-vien')}>
            <Text style={s.soThongKe}>15</Text>
            <Text style={s.nhanThongKe}>Tổng Nhân Viên</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.theThongKe} onPress={() => router.push('/manager/phong-ban')}>
            <Text style={s.soThongKe}>1</Text>
            <Text style={s.nhanThongKe}>Phòng Ban</Text>
          </TouchableOpacity>
        </View>
        <View style={s.hangTheThongKe}>
          <TouchableOpacity
            style={s.theThongKe}
            onPress={() => router.push({ pathname: '/manager/cong-viec', params: { filter: 'Đang làm việc' } })}
          >
            <Text style={s.soThongKe}>12</Text>
            <Text style={s.nhanThongKe}>Đang làm việc</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.theThongKe}
            onPress={() => router.push({ pathname: '/manager/cong-viec', params: { filter: 'Đang nghỉ' } })}
          >
            <Text style={s.soThongKe}>3</Text>
            <Text style={s.nhanThongKe}>Đang nghỉ</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. Chấm công hôm nay */}
      <View style={s.khung}>
        <Text style={s.tieuDeMuc}>Chấm công hôm nay</Text>
        <View style={s.theBan}>
          <View style={s.dongTienDo}>
            <Text style={s.chuTienDo}>Đã vào ca</Text>
            <Text style={s.soTienDo}>{DA_VAO_CA}/{TONG_NV} người</Text>
          </View>
          <View style={s.thanhNen}>
            <View style={[s.thanhDay, { width: phanTram }]} />
          </View>

          <View style={s.hangBaSo}>
            <View style={s.oBaSo}>
              <Text style={[s.soBa, { color: XANH }]}>{DUNG_GIO}</Text>
              <Text style={s.nhanBa}>Đúng giờ</Text>
            </View>
            <View style={s.oBaSo}>
              <Text style={[s.soBa, { color: CAM }]}>{DI_MUON}</Text>
              <Text style={s.nhanBa}>Đi muộn</Text>
            </View>
            <View style={s.oBaSo}>
              <Text style={[s.soBa, { color: DO }]}>{CHUA_VAO}</Text>
              <Text style={s.nhanBa}>Chưa vào ca</Text>
            </View>
          </View>

          <Text style={s.nhanNho}>Cần chú ý</Text>
          {NGUOI_CAN_CHU_Y.map((n) => (
            <TouchableOpacity
              key={n.id}
              activeOpacity={0.7}
              style={s.dongNguoi}
              onPress={() => router.push('/manager/cong-viec')}
            >
              <View style={s.anhDaiDien}>
                <Text style={s.chuAnh}>{n.ten.split(' ').pop()?.[0]}</Text>
              </View>
              <Text style={s.tenNguoi}>{n.ten}</Text>
              <View style={[s.nhanTrang, { backgroundColor: n.mau + '22' }]}>
                <Text style={[s.chuNhanTrang, { color: n.mau }]}>{n.tinhTrang}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 4. Cảnh báo thông minh */}
      <View style={s.khung}>
        <Text style={s.tieuDeMuc}>Cảnh báo</Text>
        <View style={s.theBan}>
          {CANH_BAO.map((c, i) => (
            <View key={i} style={[s.dongCanhBao, i > 0 && s.vachNgan]}>
              <Ionicons name="warning-outline" size={18} color={CAM} style={{ marginTop: 1 }} />
              <Text style={s.chuCanhBao}>{c}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 5. Tổng quan hôm nay */}
      <View style={s.khung}>
        <Text style={s.tieuDeMuc}>Tổng quan hôm nay</Text>
        <View style={s.theBan}>
          {duLieuTongQuan.map((m, i) => (
            <TouchableOpacity key={i} style={s.dongTongQuan} onPress={m.khiBam}>
              <Text style={s.chuTongQuan}>{m.tieuDe}</Text>
              <Text style={s.giaTriTongQuan}>{m.giaTri}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 6. Thông báo */}
      <View style={s.khung}>
        <View style={s.dauMuc}>
          <Text style={[s.tieuDeMuc, { marginBottom: 0 }]}>Thông báo</Text>
          <TouchableOpacity onPress={() => router.push('/manager/thong-bao' as any)}>
            <Text style={s.xemTatCa}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>
        <View style={[s.theBan, { marginTop: 10 }]}>
          {thongBao.map((t, i) => (
            <View key={t.id} style={i > 0 && s.vachNgan}>
              <Text style={s.noiDungThongBao}>{t.noiDung}</Text>
              <Text style={s.thoiGianThongBao}>{t.thoiGian}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  dauTrang: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingBottom: 10,
  },
  tieuDeTrang: { fontSize: 18, fontWeight: 'bold' },
  chamDo: { position: 'absolute', top: 0, right: 1, width: 9, height: 9, borderRadius: 5, backgroundColor: DO },

  khoiChao: { paddingHorizontal: 20, marginTop: 6, marginBottom: 18 },
  loiChao: { fontSize: 18 },
  tenNguoiDung: { fontSize: 24, fontWeight: 'bold' },
  vaiTro: { fontSize: 16, color: 'gray' },

  khung: { paddingHorizontal: 20, marginBottom: 20 },
  tieuDeMuc: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  theBan: { backgroundColor: 'white', borderRadius: 12, padding: 15 },
  vachNgan: { borderTopWidth: 1, borderTopColor: '#EEE', marginTop: 10, paddingTop: 10 },

  // Cần xử lý ngay
  dongXuLy: { flexDirection: 'row', alignItems: 'center' },
  bieuTuong: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  chuXuLy: { flex: 1, fontSize: 14, color: '#333' },
  soXuLy: { fontSize: 16, fontWeight: 'bold' },
  nutNho: { borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10 },
  chuNutNho: { color: 'white', fontSize: 12, fontWeight: '600' },

  // 4 ô thống kê
  hangTheThongKe: { flexDirection: 'row', gap: 15, marginBottom: 15 },
  theThongKe: { flex: 1, backgroundColor: 'white', padding: 15, borderRadius: 10, minHeight: 90 },
  soThongKe: { fontSize: 28, fontWeight: 'bold' },
  nhanThongKe: { fontSize: 14, color: 'gray', marginTop: 5 },

  // Chấm công hôm nay
  dongTienDo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  chuTienDo: { fontSize: 14, color: '#555' },
  soTienDo: { fontSize: 14, fontWeight: 'bold' },
  thanhNen: { height: 10, backgroundColor: '#E9EDF0', borderRadius: 5, overflow: 'hidden' },
  thanhDay: { height: '100%', backgroundColor: XANH, borderRadius: 5 },
  hangBaSo: { flexDirection: 'row', marginTop: 14 },
  oBaSo: { flex: 1, alignItems: 'center' },
  soBa: { fontSize: 22, fontWeight: 'bold' },
  nhanBa: { fontSize: 12, color: 'gray', marginTop: 2 },
  nhanNho: { fontSize: 13, fontWeight: '600', color: '#555', marginTop: 16, marginBottom: 6 },
  dongNguoi: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  anhDaiDien: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#E6F4EC', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  chuAnh: { color: XANH, fontWeight: 'bold' },
  tenNguoi: { flex: 1, fontSize: 14 },
  nhanTrang: { borderRadius: 10, paddingVertical: 4, paddingHorizontal: 10 },
  chuNhanTrang: { fontSize: 12, fontWeight: '600' },

  // Cảnh báo
  dongCanhBao: { flexDirection: 'row' },
  chuCanhBao: { flex: 1, fontSize: 14, color: '#333', marginLeft: 8 },

  // Tổng quan
  dongTongQuan: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  chuTongQuan: { fontSize: 14 },
  giaTriTongQuan: { fontSize: 14, fontWeight: 'bold' },

  // Thông báo
  dauMuc: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  xemTatCa: { fontSize: 14, color: XANH, fontWeight: '600' },
  noiDungThongBao: { fontSize: 16, fontWeight: '500' },
  thoiGianThongBao: { fontSize: 14, color: 'gray', marginTop: 4 },
});