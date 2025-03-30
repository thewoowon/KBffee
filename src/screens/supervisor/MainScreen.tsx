import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  // Modal,
} from 'react-native';
import {useAuth, useFirestore} from '../../hooks';
import {doc, getFirestore, onSnapshot} from '@react-native-firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';
import {
  ProfileIcon,
  RefreshIcon,
  ShortLeftArrowIcon,
  ShortRightArrowIcon,
  StatisticIcon,
} from '../../components/Icons';
import dayjs from 'dayjs';
import {BackgroundDeco} from '../../components/background';

const STATISTICS: {
  action: string;
  phone_number: string;
  timestamp: string;
  stamps: number;
}[] = [
  {
    // 스탬프 사용
    action: 'stamp_used',
    phone_number: '01065663684',
    timestamp: '2021-12-31',
    stamps: 1,
  },
  {
    // 스탬프 적립
    action: 'stamp_saved',
    phone_number: '01065663684',
    timestamp: '2021-12-31',
    stamps: 1,
  },
];

const MainScreen = ({navigation, route}: any) => {
  const {storeCode} = useAuth();
  const {enterNumber, getLogs} = useFirestore();
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(dayjs());
  const [logs, setLogs] = useState<Log[]>([]);

  const handleSearch = async () => {
    Alert.alert('준비중', '고객조회 기능은 준비중입니다.');
    return;
    await enterNumber(`session_${storeCode}`);
    setModalVisible(true);
  };

  const handleStatistics = () => {
    Alert.alert('준비중', '통계 기능은 준비중입니다.');
    return;
    // navigation.navigate('Statistics');
  };

  // const handleCancel = () => {
  //   setModalVisible(false);
  //   updateSession(`session_${storeCode}`, {
  //     mode: 'waiting',
  //   });
  // };

  const handleDateMinusChange = (value: number) => {
    setDate(date.subtract(value, 'day'));
  };

  const handleDatePlusChange = (value: number) => {
    setDate(date.add(value, 'day'));
  };

  useFocusEffect(
    useCallback(() => {
      const fetchLogs = async () => {
        const dateString = date.format('YYYY-MM-DD');
        console.log('fetchLogs', dateString);
        const logs = await getLogs(dateString);
        if (logs) {
          setLogs(logs);
        }
      };
      fetchLogs();
    }, [date]),
  );

  useFocusEffect(
    useCallback(() => {
      // session -> phone
      const db = getFirestore();
      const sessionRef = doc(db, 'sessions', `session_${storeCode}`);

      const unsubscribe = onSnapshot(sessionRef, doc => {
        if (doc.exists) {
          const data = doc.data();
          console.log('Supervisor Main Current data: ', data);
          if (!data) {
            console.log('No data found');
            return;
          }

          console.log(data);
          // phone이 있으면 화면 이동
          if (data.phone !== '' && data.mode === 'onboarding') {
            setModalVisible(false);
            navigation.navigate('Detail', {phoneNumber: data.phone});
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
        <View style={styles.innerContainer}>
          <View
            style={[
              styles.flexRowBox,
              {justifyContent: 'flex-end', marginBottom: 12},
            ]}>
            <View style={[styles.flexRowBox, {gap: 8}]}>
              <Pressable style={styles.button} onPress={handleStatistics}>
                <StatisticIcon width={24} height={24} />
                <Text style={styles.buttonText}>통계</Text>
              </Pressable>
              <Pressable style={styles.button} onPress={handleSearch}>
                <ProfileIcon width={24} height={24} />
                <Text style={styles.buttonText}>고객조회</Text>
              </Pressable>
            </View>
          </View>
          <View
            style={[
              styles.innerContainer,
              {
                backgroundColor: 'white',
                borderRadius: 20,
                gap: 20,
              },
            ]}>
            <View
              style={[
                styles.flexRowBox,
                {justifyContent: 'space-between', paddingHorizontal: 12},
              ]}>
              <Text style={styles.titleText}>적립내역</Text>
              <View
                style={[
                  styles.flexRowBox,
                  {
                    gap: 18,
                  },
                ]}>
                <Pressable
                  onPress={() => setDate(dayjs())}
                  style={[
                    styles.flexRowBox,
                    {
                      backgroundColor: '#F3F3F3',
                      width: 61,
                      height: 26,
                      borderRadius: 6,
                      gap: 2,
                    },
                  ]}>
                  <RefreshIcon width={12} height={12} />
                  <Text>오늘</Text>
                </Pressable>
                <View
                  style={[
                    styles.flexRowBox,
                    {
                      gap: 12,
                    },
                  ]}>
                  <Pressable onPress={() => handleDateMinusChange(1)}>
                    <ShortLeftArrowIcon />
                  </Pressable>
                  <Text
                    style={{
                      fontFamily: 'Pretendard-Medium',
                      fontSize: 14,
                      lineHeight: 22,
                      letterSpacing: -1,
                    }}>
                    {date.format('MM월 DD일')}
                  </Text>
                  <Pressable onPress={() => handleDatePlusChange(1)}>
                    <ShortRightArrowIcon />
                  </Pressable>
                </View>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                paddingHorizontal: 12,
              }}>
              <View
                style={[
                  styles.flexRowBox,
                  {
                    justifyContent: 'space-between',
                    height: 30,
                    borderBottomWidth: 1,
                    borderBottomColor: '#E5E5E5',
                    gap: 16,
                    marginBottom: 16,
                  },
                ]}>
                <View
                  style={[
                    styles.flexRowBox,
                    {justifyContent: 'flex-start', gap: 16, flex: 1},
                  ]}>
                  <Text
                    style={{
                      width: 51,
                      color: '#9F9FA6',
                    }}>
                    적립정보
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      color: '#9F9FA6',
                    }}>
                    회원정보
                  </Text>
                </View>
                <Text
                  style={{
                    width: 120,
                    color: '#9F9FA6',
                  }}>
                  일시
                </Text>
              </View>
              <ScrollView style={styles.scrollView}>
                <View
                  style={{display: 'flex', flexDirection: 'column', gap: 16}}>
                  {logs.map((statistic, index) => (
                    <View key={index} style={styles.listBox}>
                      <View
                        style={[
                          styles.flexRowBox,
                          {justifyContent: 'flex-start', gap: 16, flex: 1},
                        ]}>
                        <View
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 6,
                            width: 51,
                            height: 26,
                            backgroundColor:
                              statistic.action === 'stamp_saved'
                                ? '#FFEBD7'
                                : '#E8F1FF',
                          }}>
                          <Text
                            style={{
                              fontSize: 12,
                              lineHeight: 22,
                              letterSpacing: -1,
                              fontFamily: 'Pretendard-Semibold',
                              color:
                                statistic.action === 'stamp_saved'
                                  ? '#FF8400'
                                  : '#3F8CFF',
                            }}>
                            {statistic.action === 'stamp_saved'
                              ? '적립'
                              : '사용'}{' '}
                            {statistic.stamp}
                          </Text>
                        </View>
                        <Text style={{color: '#1B2128'}}>
                          {statistic.phone_number}
                        </Text>
                      </View>
                      <Text
                        style={{
                          width: 120,
                          color: '#878B8F',
                          fontSize: 12,
                          lineHeight: 22,
                        }}>
                        {dayjs(statistic.timestamp).format('YYYY-MM-DD HH:mm')}
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </View>
        {/* <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>번호를 입력하는 중이에요</Text>
              <Pressable style={[styles.buttonClose]} onPress={handleCancel}>
                <Text style={styles.textStyle}>번호 입력 취소</Text>
              </Pressable>
            </View>
          </View>
        </Modal> */}
        <BackgroundDeco backgroundColor="#FFFAE3" />
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
  innerContainer: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 24,
    paddingBottom: 24,
  },
  flexColumnBox: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  flexRowBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  button: {
    width: 112,
    height: 40,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#191D2B',
    fontFamily: 'Pretendard-Semibold',
    fontSize: 16,
    lineHeight: 19,
    letterSpacing: -1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    height: 120,
    width: 'auto',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    height: 50,
    width: 120,
    borderRadius: 10,
    elevation: 2,
    justifyContent: 'center',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  titleText: {
    fontFamily: 'Pretendard-Semibold',
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -1,
  },
});

export default MainScreen;
