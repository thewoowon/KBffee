import React from 'react';
import {View} from 'react-native';

type BallProps = {
  size: number;
  color: string;
};

const Ball = ({size, color}: BallProps) => {
  const ribbonWidth = size * 0.15;
  const ribbonColor = '#FFD700'; // 금색 리본

  return (
    <View
      style={{
        width: size,
        height: size,
        position: 'relative',
      }}>
      {/* 선물 상자 본체 */}
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.1,
          backgroundColor: color,
          borderWidth: 2,
          borderColor: 'rgba(0,0,0,0.1)',
        }}
      />

      {/* 세로 리본 */}
      <View
        style={{
          position: 'absolute',
          width: ribbonWidth,
          height: size,
          backgroundColor: ribbonColor,
          left: (size - ribbonWidth) / 2,
          top: 0,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: 'rgba(0,0,0,0.15)',
        }}
      />

      {/* 가로 리본 */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: ribbonWidth,
          backgroundColor: ribbonColor,
          left: 0,
          top: (size - ribbonWidth) / 2,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: 'rgba(0,0,0,0.15)',
        }}
      />

      {/* 리본 매듭 (중앙) */}
      <View
        style={{
          position: 'absolute',
          width: ribbonWidth * 1.8,
          height: ribbonWidth * 1.8,
          backgroundColor: ribbonColor,
          borderRadius: ribbonWidth * 0.9,
          left: (size - ribbonWidth * 1.8) / 2,
          top: (size - ribbonWidth * 1.8) / 2,
          borderWidth: 2,
          borderColor: 'rgba(0,0,0,0.2)',
        }}
      />
    </View>
  );
};

export default Ball;
