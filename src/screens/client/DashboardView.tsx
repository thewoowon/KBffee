import React, {useEffect, useRef, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useAuth, useFirestore, useAnalytics} from '../../hooks';
import {getFirestore, doc, onSnapshot} from '@react-native-firebase/firestore';
import {
  AmericanoIcon,
  BeverageIcon,
  LeftArrowIcon,
} from '../../components/Icons';
import {AnimatedBall} from '../../components/decorations';
import {
  AmericanoCouponOverlay,
  AmericanoOneOverlay,
  AmericanoTwoOverlay,
  BeverageCouponOverlay,
  BeverageOneOverlay,
  BeverageTwoOverlay,
} from '../../components/overlay';
// import {BackgroundDeco} from '../../components/background';

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
    position: {bottom: -11, left: -55},
    color: '#FF515D',
    size: 171,
    zIndex: 1,
  }, // 1
  {position: {bottom: -128, left: 45}, color: '#86AEFE', size: 171, zIndex: 6}, // 2
  {position: {bottom: -42, left: 177}, color: '#9165DD', size: 171, zIndex: 5}, // 3
  {position: {bottom: -59, right: 78}, color: '#FFAE62', size: 171, zIndex: 3}, // 4
  {position: {bottom: -34, right: -36}, color: '#5DB0EB', size: 171, zIndex: 4}, // 5

  {position: {bottom: 98, left: -48}, color: '#67B265', size: 171, zIndex: 6}, // 6
  {position: {bottom: 13, left: 67}, color: '#FFB2F6', size: 171, zIndex: 13}, // 7
  {position: {bottom: 70, left: 210}, color: '#FFF0A8', size: 171, zIndex: 2}, // 8
  {position: {bottom: 78, right: 36}, color: '#67B265', size: 171, zIndex: 7}, // 9

  {position: {bottom: 191, left: -42}, color: '#FFF0A8', size: 171, zIndex: 4}, // 10
  {position: {bottom: 160, left: 103}, color: '#5DB0EB', size: 171, zIndex: 5}, // 11
  {position: {bottom: 192, right: 62}, color: '#86AEFE', size: 171, zIndex: 1}, // 12
  {position: {bottom: 160, right: -57}, color: '#FF515D', size: 171, zIndex: 6}, // 13
  {
    position: {bottom: 287, left: -53},
    color: '#5DB0EB',
    size: 171,
    zIndex: 3,
  }, // 14
  {position: {bottom: 262, left: 61}, color: '#FFAE62', size: 171, zIndex: 2}, // 15
  {position: {bottom: 279, left: 167}, color: '#9165DD', size: 171, zIndex: 3}, // 16
  {position: {bottom: 334, left: 278}, color: '#FFB2F6', size: 171, zIndex: 13}, // 17
  {position: {bottom: 300, right: -38}, color: '#9165DD', size: 171, zIndex: 5}, // 18

  {position: {top: 144, left: -5}, color: '#FF515D', size: 171, zIndex: 5}, // 19
  {position: {top: 172, left: 135}, color: '#FFF0A8', size: 171, zIndex: 1}, // 20
  {position: {top: 204, right: -31}, color: '#67B265', size: 171, zIndex: 5}, // 20
];

type DashboardViewProps = {
  phoneNumber: string;
  onClose: () => void;
};

