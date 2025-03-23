import React from 'react';
import {View} from 'react-native';

type BallProps = {
  size: number;
  color: string;
};

const Ball = ({size, color}: BallProps) => {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
      }}
    />
  );
};

export default Ball;
