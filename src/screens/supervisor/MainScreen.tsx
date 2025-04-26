import React, {useCallback, useState} from 'react';
import {
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  // Modal,
} from 'react-native';
import {useAuth, useFirestore, useAnalytics} from '../../hooks';
import {doc, getFirestore, onSnapshot} from '@react-native-firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';
import {
  ExitIcon,
  LeftArrowIcon,
  ProfileIcon,
  RefreshIcon,
  ShortLeftArrowIcon,
  ShortRightArrowIcon,
} from '../../components/Icons';
import dayjs from 'dayjs';
// import {BackgroundDeco} from '../../components/background';
import DetailView from './DetailView';
import {LoadingOverlay} from '../../components/overlay';

const MainScreen = ({navigation, route}: any) => {
  const {storeCode} = useAuth();
  const {enterNumber, getLogs, getLogsAfter, getLogsByPhoneNumber} =
    useFirestore();
  const {setIsAuthenticated, initStoreCode} = useAuth();
  const {logEvent} = useAnalytics();
  const [modalVisible, setModalVisible] = useState(false);
  const [date, setDate] = useState(dayjs());
  const [logs, setLogs] = useState<Log[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastTimestamp, setLastTimestamp] = useState<Date | null>(null);
  const [selectedContext, setSelectedContext] = useState<{
    selectedLog: Log | null;
    viewMode: 'detail' | 'list';
    logList: Log[];
  }>({
    selectedLog: null,
    viewMode: 'detail',
    logList: [],
  });

  const handleLogout = async () => {
    try {
      logEvent('logout', {
        storeCode: storeCode,
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }

    setIsAuthenticated(false);
    initStoreCode('');
  };

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

  const handleDateMinusChange = (value: number) => {
    setDate(date.subtract(value, 'day'));
  };

  const handleDatePlusChange = (value: number) => {
    setDate(date.add(value, 'day'));
  };

  const handleSetToday = async () => {
    logEvent('today', {
      storeCode: storeCode,
    });
    setDate(dayjs());
  };

  const handleClickLog = async (log: Log) => {
    const logs = await getLogsByPhoneNumber(log.phone_number);
    setSelectedContext({
      selectedLog: log,
      viewMode: 'detail',
      logList: logs,
    });
  };

  const updateLogs = async () => {
    const dateString = date.format('YYYY-MM-DD');
    setIsLoading(true);
    const logs = await getLogs(dateString);
    if (logs) {
      setLogs(logs);
      setLastTimestamp(logs[0].timestamp); // 가장 최신 로그의 timestamp로 갱신
    }
    setIsLoading(false);
  };

  const updateLogsAfter = async () => {
    const dateString = date.format('YYYY-MM-DD');

    // 마지막 로그 시간 이후의 로그만 가져오기
    setIsLoading(true);
    const newLogs = await getLogsAfter(dateString, lastTimestamp || undefined);
    console.log('newLogs', newLogs);
    if (newLogs && newLogs.length > 0) {
      setLogs(prev => [...newLogs, ...prev]); // 시간순으로 정렬되어 있다면 prepend
      setLastTimestamp(newLogs[0].timestamp); // 가장 최신 로그의 timestamp로 갱신
    }
    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      const fetchLogs = async () => {
        const dateString = date.format('YYYY-MM-DD');
        setIsLoading(true);
        // 일자가 변경되었을 경우에는 100개만 끊어서 최신으로 가져오기
        const logs = await getLogs(dateString);
        if (logs) {
          setLogs(logs);
        }
        setIsLoading(false);
      };
      fetchLogs();
    }, [date]),
  );

  useFocusEffect(
    useCallback(() => {
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

          setPhoneNumber(data.phone);
          if (data.phone !== '' && data.mode === 'onboarding') {
            setModalVisible(true);
          } else {
            //
            setModalVisible(false);
          }
        }
      });

      return () => unsubscribe();
    }, [storeCode]),
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#6a51ae"
        translucent={false}
      />
      <SafeAreaView style={styles.backgroundStyle}>
        <LoadingOverlay isLoading={isLoading} />
        <View style={styles.innerContainer}>
          <View
            style={[
              styles.flexRowBox,
              {
                justifyContent: 'flex-end',
                backgroundColor: '#3D4C57',
                paddingVertical: 18,
                paddingHorizontal: 24,
              },
            ]}>
            <View style={[styles.flexRowBox, {gap: 8}]}>
              {/* <Pressable style={styles.button} onPress={handleStatistics}>
                <StatisticIcon width={24} height={24} />
                <Text style={styles.buttonText}>통계</Text>
              </Pressable>
              <Pressable style={styles.button} onPress={handleSearch}>
                <ProfileIcon width={24} height={24} />
                <Text style={styles.buttonText}>고객조회</Text>
              </Pressable> */}
              <Pressable style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>로그아웃</Text>
                <ProfileIcon width={20} height={20} />
              </Pressable>
            </View>
          </View>
          <View
            style={[
              styles.flexRowBox,
              {
                flex: 1,
              },
            ]}>
            <View
              style={[
                styles.innerContainer,
                {
                  backgroundColor: 'white',
                  paddingHorizontal: 24,
                  paddingTop: 32,
                },
              ]}>
              <View
                style={[
                  styles.flexRowBox,
                  {
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                    marginBottom: 32,
                  },
                ]}>
                <Text style={styles.titleText}>적립내역</Text>
                <View
                  style={[
                    styles.flexRowBox,
                    {
                      gap: 18,
                    },
                  ]}>
                  {date.format('YYYY-MM-DD') !==
                    dayjs().format('YYYY-MM-DD') && (
                    <Pressable
                      onPress={handleSetToday}
                      style={[
                        styles.flexRowBox,
                        {
                          backgroundColor: '#F3F3F3',
                          width: 70,
                          height: 32,
                          borderRadius: 6,
                          gap: 4,
                        },
                      ]}>
                      <RefreshIcon width={16} height={16} />
                      <Text
                        style={{
                          fontSize: 16,
                          lineHeight: 26,
                          letterSpacing: -1,
                          fontFamily: 'Pretendard-Medium',
                          color: '#595959',
                        }}>
                        오늘
                      </Text>
                    </Pressable>
                  )}
                  <View
                    style={[
                      styles.flexRowBox,
                      {
                        gap: 12,
                      },
                    ]}>
                    <Pressable onPress={() => handleDateMinusChange(1)}>
                      <ShortLeftArrowIcon width={24} height={24} />
                    </Pressable>
                    <Text
                      style={{
                        fontFamily: 'Pretendard-Medium',
                        fontSize: 16,
                        lineHeight: 26,
                        letterSpacing: -1,
                      }}>
                      {date.format('MM월 DD일')}
                    </Text>
                    <Pressable onPress={() => handleDatePlusChange(1)}>
                      <ShortRightArrowIcon width={24} height={24} />
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
                        fontFamily: 'Pretendard-Medium',
                        fontSize: 14,
                        lineHeight: 24,
                        letterSpacing: -1,
                        width: 62,
                        color: '#9F9FA6',
                      }}>
                      적립정보
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Pretendard-Medium',
                        fontSize: 14,
                        lineHeight: 24,
                        letterSpacing: -1,
                        width: 100,
                        color: '#9F9FA6',
                      }}>
                      회원정보
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Pretendard-Medium',
                        fontSize: 14,
                        lineHeight: 24,
                        letterSpacing: -1,
                        flex: 1,
                        color: '#9F9FA6',
                      }}>
                      비고
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily: 'Pretendard-Medium',
                      fontSize: 14,
                      lineHeight: 24,
                      letterSpacing: -1,
                      width: 120,
                      color: '#9F9FA6',
                    }}>
                    일시
                  </Text>
                </View>
                <ScrollView style={styles.scrollView}>
                  <View
                    style={{display: 'flex', flexDirection: 'column', gap: 16}}>
                    {logs.length > 0 ? (
                      logs.map((statistic, index) => (
                        <Pressable
                          key={index}
                          style={styles.listBox}
                          onPress={() => {
                            handleClickLog(statistic);
                          }}>
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
                                width: 62,
                                height: 32,
                                backgroundColor:
                                  statistic.action === 'stamp_saved'
                                    ? '#FFEBD7'
                                    : '#E8F1FF',
                              }}>
                              <Text
                                style={{
                                  fontSize: 14,
                                  lineHeight: 24,
                                  letterSpacing: -1,
                                  fontFamily: 'Pretendard-Medium',
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
                            <Text
                              style={{
                                width: 100,
                                color: '#1B2128',
                                fontSize: 14,
                                lineHeight: 24,
                                letterSpacing: -1,
                                fontFamily: 'Pretendard-Medium',
                              }}>
                              {
                                // 3자리 , 4자리 ,4자리
                                statistic.phone_number.replace(
                                  /(\d{3})(\d{4})(\d{4})/,
                                  '$1-$2-$3',
                                )
                              }
                            </Text>
                            <Text
                              style={{
                                color: 'black',
                                fontSize: 14,
                                lineHeight: 24,
                                letterSpacing: -1,
                                fontFamily: 'Pretendard-Light',
                              }}>
                              {statistic.note}
                            </Text>
                          </View>
                          <Text
                            style={{
                              width: 120,
                              color: '#878B8F',
                              fontSize: 14,
                              lineHeight: 24,
                              letterSpacing: -1,
                            }}>
                            {dayjs(statistic.timestamp).format(
                              'YYYY-MM-DD HH:mm',
                            )}
                          </Text>
                        </Pressable>
                      ))
                    ) : (
                      <View
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: 250,
                        }}>
                        <Text style={styles.emptyText}>
                          적립내역이 없습니다.
                        </Text>
                      </View>
                    )}
                  </View>
                </ScrollView>
              </View>
            </View>
            <View
              style={[
                styles.flexColumnBox,
                {
                  width: 536,
                  height: '100%',
                  backgroundColor: '#F6F6F6',
                  paddingHorizontal: 24,
                  paddingVertical: 32,
                },
              ]}>
              {selectedContext.selectedLog ? (
                selectedContext.viewMode === 'detail' ? (
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <View
                      style={[
                        styles.flexRowBox,
                        {
                          width: '100%',
                          justifyContent: 'space-between',
                          marginBottom: 36,
                        },
                      ]}>
                      <Text
                        style={{
                          color: '#262626',
                          fontFamily: 'Pretendard-Regular',
                          fontSize: 16,
                          lineHeight: 26,
                          letterSpacing: -1,
                        }}>
                        적립내역 상세
                      </Text>
                      <Pressable
                        onPress={() => {
                          setSelectedContext({
                            selectedLog: null,
                            viewMode: 'detail',
                            logList: [],
                          });
                        }}
                        style={[
                          styles.flexRowBox,
                          {
                            gap: 6,
                          },
                        ]}>
                        <Text>나가기</Text>
                        <ExitIcon />
                      </Pressable>
                    </View>
                    <View
                      style={[
                        styles.flexRowBox,
                        {
                          marginBottom: 24,
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          gap: 10,
                        },
                      ]}>
                      <Text
                        style={{
                          color: '#262626',
                          fontFamily: 'Pretendard-Regular',
                          fontSize: 16,
                          lineHeight: 26,
                          letterSpacing: -1,
                        }}>
                        고객 번호
                      </Text>
                      <Text
                        style={{
                          color: '#FE7901',
                          fontFamily: 'Pretendard-Medium',
                          fontSize: 24,
                          lineHeight: 32,
                          letterSpacing: -1,
                        }}>
                        {selectedContext.selectedLog.phone_number.replace(
                          /(\d{3})(\d{4})(\d{4})/,
                          '$1-$2-$3',
                        )}
                      </Text>
                    </View>
                    <View
                      style={{
                        paddingVertical: 24,
                        paddingHorizontal: 20,
                        backgroundColor: 'white',
                        borderRadius: 24,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 20,
                      }}>
                      <View
                        style={[
                          styles.flexRowBox,
                          {
                            justifyContent: 'space-between',
                          },
                        ]}>
                        <View
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 6,
                            width: 62,
                            height: 32,
                            backgroundColor:
                              selectedContext.selectedLog.action ===
                              'stamp_saved'
                                ? '#FFEBD7'
                                : '#E8F1FF',
                          }}>
                          <Text
                            style={{
                              fontSize: 14,
                              lineHeight: 24,
                              letterSpacing: -1,
                              fontFamily: 'Pretendard-Medium',
                              color:
                                selectedContext.selectedLog.action ===
                                'stamp_saved'
                                  ? '#FF8400'
                                  : '#3F8CFF',
                            }}>
                            {selectedContext.selectedLog.action ===
                            'stamp_saved'
                              ? '적립'
                              : '사용'}{' '}
                            {selectedContext.selectedLog.stamp}
                          </Text>
                        </View>
                        <Text
                          style={{
                            color: '#73777B',
                            fontFamily: 'Pretendard-Regular',
                            fontSize: 16,
                            lineHeight: 26,
                            letterSpacing: -1,
                          }}>
                          {dayjs(selectedContext.selectedLog.timestamp).format(
                            `M월 D일 HH:mm`,
                          )}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.flexRowBox,
                          {
                            justifyContent: 'space-between',
                            paddingHorizontal: 12,
                          },
                        ]}>
                        <Text
                          style={{
                            color: '#171717',
                            fontFamily: 'Pretendard-Medium',
                            fontSize: 16,
                            lineHeight: 24,
                            letterSpacing: -1,
                          }}>
                          {selectedContext.selectedLog.action === 'stamp_saved'
                            ? '스탬프 적립'
                            : selectedContext.selectedLog.note}
                        </Text>
                        <Text
                          style={{
                            color: '#171717',
                            fontFamily: 'Pretendard-Medium',
                            fontSize: 20,
                            lineHeight: 24,
                            letterSpacing: -1,
                          }}>
                          {selectedContext.selectedLog.action === 'stamp_saved'
                            ? `+${selectedContext.selectedLog.stamp}`
                            : `-${selectedContext.selectedLog.stamp}`}
                        </Text>
                      </View>
                      <Pressable
                        onPress={() => {
                          setSelectedContext({
                            ...selectedContext,
                            viewMode: 'list',
                          });
                        }}
                        style={[
                          styles.flexRowBox,
                          {
                            borderRadius: 6,
                            paddingVertical: 15,
                            backgroundColor: '#EFEFEF',
                            marginTop: 12,
                            cursor: 'pointer',
                          },
                        ]}>
                        <Text>모든내역보기</Text>
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <View
                    style={{
                      flex: 1,
                    }}>
                    <View
                      style={[
                        styles.flexRowBox,
                        {
                          width: '100%',
                          justifyContent: 'space-between',
                          marginBottom: 36,
                        },
                      ]}>
                      <Text
                        style={{
                          color: '#262626',
                          fontFamily: 'Pretendard-Regular',
                          fontSize: 16,
                          lineHeight: 26,
                          letterSpacing: -1,
                        }}>
                        적립내역 상세
                      </Text>
                      <Pressable
                        onPress={() => {
                          setSelectedContext({
                            selectedLog: null,
                            viewMode: 'detail',
                            logList: [],
                          });
                        }}
                        style={[
                          styles.flexRowBox,
                          {
                            gap: 6,
                          },
                        ]}>
                        <Text>나가기</Text>
                        <ExitIcon />
                      </Pressable>
                    </View>
                    <View
                      style={[
                        styles.flexRowBox,
                        {
                          marginBottom: 24,
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          gap: 10,
                        },
                      ]}>
                      <Text
                        style={{
                          color: '#262626',
                          fontFamily: 'Pretendard-Regular',
                          fontSize: 16,
                          lineHeight: 26,
                          letterSpacing: -1,
                        }}>
                        고객 번호
                      </Text>
                      <Text
                        style={{
                          color: '#FE7901',
                          fontFamily: 'Pretendard-Medium',
                          fontSize: 24,
                          lineHeight: 32,
                          letterSpacing: -1,
                        }}>
                        {selectedContext.selectedLog.phone_number.replace(
                          /(\d{3})(\d{4})(\d{4})/,
                          '$1-$2-$3',
                        )}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        paddingVertical: 24,
                        paddingHorizontal: 20,
                        backgroundColor: 'white',
                        borderRadius: 24,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 20,
                      }}>
                      <Pressable
                        style={[
                          styles.flexRowBox,
                          {gap: 7, justifyContent: 'flex-start'},
                        ]}
                        onPress={() => {
                          setSelectedContext({
                            ...selectedContext,
                            viewMode: 'detail',
                          });
                        }}>
                        <LeftArrowIcon />
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: 'Pretendard-Regular',
                            color: '#191D2B',
                            lineHeight: 26,
                            letterSpacing: -1,
                          }}>
                          뒤로가기
                        </Text>
                      </Pressable>
                      <ScrollView>
                        {selectedContext.logList.map((log, index) => (
                          <View key={index} style={[styles.listBox,{
                            borderBottomWidth: 1,
                            borderBottomColor: '#E5E5E5',
                            paddingVertical: 16,
                          }]}>
                            <View
                              style={[
                                styles.flexRowBox,
                                {
                                  justifyContent: 'flex-start',
                                  gap: 16,
                                  flex: 1,
                                },
                              ]}>
                              <View
                                style={{
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  borderRadius: 6,
                                  width: 62,
                                  height: 32,
                                  backgroundColor:
                                    log.action === 'stamp_saved'
                                      ? '#FFEBD7'
                                      : '#E8F1FF',
                                }}>
                                <Text
                                  style={{
                                    fontSize: 14,
                                    lineHeight: 24,
                                    letterSpacing: -1,
                                    fontFamily: 'Pretendard-Medium',
                                    color:
                                      log.action === 'stamp_saved'
                                        ? '#FF8400'
                                        : '#3F8CFF',
                                  }}>
                                  {log.action === 'stamp_saved'
                                    ? '적립'
                                    : '사용'}{' '}
                                  {log.stamp}
                                </Text>
                              </View>
                              <Text
                                style={{
                                  color: 'black',
                                  fontSize: 14,
                                  lineHeight: 24,
                                  letterSpacing: -1,
                                  fontFamily: 'Pretendard-Light',
                                }}>
                                {log.note}
                              </Text>
                            </View>
                            <Text
                              style={{
                                width: 120,
                                color: '#878B8F',
                                fontSize: 14,
                                lineHeight: 24,
                                letterSpacing: -1,
                              }}>
                              {dayjs(log.timestamp).format('YYYY-MM-DD HH:mm')}
                            </Text>
                          </View>
                        ))}
                      </ScrollView>
                    </View>
                  </View>
                )
              ) : (
                <>
                  <Text
                    style={{
                      color: '#D4D4D4',
                      fontFamily: 'Pretendard-Medium',
                      fontSize: 20,
                      lineHeight: 28,
                      letterSpacing: -1,
                    }}>
                    내역을 선택하여
                  </Text>
                  <Text
                    style={{
                      color: '#D4D4D4',
                      fontFamily: 'Pretendard-Medium',
                      fontSize: 20,
                      lineHeight: 28,
                      letterSpacing: -1,
                    }}>
                    상세 적립내역을 확인할 수 있습니다
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          presentationStyle="overFullScreen" // or "pageSheet" 등 시도
          supportedOrientations={['portrait', 'landscape']}>
          <DetailView
            navigation={navigation}
            phoneNumber={phoneNumber}
            onClose={() => {
              setModalVisible(false);
            }}
            updateLogs={updateLogs}
          />
        </Modal>
        {/* <BackgroundDeco backgroundColor="#FFFAE3" /> */}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#FFFAE3',
  },
  backgroundStyle: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
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
    gap: 6,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4.5,
    },
    shadowOpacity: 0.07,
    shadowRadius: 22,
    elevation: 6,
  },
  buttonText: {
    color: '#191D2B',
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    lineHeight: 26,
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
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -1,
  },
  emptyText: {
    color: '#93989E',
    fontFamily: 'Pretendard-Regular',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -1,
  },
});

export default MainScreen;
