import React, {useCallback, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import {useAuth, useFirestore} from '../../hooks';
import {useFocusEffect} from '@react-navigation/native';
import {doc, getFirestore, onSnapshot} from '@react-native-firebase/firestore';
import {
  CheckIcon,
  CircleXIcon,
  LeftArrowIcon,
  XIcon,
} from '../../components/Icons';
import LinearGradient from 'react-native-linear-gradient';

const NUMBER_SEQUENCE = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const NumberInputScreen = ({navigation}: any) => {
  const {storeCode} = useAuth();
  const [number, setNumber] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [agree, setAgree] = useState(false);
  const {addUser, getUser, updateSession} = useFirestore();

  const onNumberPress = (value: number | string) => {
    if (value === 'c') {
      // 뒤에서 한 글자씩 제거
      setNumber(number.slice(0, -1));
      return;
    }

    if (number.length >= 8) {
      Alert.alert('전화번호는 11자리까지 입력할 수 있습니다.');
      return;
    }

    setNumber(number + value);
  };

  const onConfirmPress = async () => {
    if (number.length < 8) {
      Alert.alert('전화번호를 모두 입력해주세요.');
      return;
    }

    const phoneNumber = `010${number}`;

    // 전화번호 확인 API 호출
    // ...
    const response = await getUser(phoneNumber);

    if (!response) {
      // 가입되지 않은 사용자라면
      setModalVisible(true);
      return;
    }

    // 이미 가입된 사용자라면
    // ...
    await updateSession(`session_${storeCode}`, {
      phone: phoneNumber,
      // 고객인 핸드폰 번호를 입력하고 -> 적립 상황판으로 이동하는
      mode: 'onboarding',
    });
    navigation.navigate('Dashboard', {phoneNumber});
    setNumber('');
  };

  const phoneNumberLabel = () => {
    if (number.length === 0) {
      return '';
    } else if (number.length < 5) {
      return `-${number}`;
    } else {
      return `-${number.slice(0, 4)}-${number.slice(4)}`;
    }
  };

  const onAgreePress = async () => {
    if (!agree) {
      Alert.alert('이용약관에 동의해주세요.');
      return;
    }

    const phoneNumber = `010${number}`;
    await addUser(phoneNumber);
    await updateSession(`session_${storeCode}`, {
      phone: phoneNumber,
      mode: 'onboarding',
    });
    navigation.navigate('Dashboard', {phoneNumber});

    setModalVisible(false);
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     // session -> phone
  //     const db = getFirestore();
  //     const sessionRef = doc(db, 'sessions', `session_${storeCode}`);

  //     // 세션 변화 알아보기
  //     const unsubscribe = onSnapshot(sessionRef, doc => {
  //       if (doc.exists) {
  //         const data = doc.data();
  //         console.log('NumberInputScreen Current data: ', data);
  //         if (!data) {
  //           console.log('No data found');
  //           return;
  //         }

  //         console.log(data);
  //         // phone이 있으면 화면 이동
  //         if (data.mode !== 'waiting') {
  //           navigation.navigate('Standby');
  //         }
  //       }
  //     });

  //     return () => unsubscribe();
  //   }, [storeCode]),
  // ); // ✅ 의존성 배열 `[]` → 최초 1회 실행

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#6a51ae"
        translucent={false}
      />
      <SafeAreaView style={styles.backgroundStyle}>
        <View style={[styles.flexRowBox]}>
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
              <View style={styles.labelBox}>
                <Text style={styles.labelTitleText}>오늘도 찐~한 커피</Text>
                <Text style={styles.labelTitleText}>한 잔 마시고</Text>
                <Text style={styles.labelTitleText}>열심히 달려볼까요?</Text>
              </View>
              <View style={styles.subLabelBox}>
                <Text style={styles.labelSubText}>
                  스탬프 조회 또는 가입을 위해
                </Text>
                <Text style={styles.labelSubText}>
                  전화번호를 입력해주세요.
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.flexColumnBox,
                {
                  paddingTop: 47.5,
                  paddingLeft: 15,
                  paddingRight: 15,
                  paddingBottom: 28,
                  borderRadius: 35,
                  width: 350,
                  height: 450,
                  backgroundColor: '#ffffff',
                  shadowColor: '#000000',
                  shadowOffset: {
                    width: 0,
                    height: 4.5,
                  },
                  shadowOpacity: 0.07,
                  shadowRadius: 22,
                  elevation: 6,
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
                      flex: 1,
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
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        },
                      ]}>
                      <View style={styles.headerNumberContainer}>
                        <Text style={styles.headerNumberText}>010</Text>
                        <Text style={styles.headerNumberText}>
                          {phoneNumberLabel()}
                        </Text>
                      </View>
                      {number.length > 0 && (
                        <Pressable
                          onPress={() => {
                            setNumber('');
                          }}>
                          <CircleXIcon />
                        </Pressable>
                      )}
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
                        justifyContent:
                          number.length > 0 ? 'flex-end' : 'center',
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
                        <LeftArrowIcon />
                      </Pressable>
                    )}
                  </View>
                </View>
                <View style={styles.confirmContainer}>
                  <Pressable
                    style={styles.confirmButton}
                    onPress={onConfirmPress}>
                    <LinearGradient
                      colors={['#FE8300', '#FC4A00']}
                      locations={[0.3, 1]}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 1}}
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 20,
                      }}>
                      <Text style={styles.confirmButtonText}>조회하기</Text>
                    </LinearGradient>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </View>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View
                style={[
                  {
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 9,
                  },
                ]}>
                <Text
                  style={[
                    styles.welcomeText,
                    {
                      color: '#191D2B',
                      fontFamily: 'sf-ui-display-semibold',
                    },
                  ]}>
                  <Text
                    style={[
                      styles.welcomeText,
                      {
                        color: '#FE7901',
                        fontFamily: 'Prentendard-Regular',
                      },
                    ]}>
                    010{phoneNumberLabel()}
                  </Text>{' '}
                  님 반갑습니다!
                </Text>
                <Pressable
                  style={{
                    height: 28,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    padding: 7,
                  }}
                  onPress={() => {
                    setModalVisible(false);
                  }}>
                  <XIcon />
                </Pressable>
              </View>
              <Text style={styles.titleText}>
                큽피(KBffee) 가입을 위해 이용약관 동의가 필요해요
              </Text>
              <Text style={styles.subtitleText}>
                아래 이용약관 확인 후 가입을 완료해 주세요.
              </Text>
              <ScrollView
                style={{
                  width: '100%',
                  borderColor: '#E0E0E9',
                  borderWidth: 0.5,
                  borderRadius: 10,
                  marginBottom: 36,
                  marginTop: 15,
                }}>
                <View style={styles.termsContainer}>
                  <Text>개인정보의 수집. 및 이용 동의서</Text>
                  <Text style={styles.termsLightSubtitle}>
                    - 이용자가 제공한 모든 정보는 다음의 목적을 위해 활용하며,
                    하기 목적 이외의 용도로는 사용되지 않습니다.
                  </Text>
                  <Text style={styles.termsSubtitle}>
                    ① 개인정보 수집 항목 및 수집·이용 목적
                  </Text>
                  <Text style={styles.termsBasicText}>
                    가) 수집 항목 (필수항목)
                  </Text>
                  <Text style={styles.termsSmallText}>
                    - 전화번호(휴대전화)
                  </Text>
                  <Text style={styles.termsBasicText}>
                    나) 수집 및 이용 목적
                  </Text>
                  <Text style={styles.termsSmallText}>
                    - 서비스 제공 및 운영
                  </Text>
                  <Text style={styles.termsSmallText}>- 사용자 본인 확인</Text>
                  <Text style={styles.termsSubtitle}>
                    ② 개인정보 보유 및 이용 기간
                  </Text>
                  <Text style={styles.termsSmallText}>
                    - 수집·이용 동의일로부터 개인정보의 수집·이용 목적을 달성할
                    때까지
                  </Text>
                  <Text style={styles.termsSubtitle}>③ 동의거부관리</Text>
                  <Text style={styles.termsSmallText}>
                    - 귀하께서는 본 안내에 따른 개인정보 수집, 이용에 대하여
                    동의를 거부하실 권리가 있습니다. 다만, 귀하가 개인정보의
                    수집·이용에 동의를 거부하시는 경우에 서비스 이용 과정에 있어
                    불이익이 발생할 수 있음을 알려드립니다.
                  </Text>
                </View>
              </ScrollView>
              <View
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 12,
                }}>
                <Pressable
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: 6,
                    paddingLeft: 16,
                  }}
                  onPress={() => setAgree(!agree)}>
                  <CheckIcon color={agree ? '#0090FE' : '#CFCFCF'} />
                  <Text style={styles.bottomText}>
                    이용약관을 모두 읽었으며 해당 내용에 모두 동의합니다.
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.confirmButton,
                    {
                      width: '100%',
                      backgroundColor: agree ? '#FE8300' : '#CFCFCF',
                      shadowOpacity: agree ? 0.5 : 0,
                    },
                  ]}
                  onPress={onAgreePress}>
                  <LinearGradient
                    colors={['#FE8300', '#FC4A00']}
                    locations={[0.3, 1]}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 20,
                    }}>
                    <Text style={styles.confirmButtonText}>가입완료</Text>
                  </LinearGradient>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <View
          style={[
            styles.decoCircle,
            {
              top: -30,
              right: 50,
            },
          ]}></View>
        <View
          style={[
            styles.decoCircle,
            {
              bottom: -250,
              left: 87,
            },
          ]}></View>
        <View
          style={[
            styles.decoCircle,
            {
              backgroundColor: '#FFBED4',
              right: 94,
              bottom: -250,
            },
          ]}></View>
        <View
          style={[
            styles.decoCircle,
            {
              backgroundColor: '#FFBED4',
              right: 300,
              bottom: -60,
            },
          ]}></View>
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
  flexRowBox: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexColumnBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  subLabelBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  labelTitleText: {
    fontSize: 28,
    fontFamily: 'Pretendard-Medium',
    lineHeight: 38,
  },
  labelSubText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Light',
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
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerNumberText: {
    fontSize: 28,
    color: '#191D2B',
    fontFamily: 'sf-ui-display-semibold',
  },
  confirmContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32.5,
  },
  confirmButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
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
  divisor: {
    width: '100%',
    height: 0.5,
    backgroundColor: '#E0E0E9',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    height: 450,
    width: 634,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
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
  termsContainer: {
    flex: 1,
    padding: 12,
  },
  templateContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 5,
    borderWidth: 0.5,
    borderColor: '#8E979E',
    borderRadius: 5,
    marginBottom: 20,
  },
  templateText: {
    fontSize: 10,
    fontFamily: 'Pretendard-Light',
  },
  termsLightSubtitle: {
    fontSize: 10,
    fontFamily: 'Pretendard-Light',
    marginTop: 10,
    paddingLeft: 10,
  },
  termsSubtitle: {
    fontSize: 11,
    fontFamily: 'Pretendard-Regular',
    marginTop: 10,
    paddingLeft: 10,
  },
  termsBasicText: {
    fontSize: 10,
    fontFamily: 'Pretendard-Light',
    marginTop: 5,
    paddingLeft: 20,
  },
  termsSmallText: {
    fontSize: 10,
    fontFamily: 'Pretendard-Light',
    marginTop: 5,
    paddingLeft: 30,
  },
  welcomeText: {
    fontSize: 20,
    lineHeight: 28,
  },
  titleText: {
    width: '100%',
    fontSize: 24,
    lineHeight: 32,
    fontFamily: 'Pretendard-Medium',
  },
  subtitleText: {
    width: '100%',
    fontSize: 14,
    lineHeight: 24,
    fontFamily: 'Pretendard-Regular',
    color: '#7F838E',
  },
  bottomText: {
    fontSize: 14,
    lineHeight: 22,
    fontFamily: 'Pretendard-Regular',
    color: '#191D2B',
  },
  decoCircle: {
    width: 450,
    height: 450,
    borderRadius: 225,
    backgroundColor: '#FFF5C5',
    position: 'absolute',
    opacity: 0.1,
    zIndex: -1,
  },
});

export default NumberInputScreen;
