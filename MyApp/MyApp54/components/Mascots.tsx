import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const ARM = 46;
const LEG = 50;

const pivot = (len: number, deg: number) => {
  'worklet';
  return [
    { translateY: -len / 2 },
    { rotate: `${deg}deg` },
    { translateY: len / 2 },
  ];
};

export default function Mascot() {
  const walkX = useSharedValue(-350);
  const step = useSharedValue(-1);
  const arm = useSharedValue(0);
  const idle = useSharedValue(0);
  const blink = useSharedValue(1);

  useEffect(() => {
    // Đi vào
    walkX.value = withTiming(0, { duration: 2400, easing: Easing.out(Easing.quad) });

    // Chân bước rồi về vị trí nghỉ
    step.value = withSequence(
      withRepeat(withTiming(1, { duration: 300 }), 8, true),
      withTiming(0, { duration: 150 })
    );

    // Giơ tay và vẫy
    arm.value = withDelay(
      2500,
      withSequence(
        withTiming(-130, { duration: 300 }),
        withRepeat(
          withSequence(
            withTiming(-160, { duration: 250 }),
            withTiming(-110, { duration: 250 })
          ),
          -1
        )
      )
    );

    // Nhún nhẹ khi đứng (bắt đầu sau khi đi xong)
    idle.value = withDelay(
      2500,
      withRepeat(withTiming(1, { duration: 900, easing: Easing.inOut(Easing.quad) }), -1, true)
    );

    // Chớp mắt
    blink.value = withRepeat(
      withSequence(
        withDelay(2200, withTiming(0.1, { duration: 90 })),
        withTiming(1, { duration: 120 })
      ),
      -1
    );
  }, []);

  const wrapStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: walkX.value },
      { translateY: -Math.abs(step.value) * 4 + idle.value * 2 },
    ],
  }));
  const legL = useAnimatedStyle(() => ({ transform: pivot(LEG, step.value * 25) }));
  const legR = useAnimatedStyle(() => ({ transform: pivot(LEG, -step.value * 25) }));
  const armL = useAnimatedStyle(() => ({ transform: pivot(ARM, -step.value * 20) }));
  const armR = useAnimatedStyle(() => ({ transform: pivot(ARM, arm.value) }));
  const eyeStyle = useAnimatedStyle(() => ({ transform: [{ scaleY: blink.value }] }));

  return (
    <View style={styles.stage}>
      {/* Bóng dưới chân */}
      <View style={styles.shadow} />

      <Animated.View style={[styles.char, wrapStyle]}>
        {/* Bong bóng chào */}
        <Animated.View entering={ZoomIn.delay(2800).springify()} style={styles.bubble}>
          <Text style={styles.bubbleText}>Xin chào! 👋</Text>
          <View style={styles.bubbleTail} />
        </Animated.View>

        {/* Đầu */}
        <View style={styles.head}>
          <View style={styles.hair} />
          <View style={styles.fringe} />
          <Animated.View style={[styles.eye, { left: 12 }, eyeStyle]} />
          <Animated.View style={[styles.eye, { right: 12 }, eyeStyle]} />
          <View style={[styles.cheek, { left: 6 }]} />
          <View style={[styles.cheek, { right: 6 }]} />
          <View style={styles.smile} />
        </View>

        {/* Cổ */}
        <View style={styles.neck} />

        {/* Thân */}
        <View style={styles.body}>
          <View style={styles.collar} />
          <View style={styles.badge}>
            <View style={styles.badgeLine} />
          </View>
        </View>

        {/* Tay trái (không vẫy) */}
        <Animated.View style={[styles.arm, { left: 20 }, armL]}>
          <View style={styles.hand} />
        </Animated.View>

        {/* Tay phải (vẫy) */}
        <Animated.View style={[styles.arm, { right: 20 }, armR]}>
          <View style={styles.hand} />
        </Animated.View>

        {/* Chân */}
        <Animated.View style={[styles.leg, { left: 42 }, legL]}>
          <View style={styles.shoe} />
        </Animated.View>
        <Animated.View style={[styles.leg, { right: 42 }, legR]}>
          <View style={styles.shoe} />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const SKIN = '#FBBF77';
const SHIRT = '#6366F1';
const HAIR = '#1F2937';

const styles = StyleSheet.create({
  stage: { height: 230, width: '100%', alignItems: 'center', justifyContent: 'flex-end' },
  char: { width: 120, height: 200 },

  shadow: {
    position: 'absolute',
    bottom: 2,
    width: 80,
    height: 12,
    borderRadius: 40,
    backgroundColor: 'rgba(17,24,39,0.12)',
  },

  head: {
    position: 'absolute',
    top: 26,
    left: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: SKIN,
    zIndex: 3,
  },
  hair: {
    position: 'absolute',
    top: -3,
    left: -2,
    width: 60,
    height: 28,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 20,
    backgroundColor: HAIR,
  },
  fringe: {
    position: 'absolute',
    top: 14,
    left: 6,
    width: 26,
    height: 14,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    backgroundColor: HAIR,
    transform: [{ rotate: '-12deg' }],
  },
  eye: {
    position: 'absolute',
    top: 31,
    width: 7,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#111827',
  },
  cheek: {
    position: 'absolute',
    top: 40,
    width: 9,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#FB7185',
    opacity: 0.55,
  },
  smile: {
    position: 'absolute',
    bottom: 9,
    left: 19,
    width: 18,
    height: 9,
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: '#111827',
  },

  neck: {
    position: 'absolute',
    top: 78,
    left: 53,
    width: 14,
    height: 10,
    backgroundColor: '#F2A95E',
    zIndex: 2,
  },
  body: {
    position: 'absolute',
    top: 84,
    left: 30,
    width: 60,
    height: 62,
    borderRadius: 18,
    backgroundColor: SHIRT,
    zIndex: 2,
    alignItems: 'center',
  },
  collar: {
    position: 'absolute',
    top: -1,
    width: 20,
    height: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: 'white',
  },
  badge: {
    position: 'absolute',
    top: 22,
    right: 9,
    width: 16,
    height: 20,
    borderRadius: 4,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLine: { width: 9, height: 3, borderRadius: 2, backgroundColor: SHIRT },

  arm: {
    position: 'absolute',
    top: 90,
    width: 14,
    height: ARM,
    borderRadius: 7,
    backgroundColor: SHIRT,
    zIndex: 1,
  },
  hand: {
    position: 'absolute',
    bottom: -5,
    left: -1,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: SKIN,
  },

  leg: {
    position: 'absolute',
    top: 142,
    width: 16,
    height: LEG,
    borderRadius: 8,
    backgroundColor: HAIR,
    zIndex: 1,
  },
  shoe: {
    position: 'absolute',
    bottom: -3,
    left: -3,
    width: 24,
    height: 10,
    borderRadius: 6,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },

  bubble: {
    position: 'absolute',
    top: -14,
    left: 78,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    zIndex: 5,
  },
  bubbleText: { fontSize: 13, fontWeight: '700', color: '#111827' },
  bubbleTail: {
    position: 'absolute',
    bottom: -5,
    left: 10,
    width: 12,
    height: 12,
    backgroundColor: 'white',
    transform: [{ rotate: '45deg' }],
  },
});