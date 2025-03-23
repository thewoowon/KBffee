import React, {useEffect, useRef} from 'react';
import {Animated} from 'react-native';
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

  useEffect(() => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 500,
      delay: index * 100, // index에 따라 순차 애니메이션
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        transform: [{scale}],
        position: 'absolute',
        zIndex: ball.zIndex,
        ...ball.position,
      }}>
      <Ball size={ball.size} color={ball.color} />
    </Animated.View>
  );
};

export default AnimatedBall;
