import React, {useEffect} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {doc, getFirestore, onSnapshot} from '@react-native-firebase/firestore';

const StandbyScreen = ({navigation, route}: any) => {
  useEffect(() => {
    const db = getFirestore();
    const sessionRef = doc(db, 'sessions', 'session_ABC123');

    const unsubscribe = onSnapshot(sessionRef, doc => {
      if (doc.exists) {
        const data = doc.data();
        if (!data) {
          console.log('No data found');
          return;
        }
        if (data.mode === 'waiting') {
          console.log(
            '관리자가 조회 버튼을 눌렀어요! 전화번호 입력 화면으로 변경합니다.',
          );
          // 전화번호 입력 UI로 변경하는 코드 실행
          navigation.navigate('NumberInput');
        }
      }
    });

    // 🔥 구독 취소 (cleanup function)
    return () => unsubscribe();
  }, []); // ✅ 의존성 배열 `[]` → 최초 1회 실행
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#6a51ae"
        translucent={false}
      />
      <SafeAreaView style={styles.backgroundStyle}>
        <View style={styles.container}>
          <Text>Standby Screen</Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundStyle: {
    flex: 1,
  },
});

export default StandbyScreen;
