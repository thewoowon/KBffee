import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import {ProfileIcon, StatisticIcon} from '../../components/Icons';
import {BackgroundDeco} from '../../components/background';

const ModeSelectionScreen = ({navigation, route}: any) => {
  const handleSignIn = (mode: 'supervisor' | 'client') => {
    navigation.navigate('SignIn', {mode});
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#6a51ae"
        translucent={false}
      />
      <SafeAreaView style={styles.backgroundStyle}>
        <View style={styles.wrapper}>
          <View style={styles.flexBox}>
            <View>
              <Text
                style={{
                  fontSize: 24,
                  fontFamily: 'Pretendard-SemiBold',
                  lineHeight: 32,
                  letterSpacing: 1,
                }}>
                모드를 선택해주세요
              </Text>
            </View>
            <View style={styles.flexBoxRow}>
              <Pressable
                style={styles.modeContainer}
                onPress={() => {
                  handleSignIn('supervisor');
                }}>
                <StatisticIcon />
                <Text style={styles.buttonText}>관리자 모드</Text>
              </Pressable>
              <Pressable
                style={styles.modeContainer}
                onPress={() => {
                  handleSignIn('client');
                }}>
                <ProfileIcon />
                <Text style={styles.buttonText}>고객 모드</Text>
              </Pressable>
            </View>
          </View>
        </View>
        <BackgroundDeco />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
  backgroundStyle: {
    flex: 1,
  },
  flexBox: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 33,
  },
  flexBoxRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  modeContainer: {
    width: 391,
    gap: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 88,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    // shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  buttonText: {
    color: '#191D2B',
    fontSize: 24,
    fontFamily: 'Pretendard-SemiBold',
  },
});

export default ModeSelectionScreen;
