import React from 'react';
import {View, Text, Image} from 'react-native';

const BeverageTwoOverlay = ({show}: {show: boolean}) => {
  return show ? (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        gap: 16,
      }}>
      <Image
        source={require(`../../assets/images/beverage_two.png`)}
        style={{
          width: 278,
          height: 278,
          marginBottom: 20,
        }}
      />
      <Text
        style={{
          fontSize: 42,
          lineHeight: 45,
          fontFamily: 'Pretendard-Bold',
          letterSpacing: -1,
          color: '#fff',
        }}>
        2개만 더!
      </Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 20,
            lineHeight: 28,
            fontFamily: 'Pretendard-Medium',
            letterSpacing: -0.5,
            color: '#fff',
          }}>
          스탬프{' '}
          <Text
            style={{
              color: '#FF8400',
            }}>
            2개
          </Text>
          만 더 모으면{' '}
        </Text>
        <Text
          style={{
            fontSize: 20,
            lineHeight: 28,
            fontFamily: 'Pretendard-Medium',
            letterSpacing: -0.5,
            color: '#fff',
          }}>
          조제음료 무료 쿠폰이 한장 생겨요!
        </Text>
      </View>
    </View>
  ) : null;
};

export default BeverageTwoOverlay;
