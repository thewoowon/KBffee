import React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useFirestore} from '../../hooks';

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
  const {enterNumber} = useFirestore();
  const handleSearch = async () => {
    await enterNumber('session_ABC123');
  };

  const handleStatistics = () => {
    navigation.navigate('Statistics');
  };

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
});

export default MainScreen;
