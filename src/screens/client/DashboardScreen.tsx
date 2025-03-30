import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Animated,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useAuth, useFirestore} from '../../hooks';
import {getFirestore, doc, onSnapshot} from '@react-native-firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';
import {LeftArrowIcon} from '../../components/Icons';
import {AnimatedBall} from '../../components/decorations';
import {BackgroundDeco} from '../../components/background';

// 총 13개까지
const BALL_POSITIONS: {
  position: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
  color: string;
  size: number;
  zIndex: number;
}[] = [
  {
    position: {bottom: -4, left: -49},
    color: '#FF515D',
    size: 117,
    zIndex: 1,
  }, // 1
  {position: {bottom: -85, left: 19}, color: '#86AEFE', size: 117, zIndex: 6}, // 2
  {position: {bottom: -26, left: 109}, color: '#9165DD', size: 117, zIndex: 5}, // 3
  {position: {bottom: -38, left: 181}, color: '#FFAE62', size: 117, zIndex: 3}, // 4
  {position: {bottom: -20, right: -25}, color: '#5DB0EB', size: 117, zIndex: 4}, // 5

  {position: {bottom: 70, left: -44}, color: '#67B265', size: 117, zIndex: 6}, // 6
  {position: {bottom: 11, left: 34}, color: '#FFB2F6', size: 117, zIndex: 13}, // 7
  {position: {bottom: 50, left: 131}, color: '#FFF0A8', size: 117, zIndex: 1}, // 8
  {position: {bottom: 70, right: 7}, color: '#67B265', size: 117, zIndex: 5}, // 9
  {position: {bottom: 133, left: -40}, color: '#FFF0A8', size: 117, zIndex: 4}, // 10

  {position: {bottom: 112, left: 59}, color: '#5DB0EB', size: 117, zIndex: 5}, // 11
  {position: {bottom: 123, left: 142}, color: '#FFAE62', size: 117, zIndex: 1}, // 12
  {position: {bottom: 160, right: -39}, color: '#FF515D', size: 117, zIndex: 1}, // 13
];

