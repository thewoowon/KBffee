import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

const LoadingOverlay = ({ isLoading }: { isLoading: boolean }) => {
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setDotCount(prev => (prev % 3) + 1); // 1 -> 2 -> 3 -> 1
    }, 500);

    return () => clearInterval(interval);
  }, [isLoading]);

  return isLoading ? (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
      }}>
      <Text
        style={{
          fontSize: 24,
          fontFamily: 'Pretendard-SemiBold',
          color: '#fff',
        }}>
        조금만 기다려주세요{'...'.slice(0, dotCount)}
      </Text>
    </View>
  ) : null;
};

export default LoadingOverlay;
