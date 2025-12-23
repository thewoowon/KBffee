import React, {useEffect, useRef} from 'react';
import {Animated, Easing, View} from 'react-native';

type SnowflakeProps = {
  delay: number;
  left: number;
  size: number;
};

const Snowflake = ({delay, left, size}: SnowflakeProps) => {
  const translateY = useRef(new Animated.Value(-20)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 800,
            duration: 8000 + Math.random() * 4000,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(translateX, {
              toValue: 15,
              duration: 2000,
              easing: Easing.sin,
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: -15,
              duration: 2000,
              easing: Easing.sin,
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: 15,
              duration: 2000,
              easing: Easing.sin,
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: 0,
              duration: 2000,
              easing: Easing.sin,
              useNativeDriver: true,
            }),
          ]),
        ]),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -20,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      translateY.stopAnimation();
      translateX.stopAnimation();
      opacity.stopAnimation();
    };
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: `${left}%`,
        transform: [{translateY}, {translateX}],
        opacity,
      }}>
      <View
        style={{
          width: size,
          height: size,
          backgroundColor: '#FFFFFF',
          borderRadius: size / 2,
          shadowColor: '#FFFFFF',
          shadowOffset: {width: 0, height: 0},
          shadowOpacity: 0.8,
          shadowRadius: 4,
        }}
      />
    </Animated.View>
  );
};

type SnowflakeEffectProps = {
  count?: number;
};

const SnowflakeEffect = ({count = 20}: SnowflakeEffectProps) => {
  const snowflakes = Array.from({length: count}, (_, i) => ({
    id: i,
    delay: Math.random() * 5000,
    left: Math.random() * 100,
    size: 4 + Math.random() * 6,
  }));

  return (
    <View
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
      pointerEvents="none">
      {snowflakes.map(snowflake => (
        <Snowflake
          key={snowflake.id}
          delay={snowflake.delay}
          left={snowflake.left}
          size={snowflake.size}
        />
      ))}
    </View>
  );
};

export default SnowflakeEffect;
