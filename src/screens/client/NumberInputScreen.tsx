import React, {useCallback, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import {useAuth, useFirestore} from '../../hooks';
import {useFocusEffect} from '@react-navigation/native';
import {doc, getFirestore, onSnapshot} from '@react-native-firebase/firestore';

const NUMBER_SEQUENCE = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const NumberInputScreen = ({navigation}: any) => {
  const {storeCode} = useAuth();
  const [number, setNumber] = useState('');
  const {getUser, updateSession} = useFirestore();

  const onNumberPress = (value: number | string) => {
    if (value === 'c') {
      // 뒤에서 한 글자씩 제거
      setNumber(number.slice(0, -1));
      return;
    }

    if (number.length >= 11) {
      Alert.alert('전화번호는 11자리까지 입력할 수 있습니다.');
      return;
    }
    
    setNumber(number + value);
  };

  const onConfirmPress = async () => {
    if (number.length < 11) {
      Alert.alert('전화번호를 모두 입력해주세요.');
      return;
    }

    // 전화번호 확인 API 호출
    // ...
    const response = await getUser(number);

    if (!response) {
      navigation.navigate('Terms', {phoneNumber: number});
      return;
    }

    // 이미 가입된 사용자라면
    // ...
    await updateSession(`session_${storeCode}`, {
      phone: number,
      mode: '',
    });
    navigation.navigate('Dashboard', {phoneNumber: number});
  };

  useFocusEffect(
    useCallback(() => {
      // session -> phone
      const db = getFirestore();
      const sessionRef = doc(db, 'sessions', `session_${storeCode}`);

      const unsubscribe = onSnapshot(sessionRef, doc => {
        if (doc.exists) {
          const data = doc.data();
          console.log('NumberInputScreen Current data: ', data);
          if (!data) {
            console.log('No data found');
            return;
          }

          console.log(data);
          // phone이 있으면 화면 이동
          if (data.mode !== 'waiting') {
            navigation.navigate('Standby');
          }
        }
      });

      return () => unsubscribe();
    }, [storeCode]),
  ); // ✅ 의존성 배열 `[]` → 최초 1회 실행

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#6a51ae"
        translucent={false}
      />
      <SafeAreaView style={styles.backgroundStyle}>
        <View style={styles.flexCenter}>
          <View style={styles.headerNumberContainer}>
            <Text style={styles.headerNumberText}>{number}</Text>
          </View>
          {NUMBER_SEQUENCE.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.numberInputContainer}>
              {row.map((number, numberIndex) => (
                <Pressable
                  key={numberIndex}
                  style={styles.numberInputButton}
                  onPress={() => onNumberPress(number)}>
                  <Text style={styles.numberInputText}>{number}</Text>
                </Pressable>
              ))}
            </View>
          ))}
          <View
            style={[
              styles.numberInputContainer,
              {
                justifyContent: number.length > 0 ? 'flex-end' : 'center',
              },
            ]}>
            <Pressable
              style={styles.numberInputButton}
              onPress={() => onNumberPress(0)}>
              <Text style={styles.numberInputText}>0</Text>
            </Pressable>
            {number.length > 0 && (
              <Pressable
                style={styles.numberInputButton}
                onPress={() => onNumberPress('c')}>
                <Text style={styles.numberInputText}>C</Text>
              </Pressable>
            )}
          </View>
          <View style={styles.headerNumberContainer}>
            <Pressable style={styles.confirmButton} onPress={onConfirmPress}>
              <Text style={styles.numberInputText}>확인</Text>
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
  backgroundStyle: {
    flex: 1,
  },
  flexCenter: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberInputContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: 240,
  },
  numberInputButton: {
    display: 'flex',
    margin: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3D7BF7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberInputText: {
    fontSize: 20,
    color: 'white',
    fontFamily: 'Pretendard-Bold',
  },
  headerNumberContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    height: 100,
  },
  headerNumberText: {
    fontSize: 30,
    fontFamily: 'Pretendard-Bold',
  },
  confirmButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 240,
    height: 40,
    backgroundColor: 'black',
  },
});

export default NumberInputScreen;
