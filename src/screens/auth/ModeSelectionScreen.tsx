import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';

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
            <Pressable
              style={styles.modeContainer}
              onPress={() => {
                handleSignIn('supervisor');
              }}>
              <Text style={styles.buttonText}>관리자</Text>
            </Pressable>
            <Pressable
              style={styles.modeContainer}
              onPress={() => {
                handleSignIn('client');
              }}>
              <Text style={styles.buttonText}>고객</Text>
            </Pressable>
          </View>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  modeContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    // shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  buttonText: {
    color: '#191D2B',
    fontSize: 20,
    fontFamily: 'Pretendard-SemiBold',
  },
});

export default ModeSelectionScreen;