const DashboardView = ({phoneNumber, onClose}: DashboardViewProps) => {
  const {storeCode} = useAuth();
  const [timeLeft, setTimeLeft] = useState(60);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [prevUser, setPrevUser] = useState<User | null>(null);
  const [dStampOverlayContext, setDStampOverlayContext] = useState({
    show: false,
    type: 'americano' as 'americano' | 'beverage',
    dStamp: 'one' as 'one' | 'two' | 'coupon',
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const userRef = useRef<User | null>(null);
  const prevUserRef = useRef<User | null>(null);

  const {updateSession} = useFirestore();
  const {logEvent} = useAnalytics();

  const phoneNumberLabel = () => {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(
      3,
      7,
    )}-${phoneNumber.slice(7)}`;
  };

  const goBack = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setTimeLeft(0);
  };

  const showOverlay = (overlayContext: {
    show: boolean;
    type: 'americano' | 'beverage';
    dStamp: 'one' | 'two' | 'coupon';
  }) => {
    const {show, type, dStamp} = overlayContext;

    if (type === 'americano') {
      if (dStamp === 'one') {
        return <AmericanoOneOverlay show={show} />;
      } else if (dStamp === 'two') {
        return <AmericanoTwoOverlay show={show} />;
      } else if (dStamp === 'coupon') {
        return <AmericanoCouponOverlay show={show} />;
      }
    } else if (type === 'beverage') {
      if (dStamp === 'one') {
        return <BeverageOneOverlay show={show} />;
      } else if (dStamp === 'two') {
        return <BeverageTwoOverlay show={show} />;
      } else if (dStamp === 'coupon') {
        return <BeverageCouponOverlay show={show} />;
      }
    }

    return null;
  };

  const delayBeforeUpdate = (
    type: 'americano' | 'beverage',
    dStamp: 'one' | 'two' | 'coupon',
  ) => {
    console.log('타이머 시작');
    async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
    };
    console.log('타이머 종료');
    setDStampOverlayContext({
      show: true,
      type,
      dStamp,
    });
  };

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    prevUserRef.current = prevUser;
  }, [prevUser]);

  useEffect(() => {
    if (!phoneNumber) return;

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

        if (!userRef.current && !prevUserRef.current) {
          console.log('최초 사용자 정보 저장');
          setUser(data as User);
          return;
        }

        // if (userRef.current && userRef.current.stamps !== data.stamps) {
        //   setTimeLeft(3); // 스탬프 변경 감지 → 타이머 조정
        // }
        const updatedUser = data as User;

        setPrevUser(userRef.current);
        setUser(data as User);
        // 여기서 변화 감지

        console.log('updatedUser', updatedUser);
        console.log('userRef.current: ', userRef.current);
        // 스탬프 증가
        if (updatedUser.stamps > (userRef.current?.stamps || 0)) {
          // updatedUser.stamps를 10으로 나눈 나머지
          console.log('스탬프 증가 감지');
          const remainder = updatedUser.stamps % 10;
          if (remainder === 9) {
            delayBeforeUpdate(updatedUser.phase, 'one');
          } else if (remainder === 8) {
            delayBeforeUpdate(updatedUser.phase, 'two');
          } else if (remainder === 0) {
            delayBeforeUpdate(updatedUser.phase, 'coupon');
          }
        }
      }
    });

    return () => {
      unsubscribe(); // 🧹 화면 unmount 시 깔끔하게 정리
    };
  }, [phoneNumber]);

  useEffect(() => {
    if (!storeCode) return;

    const db = getFirestore();
    const sessionRef = doc(db, 'sessions', `session_${storeCode}`);

    const unsubscribe = onSnapshot(sessionRef, doc => {
      console.log("'세션 리스너 작동 중...'");
      if (doc.exists) {
        const data = doc.data();
        console.log('Dashboard Current Session data: ', data);
        if (!data) {
          console.log('No data found');
          return;
        }

        if (data.phone === '' && data.mode === 'waiting') {
          setTimeLeft(3);
        }

        setSession(data as Session);
      }
    });

    return () => {
      unsubscribe(); // 🧹 리스너 정리
    };
  }, [storeCode]);

  useEffect(() => {
    if (timeLeft === 0) {
      if (session && session.phone !== '') {
        console.log('timer 세션 종료');
        try {
          logEvent('session_end', {
            store_code: storeCode,
            phone_number: session.phone,
          });
        } catch (error) {
          console.log('Analytics error: ', error);
        }
        updateSession(`session_${storeCode}`, {
          last_used: new Date().toISOString().split('T')[0],
          phone: '',
          mode: 'waiting',
        });
      }

      onClose();
    }
  }, [timeLeft, session, storeCode]);

  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timeLeft]);

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
              {gap: 60},
            ]}>
            {user && prevUser && user.stamps !== prevUser.stamps ? (
              <View
                style={[
                  styles.flexColumnBox,
                  {
                    height: '100%',
                    gap: 39,
                    width: 340,
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    paddingTop: 134,
                    paddingBottom: 134,
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
                          width: 24,
                          fontFamily: 'Pretendard-SemiBold',
                        },
                      ]}>
                      {timeLeft}
                    </Text>{' '}
                    초 후 화면이 종료됩니다
                  </Text>
                </View>
              </View>
            ) : (
              <View
                style={[
                  styles.flexColumnBox,
                  {
                    height: '100%',
                    gap: 58,
                    width: 340,
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    paddingTop: 134,
                    paddingBottom: 134,
                  },
                ]}>
                <Pressable style={[styles.flexBox, {gap: 7}]} onPress={goBack}>
                  <LeftArrowIcon />
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: 'Pretendard-Regular',
                      color: '#191D2B',
                      lineHeight: 28,
                      letterSpacing: -1,
                    }}>
                    뒤로가기
                  </Text>
                </Pressable>
                <View style={styles.labelBox}>
                  <Text style={styles.labelSubText}>
                    <Text
                      style={[
                        styles.labelSubText,
                        {
                          color: '#FE7901',
                          fontFamily: 'SFUIDisplay-Semibold',
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
                            width: 24,
                            fontFamily: 'Pretendard-SemiBold',
                          },
                        ]}>
                        {timeLeft}
                      </Text>{' '}
                      초 후 화면이 종료됩니다
                    </Text>
                  )}
                </View>
                <View style={styles.beverageWrapper}>
                  {user && user.beverageCoupons > 0 && (
                    <View style={styles.beverageBox}>
                      <View>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 4,
                            alignItems: 'center',
                          }}>
                          <BeverageIcon color="#FF8400" />
                          <Text style={styles.beverageTitleText}>
                            조제음료 {user.beverageCoupons}잔 무료로 사용
                            가능해요!
                          </Text>
                        </View>
                        <Text style={styles.beverageBodyText}>
                          스탬프 10개 소진
                        </Text>
                      </View>
                    </View>
                  )}
                  {user && user.americanoCoupons > 0 && (
                    <View style={styles.beverageBox}>
                      <View>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: 4,
                            alignItems: 'center',
                          }}>
                          <AmericanoIcon color="#FF8400" />
                          <Text style={styles.beverageTitleText}>
                            아메리카노 {user.americanoCoupons}잔 무료로 사용
                            가능해요!
                          </Text>
                        </View>
                        <Text style={styles.beverageBodyText}>
                          스탬프 10개 소진
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            )}
            <View
              style={[
                styles.flexColumnBox,
                {
                  justifyContent: 'flex-end',
                  height: '100%',
                },
              ]}>
              <View
                style={[
                  styles.flexColumnBox,
                  {
                    borderTopLeftRadius: 32,
                    borderTopRightRadius: 32,
                    width: 533,
                    height: 734,
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
                    paddingTop: 59,
                    paddingLeft: 37,
                    paddingRight: 37,
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
                      zIndex: 100,
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
        </View>
        {/* <BackgroundDeco /> */}
      </SafeAreaView>
      {showOverlay(dStampOverlayContext)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
    fontSize: 32,
    fontFamily: 'Pretendard-Medium',
    lineHeight: 45,
    letterSpacing: -1,
  },
  labelSubText: {
    fontSize: 20,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 28,
    letterSpacing: -1,
  },
  stampLeftText: {
    fontSize: 76,
    fontFamily: 'Pretendard-Medium',
    lineHeight: 86,
    letterSpacing: -1,
    color: '#FF8400',
  },
  stampRightText: {
    fontSize: 28,
    fontFamily: 'Pretendard-Medium',
    lineHeight: 38,
    letterSpacing: -1,
  },
  beverageWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 40,
  },
  beverageBox: {
    width: '100%',
    height: 98,
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  beverageTitleText: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: 'Pretendard-Medium',
    color: '#1E1E1E',
    letterSpacing: -1,
  },
  beverageBodyText: {
    fontSize: 16,
    lineHeight: 26,
    fontFamily: 'Pretendard-Regular',
    color: '#838383',
    letterSpacing: -1,
  },
});

export default DashboardView;
