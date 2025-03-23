import React, {useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import {useAuth, useFirestore} from '../../hooks';

const SignInScreen = ({navigation, route}: any) => {
  const mode = route.params?.mode;
  const title = mode === 'supervisor' ? '관리자 로그인' : '고객 로그인';

  const {setIsAuthenticated, setMode, initStoreCode} = useAuth();
  const {getStores} = useFirestore();

  const [storeCode, setStoreCode] = useState('');
  const handleChange = (text: string) => {
    setStoreCode(text);
  };
  const handleSignIn = async () => {
    if (storeCode === '') {
      Alert.alert('스토어 코드를 입력해주세요.');
      return;
    }

    const response = await getStores(storeCode);
    if (!response) {
      Alert.alert('존재하지 않는 스토어 코드입니다.');
      return;
    }

    setMode(mode);
    setIsAuthenticated(true);
    initStoreCode(storeCode);
  };
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#6a51ae"
        translucent={false}
      />
      <SafeAreaView style={styles.backgroundStyle}>
        <View style={styles.header}>
          {/* 상단 헤더 */}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              position: 'absolute',
              left: 16,
            }}>
            <Pressable
              onPress={() => {
                navigation.goBack();
              }}>
              <Text style={styles.goBackText}>뒤로</Text>
            </Pressable>
          </View>
          <Text style={styles.headerText}>{title}</Text>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          {/* renderContent만 ScrollView로 감싸기 */}
          <ScrollView
            contentContainerStyle={{flexGrow: 1, paddingBottom: 20}}
            keyboardShouldPersistTaps="handled">
            <View style={styles.innerContainer}>
              <View style={styles.flexBox}>
                <Text style={styles.label}>스토어 코드 입력</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={handleChange}
                  placeholder="스토어 코드를 입력해주세요"
                />
                <Pressable style={styles.confirmButton} onPress={handleSignIn}>
                  <Text style={styles.confirmButtonText}>로그인</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backgroundStyle: {
    flex: 1,
  },
  flexBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  modeContainer: {
    width: 391,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#3D7BF7',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  modeText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Pretendard-SemiBold',
  },
  header: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 11,
    paddingBottom: 11,
    maxHeight: 50,
    borderBottomWidth: 1,
    borderColor: '#F2F4F6',
  },
  headerText: {
    color: '#181818',
    fontSize: 18,
    fontFamily: 'Pretendard-SemiBold',
  },
  goBackText: {
    color: '#181818',
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
  },
  label: {
    fontSize: 28,
    color: '#181818',
    fontFamily: 'Pretendard-SemiBold',
    lineHeight: 34,
  },
  input: {
    width: 391,
    height: 60,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 20,
  },
  confirmButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 391,
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
});

export default SignInScreen;
