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
  const animation = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    animation.current = Animated.timing(scale, {
      toValue: 1,
      duration: 500,
      delay: index * 100,
      useNativeDriver: true,
    });

    animation.current.start();

    return () => {
      // 💡 cleanup: 애니메이션 강제 종료
      scale.stopAnimation();
    };
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
