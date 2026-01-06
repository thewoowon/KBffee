import React from 'react';
import {View} from 'react-native';

type BallProps = {
  size: number;
  color: string;
};

const Ball = ({size, color}: BallProps) => {
  const centerSize = size * 0.3;
  const armWidth = size * 0.12;
  const armLength = size * 0.9;

  return (
    <View
      style={{
        width: size,
        height: size,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {/* 눈송이 중앙 */}
      <View
        style={{
          position: 'absolute',
          width: centerSize,
          height: centerSize,
          backgroundColor: color,
          borderRadius: centerSize / 2,
          shadowColor: color,
          shadowOffset: {width: 0, height: 0},
          shadowOpacity: 0.6,
          shadowRadius: 8,
          elevation: 5,
        }}
      />

      {/* 메인 수평 라인 */}
      <View
        style={{
          position: 'absolute',
          width: armLength,
          height: armWidth,
          backgroundColor: color,
          borderRadius: armWidth / 2,
          shadowColor: color,
          shadowOffset: {width: 0, height: 0},
          shadowOpacity: 0.4,
          shadowRadius: 4,
        }}
      />

      {/* 메인 수직 라인 */}
      <View
        style={{
          position: 'absolute',
          width: armWidth,
          height: armLength,
          backgroundColor: color,
          borderRadius: armWidth / 2,
          shadowColor: color,
          shadowOffset: {width: 0, height: 0},
          shadowOpacity: 0.4,
          shadowRadius: 4,
        }}
      />

      {/* 대각선 라인 (왼쪽 위 -> 오른쪽 아래) */}
      <View
        style={{
          position: 'absolute',
          width: armLength * 0.85,
          height: armWidth,
          backgroundColor: color,
          borderRadius: armWidth / 2,
          transform: [{rotate: '45deg'}],
          shadowColor: color,
          shadowOffset: {width: 0, height: 0},
          shadowOpacity: 0.3,
          shadowRadius: 4,
        }}
      />

      {/* 대각선 라인 (오른쪽 위 -> 왼쪽 아래) */}
      <View
        style={{
          position: 'absolute',
          width: armLength * 0.85,
          height: armWidth,
          backgroundColor: color,
          borderRadius: armWidth / 2,
          transform: [{rotate: '-45deg'}],
          shadowColor: color,
          shadowOffset: {width: 0, height: 0},
          shadowOpacity: 0.3,
          shadowRadius: 4,
        }}
      />

      {/* 상단 작은 가지 (왼쪽) */}
      <View
        style={{
          position: 'absolute',
          width: armWidth * 0.7,
          height: armLength * 0.25,
          backgroundColor: color,
          borderRadius: armWidth / 2,
          transform: [{rotate: '-30deg'}],
          top: size * 0.15,
          left: size * 0.25,
          shadowColor: color,
          shadowOffset: {width: 0, height: 0},
          shadowOpacity: 0.3,
          shadowRadius: 2,
        }}
      />

      {/* 상단 작은 가지 (오른쪽) */}
      <View
        style={{
          position: 'absolute',
          width: armWidth * 0.7,
          height: armLength * 0.25,
          backgroundColor: color,
          borderRadius: armWidth / 2,
          transform: [{rotate: '30deg'}],
          top: size * 0.15,
          right: size * 0.25,
          shadowColor: color,
          shadowOffset: {width: 0, height: 0},
          shadowOpacity: 0.3,
          shadowRadius: 2,
        }}
      />

      {/* 하단 작은 가지 (왼쪽) */}
      <View
        style={{
          position: 'absolute',
          width: armWidth * 0.7,
          height: armLength * 0.25,
          backgroundColor: color,
          borderRadius: armWidth / 2,
          transform: [{rotate: '30deg'}],
          bottom: size * 0.15,
          left: size * 0.25,
          shadowColor: color,
          shadowOffset: {width: 0, height: 0},
          shadowOpacity: 0.3,
          shadowRadius: 2,
        }}
      />

      {/* 하단 작은 가지 (오른쪽) */}
      <View
        style={{
          position: 'absolute',
          width: armWidth * 0.7,
          height: armLength * 0.25,
          backgroundColor: color,
          borderRadius: armWidth / 2,
          transform: [{rotate: '-30deg'}],
          bottom: size * 0.15,
          right: size * 0.25,
          shadowColor: color,
          shadowOffset: {width: 0, height: 0},
          shadowOpacity: 0.3,
          shadowRadius: 2,
        }}
      />
    </View>
  );
};

export default Ball;
