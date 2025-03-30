import React from 'react';
import {StyleSheet, View} from 'react-native';
import EllipseDeco from './EllipseDeco';

const BackgroundDeco = ({
  backgroundColor = '#FFFFFF',
}: {
  backgroundColor?: string;
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
        },
      ]}>
      <View style={[styles.absoluteBox, {top: 108, left: 128}]}>
        <EllipseDeco />
      </View>
      <View style={[styles.absoluteBox, {bottom: -311, right: 81}]}>
        <EllipseDeco />
      </View>
      <View style={[styles.absoluteBox, {top: -195, right: 19}]}>
        <EllipseDeco color="#FFF1C5" />
      </View>
      <View style={[styles.absoluteBox, {top: 345, left: -60}]}>
        <EllipseDeco color="#FFF1C5" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: -1,
  },
  absoluteBox: {
    position: 'absolute',
  },
});

export default BackgroundDeco;
