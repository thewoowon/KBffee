import React, {useCallback, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Modal,
  Alert,
} from 'react-native';
import {useAuth, useFirestore} from '../../hooks';
import {
  doc,
  getFirestore,
  onSnapshot,
  Timestamp,
} from '@react-native-firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';
import {
  CircleMinusIcon,
  CirclePlusIcon,
  CircleXIcon,
  LeftArrowIcon,
} from '../../components/Icons';
import LinearGradient from 'react-native-linear-gradient';
import {BackgroundDeco} from '../../components/background';

const NUMBER_SEQUENCE = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const DetailScreen = ({navigation, route}: any) => {
  const phoneNumber = route.params?.phoneNumber;
  const {storeCode} = useAuth();
  // const [timeLeft, setTimeLeft] = useState(1000);
  const [number, setNumber] = useState('');
  const [user, setUser] = useState<User>({
    last_used: '',
    level: 0,
    stamps: 0,
  });

  const {updateUser, updateSession, addLog} = useFirestore();

  const handleInit = async () => {
    // 세션을 초기화하고 메인 화면으로 이동
    await updateSession(`session_${storeCode}`, {
      phone: '',
      mode: 'waiting',
    });
    navigation.navigate('Main');
  };

  const handleApprove = async () => {
    if (number.length === 0) {
      Alert.alert('적립할 쿠폰의 수를 입력해주세요', '다시 입력해주세요.');
      return;
    }

    const numberValue = parseInt(number, 10);

    if (numberValue < 1) {
      Alert.alert('적립할 쿠폰의 수를 입력해주세요', '다시 입력해주세요.');
      return;
    }

    if (numberValue > 100) {
      Alert.alert(
        '적립하는 쿠폰의 수가 많은 것 같아요',
        '한 번 더 확인해주세요.',
      );
      return;
    }

    await updateUser(phoneNumber, {
      stamps: user.stamps + numberValue,
    });

    addLog({
      action: 'stamp_saved',
      phone_number: phoneNumber,
      stamp: numberValue,
      timestamp: Timestamp.now(),
    });

    setNumber('');
  };

  const handleUsing = async () => {
    if (number.length === 0) {
      Alert.alert('사용할 쿠폰의 수를 입력해주세요', '다시 입력해주세요.');
      return;
    }

    const numberValue = parseInt(number, 10);

    if (user.stamps < 1) {
      Alert.alert('스탬프가 부족해요', '적립 후 사용해주세요.');
      return;
    }

    // 10개 이상부터 사용 가능
    if (numberValue < 10) {
      Alert.alert('10개 이상부터 사용 가능해요', '다시 입력해주세요.');
      return;
    }

    if (user.stamps < numberValue) {
      Alert.alert('스탬프가 부족해요', '적립 후 사용해주세요.');
      return;
    }

    await updateUser(phoneNumber, {
      stamps: user.stamps - numberValue,
    });

    addLog({
      action: 'stamp_used',
      phone_number: phoneNumber,
      stamp: numberValue,
      timestamp: Timestamp.now(),
    });

    setNumber('');
  };

  const onNumberPress = (value: number | string) => {
    if (typeof value === 'number') {
      if (number.length > 2) {
        Alert.alert(
          '적립하는 쿠폰의 수가 많은 것 같아요',
          '한 번 더 확인해주세요.',
        );
        return;
      }

      const nextNumber = parseInt(number + value, 10);

      setNumber(nextNumber.toString());
      return;
    }

    if (typeof value === 'string') {
      if (value === 'c') {
        // 뒤에서 한 글자씩 제거
        setNumber(number.slice(0, -1));
        return;
      }

      if (value === '+10') {
        console.log('number', number);
        if (number.length > 2) {
          Alert.alert(
            '적립하는 쿠폰의 수가 많은 것 같아요',
            '한 번 더 확인해주세요.',
          );
          return;
        }

        const nextNumber = (parseInt(number, 10) || 0) + 10;

        setNumber(nextNumber.toString());
        return;
      }
    }
  };

  const phoneNumberLabel = () => {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(
      3,
      7,
    )}-${phoneNumber.slice(7)}`;
  };

  const goBack = async () => {
    await updateSession(`session_${storeCode}`, {
      phone: '',
      mode: 'waiting',
    });
    // navigation.goBack();
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     const fetchUser = async () => {
  //       const user = await getUser(phoneNumber);
  //       console.log('user', user);
  //       if (user) {
  //         setUser(user as User);
  //       }
  //     };
  //     fetchUser();
  //   }, [phoneNumber]),
  // );

  useFocusEffect(
    useCallback(() => {
      const db = getFirestore();
      const userRef = doc(db, 'users', phoneNumber);

      const unsubscribe = onSnapshot(userRef, doc => {
        if (doc.exists) {
          const data = doc.data();
          console.log('Detail Current data: ', data);
          if (!data) {
            console.log('No data found');
            return;
          }
          setUser(data as User);
        }
      });

      return () => unsubscribe();
    }, [phoneNumber]),
  );

  useFocusEffect(
    useCallback(() => {
      // session -> phone
      const db = getFirestore();
      const sessionRef = doc(db, 'sessions', `session_${storeCode}`);

      // 세션 변화 알아보기
      const unsubscribe = onSnapshot(sessionRef, doc => {
        if (doc.exists) {
          const data = doc.data();
          console.log('NumberInputScreen Current data: ', data);
          if (!data) {
            console.log('No data found');
            return;
          }

          console.log(data);
          // phone이 없으면 메인 화면으로 이동
          if (data.mode === 'waiting' && data.phone === '') {
            navigation.navigate('Main');
          }
        }
      });

      return () => unsubscribe();
    }, [storeCode]),
  ); // ✅ 의존성 배열 `[]` → 최초 1회 실행

  // 디테알 화면 ->  즉 관리자가 고객의 화면을 컨트롤해야 하는 경우
  // useFocusEffect(
  //   useCallback(() => {
  //     let timer: NodeJS.Timeout;
  //     let isMounted = true;

  //     if (timeLeft > 0) {
  //       timer = setInterval(() => {
  //         setTimeLeft(prevTime => {
  //           if (!isMounted) return prevTime;

  //           if (prevTime <= 1) {
  //             clearInterval(timer);
  //             updateSession(`session_${storeCode}`, {
  //               last_used: new Date().toISOString().split('T')[0],
  //               phone: '',
  //               mode: '',
  //             });
  //             navigation.navigate('Main');
  //             return 0;
  //           }
  //           return prevTime - 1;
  //         });
  //       }, 1000);
  //     }

  //     return () => {
  //       isMounted = false;
  //       clearInterval(timer);
  //     };
  //   }, [timeLeft, navigation, storeCode]),
  // );

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
              {
                backgroundColor: '#ffffff',
                // shadow
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 6,
                },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 10,
                borderRadius: 35,
              },
            ]}>
            <View
              style={[
                styles.flexBox,
                {gap: 7, position: 'absolute', top: 20, left: 20},
              ]}>
              <Pressable onPress={goBack}>
                <LeftArrowIcon />
              </Pressable>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: 'Pretendard-Regular',
                  color: '#191D2B',
                  lineHeight: 19,
                }}>
                취소
              </Text>
            </View>
            <View
              style={[
                {
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                },
                {gap: 110},
              ]}>
              <View
                style={[
                  styles.flexColumnBox,
                  {
                    height: 'auto',
                    gap: 10,
                    width: 340,
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    paddingTop: 54,
                  },
                ]}>
                <Text style={styles.labelSubText}>
                  {`고객번호: `}
                  <Text
                    style={[
                      styles.labelSubText,
                      {
                        color: '#FE7901',
                        fontFamily: 'sf-ui-display-semibold',
                      },
                    ]}>
                    {phoneNumberLabel()}
                  </Text>
                </Text>
                <View style={styles.labelBox}>
                  <Text style={styles.labelTitleText}>
                    고객이 사용 또는 적립할
                  </Text>
                  <Text style={styles.labelTitleText}>
                    스탬프 개수를 입력해주세요
                  </Text>
                </View>
                <View style={[styles.subLabelBox, {gap: 102}]}>
                  <Text style={[styles.labelSubText, {color: '#4E5056'}]}>
                    현재 보유 스탬프
                  </Text>
                  <Text
                    style={{
                      fontSize: 24,
                      lineHeight: 32,
                      fontFamily: 'Prentendard-Seimbold',
                      color: '#191D2B',
                    }}>
                    {user.stamps}개
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.flexColumnBox,
                  {
                    paddingLeft: 15,
                    paddingRight: 15,
                    borderRadius: 35,
                    width: 350,
                    height: 450,
                    backgroundColor: '#ffffff',
                  },
                ]}>
                <View
                  style={[
                    styles.flexColumnBox,
                    {
                      paddingLeft: 10,
                      paddingRight: 10,
                      paddingBottom: 10,
                    },
                  ]}>
                  <View
                    style={[
                      styles.flexColumnBox,
                      {
                        paddingLeft: 10,
                        paddingRight: 10,
                        paddingBottom: 10,
                      },
                    ]}>
                    <View
                      style={[
                        {
                          width: 266,
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'flex-start',
                          gap: 10,
                          marginBottom: 25,
                          paddingLeft: 6.75,
                          paddingRight: 6.75,
                        },
                      ]}>
                      <View
                        style={[
                          styles.headerNumberContainer,
                          {
                            width: '100%',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                          },
                        ]}>
                        <View style={styles.headerNumberContainer}>
                          <Text
                            style={[
                              styles.headerNumberText,
                              {
                                color:
                                  number.length > 0 ? '#FE6A00' : '#FCE1C7',
                              },
                            ]}>
                            {number || '00'}
                          </Text>
                          <Text
                            style={[
                              styles.headerNumberText,
                              {
                                fontFamily: 'Pretendard-Seimbold',
                              },
                            ]}>
                            개
                          </Text>
                        </View>
                      </View>
                      <View style={styles.divisor}></View>
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
                          justifyContent: 'flex-start',
                        },
                      ]}>
                      <Pressable
                        style={styles.numberInputButton}
                        onPress={() => onNumberPress('+10')}>
                        <Text style={styles.numberInputText}>+10</Text>
                      </Pressable>
                      <Pressable
                        style={styles.numberInputButton}
                        onPress={() => onNumberPress(0)}>
                        <Text style={styles.numberInputText}>0</Text>
                      </Pressable>
                      {number.length > 0 && (
                        <Pressable
                          style={styles.numberInputButton}
                          onPress={() => onNumberPress('c')}>
                          <LeftArrowIcon />
                        </Pressable>
                      )}
                    </View>
                  </View>
                  <View style={styles.confirmContainer}>
                    <Pressable
                      style={[
                        styles.confirmButton,
                        {backgroundColor: '#FE6A00', shadowColor: '#FE6A00'},
                      ]}
                      onPress={handleApprove}>
                      <LinearGradient
                        colors={['#FE6A00', '#FC0000']}
                        locations={[0.3, 1]}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: 4,
                          borderRadius: 20,
                        }}>
                        <CirclePlusIcon />
                        <Text style={styles.confirmButtonText}>적립하기</Text>
                      </LinearGradient>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.confirmButton,
                        {
                          backgroundColor: '#0090FE',
                          shadowColor: '#0090FE',
                        },
                      ]}
                      onPress={handleUsing}>
                      <LinearGradient
                        colors={['#0090FE', '#003FFC']}
                        locations={[0.3, 1]}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: 4,
                          borderRadius: 20,
                        }}>
                        <CircleMinusIcon />
                        <Text style={styles.confirmButtonText}>사용하기</Text>
                      </LinearGradient>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        {/* <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>몇 개를 적립할까요?</Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 10,
                  paddingTop: 10,
                  paddingBottom: 20,
                }}>
                <Pressable
                  onPress={() => {
                    if (stamps > 0) {
                      setStamps(stamps - 1);
                    }
                  }}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#2196F3',
                    height: 32,
                    width: 32,
                    borderRadius: 20,
                  }}>
                  <Text style={styles.counterText}>-</Text>
                </Pressable>
                <Text style={styles.counterInnerText}>{stamps}개</Text>
                <Pressable
                  onPress={() => {
                    setStamps(stamps + 1);
                  }}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#2196F3',
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                  }}>
                  <Text style={styles.counterText}>+</Text>
                </Pressable>
              </View>
              <View style={styles.flexRowBox}>
                <Pressable style={[styles.buttonClose]} onPress={handleApprove}>
                  <Text style={styles.textStyle}>확인</Text>
                </Pressable>
                <Pressable style={[styles.buttonClose]} onPress={handleCancel}>
                  <Text style={styles.textStyle}>취소</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal> */}
        <BackgroundDeco />
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
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
  flexRowBox: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  button: {
    flex: 1,
    height: 50,
    backgroundColor: '#3D7BF7',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    height: 'auto',
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
  counterText: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 24,
    textAlign: 'center',
  },
  counterInnerText: {
    fontSize: 18,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 20,
    textAlign: 'center',
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
  labelBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  subLabelBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  labelTitleText: {
    fontSize: 28,
    fontFamily: 'Pretendard-Medium',
    lineHeight: 38,
  },
  labelSubText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 24,
  },
  numberInputContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: 266,
    rowGap: 25,
  },
  numberInputButton: {
    display: 'flex',
    margin: 10,
    width: 68.5,
    height: 33,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberInputText: {
    fontSize: 28,
    color: '#4B4D55',
    fontFamily: 'sf-ui-display-semibold',
  },
  headerNumberContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
  },
  headerNumberText: {
    fontSize: 28,
    color: '#191D2B',
    fontFamily: 'sf-ui-display-semibold',
    lineHeight: 38,
  },
  divisor: {
    width: '100%',
    height: 0.5,
    backgroundColor: '#E0E0E9',
  },
  confirmContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 45,
    gap: 12,
  },
  confirmButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    height: 55,
    backgroundColor: '#FE8300',
    borderRadius: 20,
    // shadow
    shadowColor: '#FE6D00',
    shadowOffset: {
      width: 0,
      height: 4.5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  },
  confirmButtonText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Pretendard-Regular',
  },
  flexBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DetailScreen;
