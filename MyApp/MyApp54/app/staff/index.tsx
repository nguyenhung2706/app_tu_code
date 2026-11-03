import {
  View, Text, StyleSheet, TouchableOpacity, Image, Alert, TextInput, ScrollView,
  Animated, Easing,
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAttendance } from '@/context/attendance-context';
import { useTheme } from '@/context/theme-context';

const SHIFT_START = { h: 8, m: 30 };
const SHIFT_END = { h: 17, m: 30 };
const TL_START = 7 * 60; // timeline bắt đầu 07:00
const TL_END = 19 * 60; // timeline kết thúc 19:00
const GREEN = '#1E8E5A';

const pad = (n: number) => n.toString().padStart(2, '0');
const toMin = (h: number, m: number) => h * 60 + m;
const pct = (min: number) =>
  `${Math.min(100, Math.max(0, ((min - TL_START) / (TL_END - TL_START)) * 100))}%` as any;

const DAYS = ['CHỦ NHẬT', 'THỨ HAI', 'THỨ BA', 'THỨ TƯ', 'THỨ NĂM', 'THỨ SÁU', 'THỨ BẢY'];

export default function StaffHome() {
  const insets = useSafeAreaInsets();
  const { isWorking, checkInPhoto, checkIn, checkOut } = useAttendance();
  const { colors } = useTheme();

  const [now, setNow] = useState(new Date());
  const [seconds, setSeconds] = useState(0);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [note, setNote] = useState('');
  const [zoneOpen, setZoneOpen] = useState(false);

  // --- Animation vòng tròn ---
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;
  const press = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const makeLoop = (v: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(v, {
            toValue: 1,
            duration: 2200,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(v, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      );
    const a = makeLoop(pulse1, 0);
    const b = makeLoop(pulse2, 1100);
    a.start();
    b.start();
    return () => {
      a.stop();
      b.stop();
    };
  }, []);

  const pulseStyle = (v: Animated.Value) => ({
    opacity: v.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0] }),
    transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [1, 1.7] }) }],
  });

  const onPressIn = () =>
    Animated.spring(press, { toValue: 0.92, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(press, { toValue: 1, friction: 4, useNativeDriver: true }).start();

  // --- Đồng hồ ---
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!isWorking) return;
    const t = setInterval(() => setSeconds((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [isWorking]);

  const formatDuration = (total: number) =>
    `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`;

  const handleCheckInOut = async () => {
    if (isWorking) {
      checkOut();
      setCheckInTime(null);
      setNote('');
      return;
    }
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Cấp quyền camera', 'Vui lòng cho phép ứng dụng dùng camera để chấm công.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      cameraType: ImagePicker.CameraType.front,
      quality: 0.5,
      allowsEditing: false,
    });
    if (result.canceled) return;

    setSeconds(0);
    setCheckInTime(new Date());
    checkIn(result.assets[0].uri);
    Alert.alert('Chấm công thành công', 'Ảnh xác thực thành công.');
  };

  const nowMin = toMin(now.getHours(), now.getMinutes());
  const startMin = toMin(SHIFT_START.h, SHIFT_START.m);
  const endMin = toMin(SHIFT_END.h, SHIFT_END.m);

  // số phút muộn: theo giờ vào ca thật, nếu chưa vào ca thì theo giờ hiện tại
  const refMin = checkInTime ? toMin(checkInTime.getHours(), checkInTime.getMinutes()) : nowMin;
  const lateMinutes = refMin - startMin;

  const mainColor = isWorking ? '#F39C12' : '#4A90E2';
  const dateStr = `${DAYS[now.getDay()]}, ${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* HEADER XANH */}
        <View style={[styles.hero, { paddingTop: insets.top + 10 }]}>
          <View style={styles.heroRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>NB</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroName}>Nguyễn Văn B</Text>
              <Text style={styles.heroSub}>Kinh doanh · Sao Mai Group</Text>
            </View>
            <TouchableOpacity
              style={styles.bell}
              onPress={() => router.push('/staff/thong-bao' as any)}
            >
              <Ionicons name="notifications-outline" size={20} color="white" />
              <View style={styles.dot} />
            </TouchableOpacity>
          </View>

          {/* Thẻ ca hôm nay */}
          <View style={styles.shiftCard}>
            <Text style={styles.shiftLabel}>Ca hôm nay</Text>
            <Text style={styles.shiftName}>Hành chính</Text>
            <Text style={styles.shiftTime}>
              {pad(SHIFT_START.h)}:{pad(SHIFT_START.m)} - {pad(SHIFT_END.h)}:{pad(SHIFT_END.m)}
            </Text>
            <Text style={styles.shiftPlace}>Văn phòng Cầu Giấy</Text>

            <TouchableOpacity
              style={styles.zoneChip}
              activeOpacity={0.7}
              onPress={() => setZoneOpen(!zoneOpen)}
            >
              <Ionicons name="location" size={12} color={GREEN} />
              <Text style={styles.zoneText}>Trong vùng · 3 m</Text>
              <Ionicons
                name={zoneOpen ? 'chevron-up' : 'chevron-down'}
                size={14}
                color={GREEN}
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>

            {zoneOpen && (
              <Text style={styles.zoneDetail}>
                Bạn đang cách Văn phòng Cầu Giấy 3 m, trong bán kính cho phép chấm công.
              </Text>
            )}
          </View>
        </View>

        <View style={styles.body}>
          {/* Đồng hồ */}
          <View style={styles.clockWrap}>
            <Text style={[styles.clock, { color: colors.text }]}>
              {pad(now.getHours())}:{pad(now.getMinutes())}
              <Text style={styles.clockSec}>:{pad(now.getSeconds())}</Text>
            </Text>
            <Text style={[styles.dateText, { color: colors.sub }]}>{dateStr}</Text>
          </View>

          {/* Nút tròn */}
          <View style={styles.circleWrap}>
            {/* 2 vòng sóng lan tỏa */}
            <Animated.View
              pointerEvents="none"
              style={[styles.wave, { backgroundColor: mainColor }, pulseStyle(pulse1)]}
            />
            <Animated.View
              pointerEvents="none"
              style={[styles.wave, { backgroundColor: mainColor }, pulseStyle(pulse2)]}
            />

            <View style={[styles.ring1, { backgroundColor: mainColor + '22' }]}>
              <View style={[styles.ring2, { backgroundColor: mainColor + '44' }]}>
                <Animated.View style={{ transform: [{ scale: press }] }}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={handleCheckInOut}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    style={[styles.mainBtn, { backgroundColor: mainColor }]}
                  >
                    <Ionicons name="finger-print" size={46} color="white" />
                    <Text style={styles.mainBtnText}>{isWorking ? 'RA CA' : 'VÀO CA'}</Text>
                    <Text style={styles.mainBtnSub}>
                      {isWorking ? formatDuration(seconds) : 'Chạm để chấm công'}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              </View>
            </View>
          </View>

          {checkInPhoto && isWorking && (
            <Image source={{ uri: checkInPhoto }} style={styles.thumb} />
          )}

          {/* Ghi chú */}
          <TextInput
            style={[styles.noteInput, { backgroundColor: colors.card, color: colors.text }]}
            placeholder="Thêm ghi chú (không bắt buộc)"
            placeholderTextColor="#999"
            value={note}
            onChangeText={setNote}
          />

          {/* Timeline hôm nay */}
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.cardHead}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Hôm nay</Text>
              {lateMinutes > 0 ? (
                <Text style={styles.lateText}>
                  {isWorking ? `Vào ca muộn ${lateMinutes} phút` : `Đã quá giờ vào ca ${lateMinutes} phút`}
                </Text>
              ) : (
                !isWorking && (
                  <Text style={styles.okText}>Còn {-lateMinutes} phút đến giờ vào ca</Text>
                )
              )}
            </View>

            <View style={styles.track}>
              <View
                style={[
                  styles.shiftBand,
                  { left: pct(startMin), width: `${((endMin - startMin) / (TL_END - TL_START)) * 100}%` as any },
                ]}
              />
              <View style={[styles.nowLine, { left: pct(nowMin) }]} />
            </View>
            <View style={styles.tickRow}>
              {['07:00', '09:00', '11:00', '13:00', '15:00', '17:00', '19:00'].map((t) => (
                <Text key={t} style={styles.tick}>{t}</Text>
              ))}
            </View>

            <Text style={[styles.emptyText, { color: colors.sub }]}>
              {isWorking && checkInTime
                ? `Đã vào ca lúc ${pad(checkInTime.getHours())}:${pad(checkInTime.getMinutes())}`
                : 'Chưa có lần chấm nào hôm nay.'}
            </Text>
          </View>

          {/* Cảnh báo muộn sau khi đã vào ca */}
          {isWorking && lateMinutes > 0 && (
            <View style={styles.warnCard}>
              <View style={styles.warnRow}>
                <Ionicons name="warning" size={18} color="#E67E22" />
                <Text style={styles.warnTitle}>Muộn {lateMinutes} phút so với ca Hành chính</Text>
              </View>
              <Text style={styles.warnText}>Nếu có lý do, gửi giải trình để quản lý duyệt.</Text>
              <TouchableOpacity
                style={styles.warnBtn}
                onPress={() => router.push('/staff/tao-don' as any)}
              >
                <Text style={styles.warnBtnText}>Gửi giải trình</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Đơn đang chờ duyệt */}
          <TouchableOpacity
            style={[styles.pending, { backgroundColor: colors.card }]}
            onPress={() => router.push('/staff/don-tu' as any)}
          >
            <View style={styles.pendingDot} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.pendingTitle, { color: colors.text }]}>1 đơn đang chờ duyệt</Text>
              <Text style={[styles.pendingSub, { color: colors.sub }]}>Xem trạng thái trong mục Đơn từ</Text>
            </View>
            <Text style={styles.pendingLink}>Xem</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  hero: { backgroundColor: GREEN, paddingHorizontal: 20, paddingBottom: 18, borderBottomLeftRadius: 22, borderBottomRightRadius: 22 },
  heroRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { color: GREEN, fontWeight: 'bold', fontSize: 15 },
  heroName: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 1 },
  bell: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center', alignItems: 'center',
  },
  dot: { position: 'absolute', top: 8, right: 9, width: 8, height: 8, borderRadius: 4, backgroundColor: '#E74C3C' },

  shiftCard: { backgroundColor: 'white', borderRadius: 14, padding: 14 },
  shiftLabel: { fontSize: 12, color: '#888' },
  shiftName: { fontSize: 18, fontWeight: 'bold', color: '#222', marginTop: 2 },
  shiftTime: { fontSize: 14, fontWeight: '600', color: '#222', marginTop: 2 },
  shiftPlace: { fontSize: 12, color: '#888', marginTop: 2 },
  zoneChip: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', backgroundColor: '#E6F4EC', borderRadius: 14, paddingVertical: 4, paddingHorizontal: 10, marginTop: 8 },
  zoneText: { color: GREEN, fontSize: 12, fontWeight: '600', marginLeft: 4 },
  zoneDetail: { fontSize: 12, color: '#555', marginTop: 8 },

  body: { paddingHorizontal: 20 },

  clockWrap: { alignItems: 'center', marginTop: 18 },
  clock: { fontSize: 52, fontWeight: 'bold', letterSpacing: 1 },
  clockSec: { fontSize: 30, color: '#999' },
  dateText: { fontSize: 12, fontWeight: '600', marginTop: 2 },

  circleWrap: { alignItems: 'center', marginVertical: 45 },
  wave: { position: 'absolute', top: 45, width: 150, height: 150, borderRadius: 75 },
  ring1: { width: 240, height: 240, borderRadius: 120, justifyContent: 'center', alignItems: 'center' },
  ring2: { width: 195, height: 195, borderRadius: 98, justifyContent: 'center', alignItems: 'center' },
  mainBtn: {
    width: 150, height: 150, borderRadius: 75, justifyContent: 'center', alignItems: 'center',
    elevation: 6, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 3 },
  },
  mainBtnText: { color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 4 },
  mainBtnSub: { color: 'white', fontSize: 11, marginTop: 2, opacity: 0.9 },

  thumb: { width: 60, height: 60, borderRadius: 30, alignSelf: 'center', marginBottom: 12, borderWidth: 2, borderColor: '#2ECC71' },

  noteInput: { borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, marginBottom: 14 },

  card: { borderRadius: 14, padding: 14, marginBottom: 14 },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  lateText: { fontSize: 12, color: '#E67E22', fontWeight: '600' },
  okText: { fontSize: 12, color: GREEN, fontWeight: '600' },

  track: { height: 14, backgroundColor: '#E9EDF0', borderRadius: 7, overflow: 'hidden' },
  shiftBand: { position: 'absolute', top: 0, bottom: 0, backgroundColor: '#CFE8DA' },
  nowLine: { position: 'absolute', top: -2, bottom: -2, width: 2, backgroundColor: '#222' },
  tickRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  tick: { fontSize: 10, color: '#999' },
  emptyText: { fontSize: 13, marginTop: 12 },

  warnCard: { backgroundColor: '#FFF6E0', borderColor: '#F5C26B', borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 14 },
  warnRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  warnTitle: { fontWeight: 'bold', fontSize: 14, marginLeft: 6, color: '#333' },
  warnText: { fontSize: 13, color: '#555' },
  warnBtn: { alignSelf: 'flex-start', backgroundColor: '#F39C12', paddingVertical: 8, paddingHorizontal: 18, borderRadius: 8, marginTop: 8 },
  warnBtnText: { color: 'white', fontWeight: '600', fontSize: 13 },

  pending: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 14 },
  pendingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#F39C12', marginRight: 10 },
  pendingTitle: { fontSize: 14, fontWeight: 'bold' },
  pendingSub: { fontSize: 12, marginTop: 2 },
  pendingLink: { color: GREEN, fontWeight: '600', fontSize: 14 },
});