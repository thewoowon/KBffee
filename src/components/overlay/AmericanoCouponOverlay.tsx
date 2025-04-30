import React from 'react';
import {View, Text, Image} from 'react-native';

const AmericanoCouponOverlay = ({show}: {show: boolean}) => {
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
        source={require(`../../assets/images/americano_coupon.png`)}
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
        쿠폰 획득!
      </Text>
      <Text
        style={{
          fontSize: 20,
          lineHeight: 28,
          fontFamily: 'Pretendard-Medium',
          letterSpacing: -0.5,
          color: '#fff',
        }}>
        <Text
          style={{
            color: '#FF8400',
          }}>
          1,800원
        </Text>
        을 아낄 수 있는 기회!
      </Text>
    </View>
  ) : null;
};

export default AmericanoCouponOverlay;
