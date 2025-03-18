import React, {useCallback, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useAuth, useFirestore} from '../../hooks';
import {getFirestore, doc, onSnapshot} from '@react-native-firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';

const DashboardScreen = ({navigation, route}: any) => {
  const phoneNumber = route.params?.phoneNumber;
  const {storeCode} = useAuth();
  const [timeLeft, setTimeLeft] = useState(60);
  const [user, setUser] = useState<User>({
    last_used: '',
    level: 0,
    stamps: 0,
  });
  const {getUser} = useFirestore();



  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        const user = await getUser(phoneNumber);
        console.log('user', user);
        if (user) {
          setUser(user as User);
        }
      };
      fetchUser();
    }, [phoneNumber]),
  );

  useFocusEffect(
    useCallback(() => {
      const db = getFirestore();
      const userRef = doc(db, 'users', phoneNumber);

      const unsubscribe = onSnapshot(userRef, doc => {
        if (doc.exists) {
          const data = doc.data();
          console.log('Dashboard Current data: ', data);
          if (!data) {
            console.log('No data found');
            return;
          }
          setUser(data as User);
        }
      });

      return () => unsubscribe();
    }, [phoneNumber]),
  ); // ✅ 의존성 배열 `[]` → 최초 1회 실행

  useFocusEffect(
    useCallback(() => {
      const db = getFirestore();
      const sessionRef = doc(db, 'sessions', `session_${storeCode}`);

      const unsubscribe = onSnapshot(sessionRef, doc => {
        if (doc.exists) {
          const data = doc.data();
          console.log('Dashboard Current data: ', data);
          if (!data) {
            console.log('No data found');
            return;
          }
          if (data.phone === '') {
            console.log(
              '관리자가 초기화 버튼을 눌렀어요! 전화번호 입력 화면으로 변경합니다.',
            );
            // 전화번호 입력 UI로 변경하는 코드 실행
            navigation.navigate('Standby');
          }
        }
      });

      return () => unsubscribe();
    }, [storeCode]),
  ); // ✅ 의존성 배열 `[]` → 최초 1회 실행

  useFocusEffect(
    useCallback(() => {
      let timer: NodeJS.Timeout;

      if (timeLeft > 0) {
        timer = setInterval(() => {
          setTimeLeft(prevTime => {
            if (prevTime <= 1) {
              clearInterval(timer);
              navigation.navigate('Standby');
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
      }

      return () => clearInterval(timer); // 화면이 비활성화되면 타이머 해제
    }, [timeLeft, navigation, storeCode]),
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#6a51ae"
        translucent={false}
      />
      <SafeAreaView style={styles.backgroundStyle}>
        <View style={styles.container}>
          <View style={styles.flexColumnBox}>
            <Text style={styles.contentsText}>남은 시간: {timeLeft}초</Text>
            <View style={styles.flexCenterBox}>
              <Text style={styles.contentsText}>레벨:</Text>
              <Text style={styles.contentsText}>{user.level}</Text>
            </View>
            <View style={styles.flexCenterBox}>
              <Text style={styles.contentsText}>스탬프:</Text>
              <Text style={styles.contentsText}>{user.stamps}</Text>
            </View>
            <View style={styles.flexCenterBox}>
              <Text style={styles.contentsText}>최근 사용일:</Text>
              <Text style={styles.contentsText}>{user.last_used}</Text>
            </View>
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
  flexColumnBox: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  flexCenterBox: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  contentsText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  
});

export default DashboardScreen;
