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
import {useAuth, useFirestore, useAnalytics} from '../../hooks';
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
  LeftArrowIcon,
  NewXIcon,
  RefreshIcon,
} from '../../components/Icons';
import LinearGradient from 'react-native-linear-gradient';
import {confirm} from '../../utils/alert';

const NUMBER_SEQUENCE = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const DetailView = ({
  navigation,
  phoneNumber,
  updateLogs,
}: {
  navigation: any;
  phoneNumber: string;
  onClose: () => void;
  updateLogs: () => void;
}) => {
  const {storeCode} = useAuth();
  const {logEvent} = useAnalytics();
  // const [timeLeft, setTimeLeft] = useState(1000);
  const [number, setNumber] = useState('');
  const [user, setUser] = useState<User>({
    last_used: '',
    level: 0,
    stamps: 0,
    phase: 'americano',
    americanoCoupons: 0,
    beverageCoupons: 0,
    hasRated: false,
  });

  const [userContext, setUserContext] = useState<UserContext>({
    selectedCoupon: {
      americano: 0,
      beverage: 0,
    },
    possibleCoupons: {
      americano: 0,
      beverage: 0,
    },
  });

  const {updateUser, updateSession, addLog} = useFirestore();

  const handleApprove = async () => {
    try {
      logEvent('stamp_saved', {
        phone_number: phoneNumber,
      });
    } catch (error) {
      console.log('Error logging stamp saved event:', error);
    }
    console.log('handleApprove', phoneNumber, number);
    if (number.length === 0) {
      Alert.alert('적립할 스탬프를 입력해주세요', '다시 입력해주세요.');
      return;
    }

    const numberValue = parseInt(number, 10);

    if (numberValue < 1) {
      Alert.alert(
        '적립할 스탬프를 1개 이상 입력해주세요',
        '다시 입력해주세요.',
      );
      return;
    }

    if (numberValue > 100) {
      Alert.alert(
        '적립하는 쿠폰의 수가 많은 것 같아요',
        '한 번 더 확인해주세요.',
      );
      return;
    }

    const currentQuotient = Math.floor(user.stamps / 10);
    const totalQuotient = Math.floor((user.stamps + numberValue) / 10);
    const difference = totalQuotient - currentQuotient;

    let level = user.level;
    let phase = user.phase;
    let americanoCoupons = user.americanoCoupons;
    let beverageCoupons = user.beverageCoupons;

    for (let index = 0; index < difference; index++) {
      if (phase === 'americano') {
        americanoCoupons += 1;
        phase = 'beverage';
        level += 1;
      } else {
        beverageCoupons += 1;
        phase = 'americano';
      }
    }

    const updateContext = {
      stamps: user.stamps + numberValue,
      phase,
      americanoCoupons,
      beverageCoupons,
      level,
    };

    await updateUser(phoneNumber, updateContext);

    addLog({
      action: 'stamp_saved',
      phone_number: phoneNumber,
      stamp: numberValue,
      timestamp: Timestamp.now(),
      note: '',
    });

    setNumber('');

    // Toast.show({
    //   type: 'custom_type',
    //   text1: `스탬프 ${numberValue}개 적립되었습니다`,
    //   text2: phoneNumber,
    //   visibilityTime: 5000,
    //   onPress: () => {
    //     Toast.hide();
    //   },
    // });

    // await updateSession(`session_${storeCode}`, {
    //   last_used: new Date().toISOString().split('T')[0],
    //   phone: '',
    //   mode: 'waiting',
    // });

    updateLogs();
  };

  const handleUsing = async () => {
    try {
      logEvent('stamp_used', {
        phone_number: phoneNumber,
      });
    } catch (error) {
      console.log('Error logging stamp used event:', error);
    }
    console.log('handleUsing', phoneNumber, number);
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

    // phase는
    await updateUser(phoneNumber, {
      stamps: user.stamps - numberValue,
      americanoCoupons:
        userContext.possibleCoupons.americano -
        userContext.selectedCoupon.americano,
      beverageCoupons:
        userContext.possibleCoupons.beverage -
        userContext.selectedCoupon.beverage,
    });

    let noteString = '';

    // 사용은 무조건 쿠폰뿐이므로

    if (userContext.selectedCoupon.americano > 0) {
      noteString += `아메리카노 ${userContext.selectedCoupon.americano}잔 `;
    }

    if (userContext.selectedCoupon.beverage > 0) {
      noteString += `조제음료 ${userContext.selectedCoupon.beverage}잔 `;
    }

    // 사용한 쿠폰의 개수를 초기화 한다.

    addLog({
      action: 'stamp_used',
      phone_number: phoneNumber,
      stamp: numberValue,
      timestamp: Timestamp.now(),
      note: noteString,
    });

    setNumber('');

    // Toast.show({
    //   type: 'custom_type',
    //   text1: `스탬프 ${numberValue}개 사용되었습니다 - ${noteString}`,
    //   text2: phoneNumber,
    //   visibilityTime: 5000,
    //   onPress: () => {
    //     Toast.hide();
    //   },
    // });

    // await updateSession(`session_${storeCode}`, {
    //   last_used: new Date().toISOString().split('T')[0],
    //   phone: '',
    //   mode: 'waiting',
    // });

    updateLogs();
  };

  const refresh = async () => {
    try {
      logEvent('stamp_reset', {
        phone_number: phoneNumber,
      });
    } catch (error) {
      console.log('Error logging stamp reset event:', error);
    }
    console.log('refresh', phoneNumber);
    const result = await confirm('쿠폰 입력 확인', '쿠폰을 초기화하시겠어요?');
    if (!result) {
      return;
    }

    setNumber('');
    setUserContext({
      possibleCoupons: {
        americano: user.americanoCoupons,
        beverage: user.beverageCoupons,
      },
      selectedCoupon: {
        americano: 0,
        beverage: 0,
      },
    });
  };

  const onNumberPress = async (value: number | string) => {
    // 선택된 쿠폰이 있다면 초기화 한다.

    if (
      userContext.selectedCoupon.americano > 0 ||
      userContext.selectedCoupon.beverage > 0
    ) {
      const result = await confirm(
        '쿠폰 입력 확인',
        '쿠폰이 선택되어 있어요, 초기화하시겠어요?',
      );
      if (!result) {
        return;
      }
      setUserContext({
        possibleCoupons: {
          americano: user.americanoCoupons,
          beverage: user.beverageCoupons,
        },
        selectedCoupon: {
          americano: 0,
          beverage: 0,
        },
      });

      setNumber('');
      return;
    }

    if (typeof value === 'number') {
      if (number.length > 3) {
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
        if (number.length > 3) {
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

  const close = async () => {
    try {
      logEvent('session_end', {
        phone_number: phoneNumber,
      });
    } catch (error) {
      console.log('Error logging session close event:', error);
    }
    console.log('close', phoneNumber);
    await updateSession(`session_${storeCode}`, {
      last_used: new Date().toISOString().split('T')[0],
      phone: '',
      mode: 'waiting',
    });

    // updateLogs();
  };

  // 무조건 10개씩 사용
  const onClickCoupon = (type: 'americano' | 'beverage') => () => {
    if (type === 'americano') {
      // 사용 가능하기 때문에 함수가 동작
      // 총사용하는 쿠폰의 개수를 확인
      const americanoStamp = (userContext.selectedCoupon.americano + 1) * 10;
      const beverageStamp = userContext.selectedCoupon.beverage * 10;
      setNumber(americanoStamp + beverageStamp + '');
      setUserContext({
        ...userContext,
        selectedCoupon: {
          ...userContext.selectedCoupon,
          americano: userContext.selectedCoupon.americano + 1,
        },
      });
    } else {
      // 총사용하는 쿠폰의 개수를 확인
      const americanoStamp = userContext.selectedCoupon.americano * 10;
      const beverageStamp = (userContext.selectedCoupon.beverage + 1) * 10;
      setNumber(americanoStamp + beverageStamp + '');
      setUserContext({
        ...userContext,
        selectedCoupon: {
          ...userContext.selectedCoupon,
          beverage: userContext.selectedCoupon.beverage + 1,
        },
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!phoneNumber) {
        return;
      }
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
          const userProfile = {...data} as User;
          setUser(userProfile);
          const newUserContext: UserContext = {
            selectedCoupon: {
              americano: 0,
              beverage: 0,
            },
            possibleCoupons: {
              americano: userProfile.americanoCoupons,
              beverage: userProfile.beverageCoupons,
            },
          };
          setUserContext(newUserContext);
        }
      });

      return () => unsubscribe();
    }, [phoneNumber]),
  );

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
            <Pressable
              onPress={close}
              style={[
                styles.flexBox,
                {gap: 6, position: 'absolute', top: 32, right: 32},
              ]}>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: 'Pretendard-Regular',
                  color: '#4E5056',
                  lineHeight: 28,
                }}>
                닫기
              </Text>
              <NewXIcon width={20} height={20} />
            </Pressable>
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
                        fontFamily: 'SFUIDisplay-Semibold',
                      },
                    ]}>
                    {phoneNumberLabel()}
                  </Text>
                </Text>
                <View style={styles.labelBox}>
                  <Text style={styles.labelTitleText}>사용 또는 적립할</Text>
                  <Text style={styles.labelTitleText}>
                    스탬프 개수를 입력해주세요
                  </Text>
                </View>
                <View style={styles.beverageWrapper}>
                  {userContext.possibleCoupons.beverage -
                    userContext.selectedCoupon.beverage >
                    0 && (
                    <View style={styles.beverageBox}>
                      <View>
                        <Text style={styles.beverageTitleText}>
                          조제음료{' '}
                          {userContext.possibleCoupons.beverage -
                            userContext.selectedCoupon.beverage}
                          잔
                        </Text>
                        <Text style={styles.beverageBodyText}>
                          무료 사용가능
                        </Text>
                      </View>
                      <Pressable onPress={onClickCoupon('beverage')}>
                        <Text style={styles.beverageButtonText}>10개 입력</Text>
                      </Pressable>
                      {userContext.possibleCoupons.beverage -
                        userContext.selectedCoupon.beverage >
                        1 && (
                        <View style={[styles.countBadge]}>
                          <LinearGradient
                            colors={['#FE8300', '#FC4A00']}
                            locations={[0.4, 1]}
                            start={{x: 0, y: 1}}
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
                              // 깜빡이 효과
                            }}>
                            <Text style={styles.badgeText}>
                              {userContext.possibleCoupons.beverage -
                                userContext.selectedCoupon.beverage}
                            </Text>
                          </LinearGradient>
                        </View>
                      )}
                    </View>
                  )}
                  {userContext.possibleCoupons.americano -
                    userContext.selectedCoupon.americano >
                    0 && (
                    <View style={styles.beverageBox}>
                      <View>
                        <Text style={styles.beverageTitleText}>
                          아메리카노{' '}
                          {userContext.possibleCoupons.americano -
                            userContext.selectedCoupon.americano}
                          잔
                        </Text>
                        <Text style={styles.beverageBodyText}>
                          무료 사용가능
                        </Text>
                      </View>
                      <Pressable onPress={onClickCoupon('americano')}>
                        <Text style={styles.beverageButtonText}>10개 입력</Text>
                      </Pressable>
                      {userContext.possibleCoupons.americano -
                        userContext.selectedCoupon.americano >
                        1 && (
                        <View style={styles.countBadge}>
                          <LinearGradient
                            colors={['#FE8300', '#FC4A00']}
                            locations={[0.4, 1]}
                            start={{x: 0, y: 1}}
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
                            <Text style={styles.badgeText}>
                              {userContext.possibleCoupons.americano -
                                userContext.selectedCoupon.americano}
                            </Text>
                          </LinearGradient>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </View>
              <View
                style={[
                  styles.flexColumnBox,
                  {
                    paddingLeft: 15,
                    paddingRight: 15,
                    borderRadius: 35,
                    width: 420,
                    height: 'auto',
                    backgroundColor: '#ffffff',
                  },
                ]}>
                <View
                  style={[
                    styles.flexColumnBox,
                    {
                      width: 320,
                      height: 'auto',
                    },
                  ]}>
                  <View
                    style={[
                      styles.subLabelBox,
                      {
                        width: '100%',
                        gap: 120,
                        marginBottom: 9,
                        justifyContent: 'flex-end',
                        paddingRight: 9,
                      },
                    ]}>
                    <Text
                      style={{
                        fontFamily: 'Prentendard-Semibold',
                        color: '#4E5056',
                        fontSize: 16,
                        lineHeight: 26,
                        letterSpacing: -0.2,
                      }}>
                      현재 보유 스탬프
                    </Text>
                    <Text
                      style={{
                        fontSize: 24,
                        lineHeight: 32,
                        fontFamily: 'Prentendard-Semibold',
                        color: '#FE7901',
                      }}>
                      {user.stamps}개
                    </Text>
                  </View>
                  <View
                    style={[
                      {
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        gap: 10,
                        marginBottom: 20,
                        paddingLeft: 9,
                        paddingRight: 9,
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
                          style={{
                            color: '#FF8400',
                          }}>
                          {userContext.selectedCoupon.americano > 0 &&
                            '아메리카노 ' +
                              userContext.selectedCoupon.americano +
                              '잔'}
                          {userContext.selectedCoupon.americano > 0 &&
                            userContext.selectedCoupon.beverage > 0 &&
                            ', '}
                          {userContext.selectedCoupon.beverage > 0 &&
                            '조제음료 ' +
                              userContext.selectedCoupon.beverage +
                              '잔'}
                        </Text>
                        <Text
                          style={[
                            styles.headerNumberText,
                            {
                              fontSize: 38,
                              lineHeight: 48,
                              color: number.length > 0 ? '#191D2B' : '#E3E3E3',
                            },
                          ]}>
                          {number || '00'}
                        </Text>
                        <Text
                          style={[
                            styles.headerNumberText,
                            {
                              fontFamily: 'Pretendard-Semibold',
                            },
                          ]}>
                          개
                        </Text>
                      </View>
                    </View>
                    <View style={styles.divisor}></View>
                  </View>
                  <View
                    style={[
                      {
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        gap: 12,
                      },
                    ]}>
                    {NUMBER_SEQUENCE.map((row, rowIndex) => (
                      <View key={rowIndex} style={styles.numberInputContainer}>
                        {row.map((number, numberIndex) => (
                          <Pressable
                            key={numberIndex}
                            style={({pressed}) => [
                              {
                                backgroundColor: pressed ? '#EEEEEE' : '#fff',
                                borderRadius: 10,
                              },
                              // 또는 추가 스타일이 있으면 아래처럼
                              styles.numberInputButton,
                            ]}
                            onPress={() => onNumberPress(number)}>
                            <Text style={styles.numberInputText}>{number}</Text>
                          </Pressable>
                        ))}
                      </View>
                    ))}
                    <View style={styles.numberInputContainer}>
                      <Pressable style={styles.numberInputButton}></Pressable>
                      <Pressable
                        style={({pressed}) => [
                          {
                            backgroundColor: pressed ? '#EEEEEE' : '#fff',
                            borderRadius: 10,
                          },
                          // 또는 추가 스타일이 있으면 아래처럼
                          styles.numberInputButton,
                        ]}
                        onPress={() => onNumberPress(0)}>
                        <Text style={styles.numberInputText}>0</Text>
                      </Pressable>
                      <Pressable
                        style={({pressed}) => [
                          {
                            backgroundColor: pressed ? '#EEEEEE' : '#fff',
                            borderRadius: 10,
                          },
                          // 또는 추가 스타일이 있으면 아래처럼
                          styles.numberInputButton,
                        ]}
                        onPress={() => onNumberPress('c')}>
                        <LeftArrowIcon />
                      </Pressable>
                    </View>
                  </View>
                  <View style={styles.confirmContainer}>
                    {userContext.selectedCoupon.americano > 0 ||
                    userContext.selectedCoupon.beverage > 0 ? (
                      <>
                        <Pressable
                          style={({pressed}) => [
                            styles.confirmButton,
                            {
                              width: pressed ? 142 : 150,
                              backgroundColor: '#EDEDED',
                              shadowColor: '#EDEDED',
                              gap: 6,
                            },
                          ]}
                          onPress={refresh}>
                          <RefreshIcon />
                          <Text
                            style={[
                              styles.confirmButtonText,
                              {
                                color: '#373737',
                              },
                            ]}>
                            입력 초기화
                          </Text>
                        </Pressable>
                        <Pressable
                          style={({pressed}) => [
                            styles.confirmButton,
                            {
                              width: pressed ? 142 : 150,
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
                            <Text style={styles.confirmButtonText}>
                              사용하기
                            </Text>
                          </LinearGradient>
                        </Pressable>
                      </>
                    ) : (
                      <Pressable
                        style={({pressed}) => [
                          styles.confirmButton,
                          {
                            width: pressed ? '98%' : '100%',
                            backgroundColor: '#FE6A00',
                            shadowColor: '#FE6A00',
                          },
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
                    )}
                  </View>

                  <View
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      marginTop: 8,
                      height: 26,
                    }}>
                    {userContext.selectedCoupon.americano > 0 ||
                    userContext.selectedCoupon.beverage > 0 ? (
                      <Text style={styles.beverageBodyText}>
                        사용 후 잔여 스탬프:{' '}
                        {user.stamps -
                          userContext.selectedCoupon.beverage * 10 -
                          userContext.selectedCoupon.americano * 10}
                        개
                      </Text>
                    ) : (
                      <Text style={styles.beverageBodyText}>
                        적립 후 잔여 스탬프:{' '}
                        {user.stamps + parseInt(number, 10) || 0}개
                      </Text>
                    )}
                  </View>
                </View>
              </View>
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
    fontSize: 32,
    fontFamily: 'Pretendard-Medium',
    lineHeight: 45,
    letterSpacing: -0.2,
  },
  labelSubText: {
    fontSize: 20,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 28,
    letterSpacing: -0.1,
  },
  numberInputContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
  },
  numberInputButton: {
    display: 'flex',
    width: 84,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberInputText: {
    fontSize: 38,
    color: '#4B4D55',
    fontFamily: 'SFUIDisplay-Semibold',
  },
  headerNumberContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
  },
  headerNumberText: {
    fontSize: 32,
    color: '#191D2B',
    fontFamily: 'SFUIDisplay-Semibold',
    lineHeight: 45,
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
    marginTop: 30,
    gap: 20,
  },
  confirmButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 72,
    backgroundColor: '#FE8300',
    borderRadius: 24,
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
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.1,
    color: 'white',
    fontFamily: 'Pretendard-Regular',
  },
  flexBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  beverageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 40,
  },
  beverageBox: {
    width: 340,
    backgroundColor: '#F5F5F5',
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
    color: '#3A3A3A',
    letterSpacing: -0.1,
  },
  beverageBodyText: {
    fontSize: 16,
    lineHeight: 26,
    fontFamily: 'Pretendard-Regular',
    color: '#3A3A3A',
    letterSpacing: -0.2,
  },
  beverageButtonText: {
    fontSize: 16,
    lineHeight: 26,
    fontFamily: 'Pretendard-Medium',
    color: '#3A3A3A',
    letterSpacing: -0.2,
    textDecorationLine: 'underline',
  },
  countBadge: {
    position: 'absolute',
    right: -8,
    top: -10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 28,
    height: 28,
    padding: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    shadowColor: '#FE6D00',
    shadowOffset: {
      width: 0,
      height: 4.5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  },
  badgeText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.1,
    fontFamily: 'SFUIDisplay-Semibold',
  },
});

export default DetailView;