const DashboardScreen = ({navigation, route}: any) => {
  const phoneNumber = route.params?.phoneNumber;
  const {storeCode} = useAuth();
  const [timeLeft, setTimeLeft] = useState(60);
  const [user, setUser] = useState<User | null>(null);
  const [prevUser, setPrevUser] = useState<User | null>(null);

  const userRef = useRef<User | null>(null);
  const prevUserRef = useRef<User | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current; // 초기값 0

  const {updateSession} = useFirestore();

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

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // useFocusEffect(
  //   useCallback(() => {
  //     const fetchUser = async () => {
  //       const user = await getUser(phoneNumber);
  //       console.log('fetchUser', user);
  //       if (user) {
  //         setUser(user as User);
  //       }
  //     };
  //     fetchUser();
  //   }, [phoneNumber]),
  // );

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    prevUserRef.current = prevUser;
  }, [prevUser]);

  useFocusEffect(
    useCallback(() => {
      const db = getFirestore();
      const _userRef = doc(db, 'users', phoneNumber);

      const unsubscribe = onSnapshot(_userRef, doc => {
        if (doc.exists) {
          const data = doc.data();
          console.log('Dashboard Current User data: ', data);
          if (!data) {
            console.log('No data found');
            return;
          }
          console.log('User data: ', data);

          console.log('user', userRef.current);
          console.log('prevUser', prevUserRef.current);

          if (!userRef.current && !prevUserRef.current) {
            // 최초 사용자 정보가 없을 때, 이전 사용자 정보가 없을 때 -> 최초 사용자 정보 저장
            console.log('최초 사용자 정보 저장');
            setUser(data as User);

            return;
          }

          if (userRef.current) {
            // 이전 사용자 정보가 있을 때
            if (userRef.current.stamps !== data.stamps) {
              // 스탬프 사용 시
              setTimeLeft(3); // 3초 후 화면 종료
            }
          }

          // 여기서 이전 사용자 정보를 저장해야 하기 때문에

          // 이전 사용자 정보 저장
          console.log('이전 사용자 정보 저장');
          console.log('prevUser', userRef.current);
          setPrevUser(userRef.current);
          // 사용자 정보 업데이트
          console.log('사용자 정보 업데이트');
          console.log('user', data);
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
          console.log('Dashboard Current Session data: ', data);
          if (!data) {
            console.log('No data found');
            return;
          }
          if (data.phone === '' && data.mode === 'waiting') {
            console.log('초기화면으로 이동');
            // 전화번호 입력 UI로 변경하는 코드 실행
            navigation.navigate('NumberInput');
          }
        }
      });

      return () => unsubscribe();
    }, [storeCode]),
  ); // ✅ 의존성 배열 `[]` → 최초 1회 실행

  useFocusEffect(
    useCallback(() => {
      let timer: NodeJS.Timeout;
      let isMounted = true;

      if (timeLeft > 0) {
        timer = setInterval(() => {
          setTimeLeft(prevTime => {
            if (!isMounted) return prevTime;

            if (prevTime <= 1) {
              clearInterval(timer);
              updateSession(`session_${storeCode}`, {
                last_used: new Date().toISOString().split('T')[0],
                phone: '',
                mode: 'waiting',
              });
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
      }

      return () => {
        isMounted = false;
        clearInterval(timer);
      };
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
            {user && prevUser && user.stamps !== prevUser.stamps ? (
              <View
                style={[
                  styles.flexColumnBox,
                  {
                    height: 'auto',
                    gap: 39,
                    width: 340,
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    paddingTop: 104,
                  },
                ]}>
                <View style={styles.labelBox}>
                  <Text style={styles.labelTitleText}>
                    <Text
                      style={[
                        styles.labelTitleText,
                        {
                          color: '#FE7901',
                        },
                      ]}>
                      스탬프 {Math.abs(user.stamps - prevUser.stamps)}개
                    </Text>
                    가
                  </Text>
                  <Text style={styles.labelTitleText}>
                    {prevUser.stamps < user.stamps
                      ? '적립되었습니다.'
                      : '사용되었습니다.'}
                  </Text>
                </View>
                <View style={styles.labelBox}>
                  <Text
                    style={[
                      styles.labelTitleText,
                      {
                        color: '#FE7901',
                      },
                    ]}>
                    감사합니다
                  </Text>
                  <Text style={styles.labelSubText}>
                    <Text
                      style={[
                        styles.labelSubText,
                        {
                          fontFamily: 'Pretendard-Bold',
                        },
                      ]}>
                      {timeLeft}
                    </Text>
                    초 후 화면이 종료됩니다
                  </Text>
                </View>
              </View>
            ) : (
              <View
                style={[
                  styles.flexColumnBox,
                  {
                    height: 'auto',
                    gap: 58,
                    width: 340,
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    paddingTop: 28,
                  },
                ]}>
                <View style={[styles.flexBox, {gap: 7}]}>
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
                    뒤로가기
                  </Text>
                </View>
                <View style={styles.labelBox}>
                  <Text style={styles.labelSubText}>
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
                    {` 님 반갑습니다.`}
                  </Text>
                  <Text style={styles.labelTitleText}>
                    오늘도 좋은 하루 되세요 {'><'}
                  </Text>
                  {timeLeft < 10 && (
                    <Text>
                      <Text
                        style={[
                          styles.labelSubText,
                          {
                            width: 20,
                            fontFamily: 'Pretendard-Bold',
                          },
                        ]}>
                        {timeLeft}
                      </Text>
                      초 후 화면이 종료됩니다
                    </Text>
                  )}
                </View>
              </View>
            )}

            <View
              style={[
                {
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
                  position: 'relative',
                },
              ]}>
              <View
                style={{
                  flex: 1,
                  paddingTop: 49,
                  paddingLeft: 32,
                  paddingRight: 32,
                  paddingBottom: 28,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}>
                <View
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={[
                      styles.labelSubText,
                      {
                        color: '#424756',
                      },
                    ]}>
                    현재 보유 스탬프
                  </Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    alignItems: 'baseline',
                    gap: 18,
                  }}>
                  <Text style={styles.stampLeftText}>
                    {user ? user.stamps : 0}
                  </Text>
                  <Text style={styles.stampRightText}>/10개</Text>
                </View>
              </View>
              <View
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  borderRadius: 35,
                }}>
                {BALL_POSITIONS.slice(0, user?.stamps || 0).map(
                  (ball, index) => {
                    return (
                      <AnimatedBall key={index} index={index} ball={ball} />
                    );
                  },
                )}
              </View>
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
  backgroundStyle: {
    flex: 1,
  },
  flexBox: {
    display: 'flex',
    flexDirection: 'row',
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
    gap: 5,
  },
  subLabelBox: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  labelTitleText: {
    fontSize: 28,
    fontFamily: 'Pretendard-Semibold',
    lineHeight: 38,
  },
  labelSubText: {
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 24,
  },
  stampLeftText: {
    fontSize: 64,
    fontFamily: 'Pretendard-Semibold',
    lineHeight: 72,
    letterSpacing: -2,
    color: '#FD5F01',
  },
  stampRightText: {
    fontSize: 24,
    fontFamily: 'Pretendard-Semibold',
    lineHeight: 32,
  },
});

export default DashboardScreen;
