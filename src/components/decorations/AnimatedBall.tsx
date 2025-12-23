import React, {useEffect, useRef} from 'react';
import {Animated, Easing} from 'react-native';
import {Ball} from '.';

type BallProps = {
  index: number;
  ball: {
    position: {
      top?: number;
      left?: number;
      right?: number;
      bottom?: number;
    };
    color: string;
    size: number;
    zIndex: number;
  };
};

const AnimatedBall = ({index, ball}: BallProps) => {
  const scale = useRef(new Animated.Value(0)).current;
  const sparkle = useRef(new Animated.Value(0)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const animation = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    // 초기 스케일 애니메이션
    animation.current = Animated.timing(scale, {
      toValue: 1,
      duration: 500,
      delay: index * 100,
      useNativeDriver: true,
    });

    animation.current.start(() => {
      // 스케일 애니메이션이 끝난 후 반짝임 효과 시작
      Animated.loop(
        Animated.sequence([
          Animated.timing(sparkle, {
            toValue: 1,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(sparkle, {
            toValue: 0,
            duration: 800,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.delay(2000 + Math.random() * 2000), // 랜덤 딜레이
        ]),
      ).start();

      // 흔들림 효과
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotation, {
            toValue: 1,
            duration: 1000 + Math.random() * 500,
            easing: Easing.sin,
            useNativeDriver: true,
          }),
          Animated.timing(rotation, {
            toValue: -1,
            duration: 1000 + Math.random() * 500,
            easing: Easing.sin,
            useNativeDriver: true,
          }),
          Animated.timing(rotation, {
            toValue: 0,
            duration: 1000 + Math.random() * 500,
            easing: Easing.sin,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    });

    return () => {
      scale.stopAnimation();
      sparkle.stopAnimation();
      rotation.stopAnimation();
    };
  }, []);

  const sparkleOpacity = sparkle.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  const rotate = rotation.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-3deg', '3deg'],
  });

  return (
    <Animated.View
      style={{
        transform: [{scale}, {rotate}],
        opacity: sparkleOpacity,
        position: 'absolute',
        zIndex: ball.zIndex,
        ...ball.position,
      }}>
      <Ball size={ball.size} color={ball.color} />
    </Animated.View>
  );
};

export default AnimatedBall;
