import React, {useCallback, useState} from 'react';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Modal,
} from 'react-native';
import {useAuth, useFirestore} from '../../hooks';
import {doc, getFirestore, onSnapshot} from '@react-native-firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';

const DetailScreen = ({navigation, route}: any) => {
  const phoneNumber = route.params?.phoneNumber;
  const {storeCode} = useAuth();
  const [timeLeft, setTimeLeft] = useState(60);
  const [modalVisible, setModalVisible] = useState(false);
  const [stamps, setStamps] = useState(0);
  const [user, setUser] = useState<User>({
    last_used: '',
    level: 0,
    stamps: 0,
  });
  const {getUser, updateUser, updateSession} = useFirestore();

  const handleInput = async () => {
    setModalVisible(true);
  };

  const handleInit = async () => {
    await updateSession(`session_${storeCode}`, {
      phone: '',
      mode: '',
    });
    navigation.navigate('Main');
  };

  const handleApprove = async () => {
    await updateUser(phoneNumber, {
      stamps: user.stamps + stamps,
    });
    setModalVisible(false);
    setStamps(0);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

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
          console.log('Current data: ', data);
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
      let timer: NodeJS.Timeout;

      if (timeLeft > 0) {
        timer = setInterval(() => {
          setTimeLeft(prevTime => {
            if (prevTime <= 1) {
              clearInterval(timer);
              updateSession(`session_${storeCode}`, {
                last_used: new Date().toISOString().split('T')[0],
                phone: '',
                mode: '',
              });
              navigation.navigate('Main');
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
        <View style={styles.innerContainer}>
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
          <View style={styles.flexRowBox}>
            <Pressable style={styles.button} onPress={handleInput}>
              <Text style={styles.buttonText}>적립하기</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={handleInit}>
              <Text style={styles.buttonText}>초기화</Text>
            </Pressable>
          </View>
        </View>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
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
        </Modal>
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
    paddingTop: 30,
    paddingBottom: 30,
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
  flexRowBox: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
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
});

export default DetailScreen;
