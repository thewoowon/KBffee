import React, {useCallback, useState} from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Modal,
} from 'react-native';
import {useAuth, useFirestore} from '../../hooks';
import {doc, getFirestore, onSnapshot} from '@react-native-firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';

const STATISTICS: {
  id: string;
  last_used: string;
  level: number;
  stamps: number;
}[] = [
  {
    id: 'user_123',
    last_used: '2021-12-31',
    level: 1,
    stamps: 10,
  },
  {
    id: 'user_456',
    last_used: '2021-12-31',
    level: 2,
    stamps: 20,
  },
  {
    id: 'user_789',
    last_used: '2021-12-31',
    level: 3,
    stamps: 30,
  },
  {
    id: 'user_101',
    last_used: '2021-12-31',
    level: 4,
    stamps: 40,
  },
  {
    id: 'user_112',
    last_used: '2021-12-31',
    level: 5,
    stamps: 50,
  },
];

const MainScreen = ({navigation, route}: any) => {
  const {storeCode} = useAuth();
  const {enterNumber, updateSession} = useFirestore();
  const [modalVisible, setModalVisible] = useState(false);
  const handleSearch = async () => {
    await enterNumber(`session_${storeCode}`);
    setModalVisible(true);
  };

  const handleStatistics = () => {
    Alert.alert('준비중', '통계 기능은 준비중입니다.');
    return;
    // navigation.navigate('Statistics');
  };

  const handleCancel = () => {
    setModalVisible(false);
    updateSession(`session_${storeCode}`, {
      mode: '',
    });
  };

  useFocusEffect(
    useCallback(() => {
      // session -> phone
      const db = getFirestore();
      const sessionRef = doc(db, 'sessions', `session_${storeCode}`);

      const unsubscribe = onSnapshot(sessionRef, doc => {
        if (doc.exists) {
          const data = doc.data();
          console.log('Current data: ', data);
          if (!data) {
            console.log('No data found');
            return;
          }

          console.log(data);
          // phone이 있으면 화면 이동
          if (data.phone !== '') {
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
          <ScrollView style={styles.scrollView}>
            {STATISTICS.map((statistic, index) => (
              <View key={index} style={styles.listBox}>
                <Text>{statistic.id}</Text>
                <Text>{statistic.last_used}</Text>
                <Text>{statistic.level}</Text>
                <Text>{statistic.stamps}</Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.flexRowBox}>
            <Pressable style={styles.button} onPress={handleSearch}>
              <Text style={styles.buttonText}>조회하기</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={handleStatistics}>
              <Text style={styles.buttonText}>통계보기</Text>
            </Pressable>
          </View>
        </View>
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>번호를 입력하는 중이에요</Text>
              <Pressable style={[styles.buttonClose]} onPress={handleCancel}>
                <Text style={styles.textStyle}>번호 입력 취소</Text>
              </Pressable>
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
  scrollView: {},
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
});

export default MainScreen;
