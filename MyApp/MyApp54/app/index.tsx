import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Mascot from '../components/Mascots';
import Animated, {
  Easing,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

// Emoji vẫy tay
function WavingHand() {
  const rotate = useSharedValue(0);

  useEffect(() => {
    rotate.value = withRepeat(
      withSequence(
        withTiming(20, { duration: 200 }),
        withTiming(-10, { duration: 200 }),
        withTiming(20, { duration: 200 }),
        withTiming(0, { duration: 200 }),
        withDelay(1500, withTiming(0, { duration: 1 }))
      ),
      -1
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  return <Animated.Text style={[styles.wave, style]}>👋</Animated.Text>;
}

// Vòng tròn màu trôi lơ lửng ở nền
function Blob({ size, color, delay, style }: any) {
  const y = useSharedValue(0);

  useEffect(() => {
    y.value = withDelay(
      delay,
      withRepeat(
        withTiming(30, { duration: 3500, easing: Easing.inOut(Easing.quad) }),
        -1,
        true
      )
    );
  }, []);

  const anim = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity: 0.25,
        },
        style,
        anim,
      ]}
    />
  );
}

// Nút nhún khi bấm
function AnimatedButton({ label, onPress, primary }: any) {
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[{ flex: 1 }, anim]}>
      <Pressable
        onPressIn={() => (scale.value = withSpring(0.94))}
        onPressOut={() => (scale.value = withSpring(1))}
        onPress={onPress}
        style={[styles.btn, primary ? styles.btnPrimary : styles.btnOutline]}>
        <Text style={[styles.btnText, !primary && { color: 'black' }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Blob size={260} color="#818CF8" delay={0} style={{ top: -60, left: -80 }} />
      <Blob size={200} color="#F9A8D4" delay={800} style={{ bottom: 80, right: -60 }} />
      <Blob size={120} color="#67E8F9" delay={400} style={{ top: 180, right: 30 }} />
        <Mascot />

        <Animated.Text entering={FadeInDown.duration(700)} style={styles.title}>
        QUẢN LÝ NHÂN SỰ
        </Animated.Text>

      <Animated.View entering={FadeInDown.delay(250).duration(700)} style={styles.row}>
        <Text style={styles.hello}>Xin chào </Text>
        <WavingHand />
      </Animated.View>

      <Animated.Text entering={FadeInDown.delay(450).duration(700)} style={styles.sub}>
        Quản lý nhân sự một cách hiệu quả.
      </Animated.Text>

      <Animated.View entering={FadeInUp.delay(700).springify()} style={styles.buttons}>
        <AnimatedButton primary label="Đăng Nhập" onPress={() => router.push('/login')} />
        <AnimatedButton label="Đăng Ký" onPress={() => router.push('/login/register')} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    overflow: 'hidden',
  },
  title: { color: 'black', fontSize: 28, fontWeight: '800', letterSpacing: 1 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 24 },
  hello: { color: 'black', fontSize: 22, fontWeight: '700' },
  wave: { fontSize: 24 },
  sub: { color: '#555', fontSize: 14, marginTop: 8 },
  buttons: { flexDirection: 'row', gap: 12, marginTop: 40, width: '100%' },
  btn: { height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  btnPrimary: { backgroundColor: 'black' },
  btnOutline: { borderWidth: 1, borderColor: '#bbb', backgroundColor: 'white' },
  btnText: { color: 'white', fontWeight: '700', fontSize: 15 },
});