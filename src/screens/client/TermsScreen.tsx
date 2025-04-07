import React from 'react';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useAuth, useFirestore} from '../../hooks';

const TermsScreen = ({navigation, route}: any) => {
  const phoneNumber = route.params?.phoneNumber;
  const {storeCode} = useAuth();
  const {addUser, updateSession} = useFirestore();
  const onConfirmPress = async () => {
    await addUser(phoneNumber);
    await updateSession(`session_${storeCode}`, {
      last_used: new Date().toISOString().split('T')[0],
      phone: phoneNumber,
      mode: 'onboarding',
    });
    navigation.navigate('Dashboard', {phoneNumber});
  };
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#6a51ae"
        translucent={false}
      />
      <SafeAreaView style={styles.backgroundStyle}>
        <View style={styles.wrapper}>
          <View style={styles.titleContainer}>
            <Text style={styles.bigTitle}>큽피를 시작하기 전</Text>
            <Text style={styles.bigTitle}>약관에 동의해주세요</Text>
          </View>
          <View style={styles.termsContainer}>
            <View style={styles.templateContainer}>
              <Text style={styles.templateText}>
                큽피는 「개인정보보호법」에 의거하여, 아래와 같은 내용으로
                개인정보를 수집하고 있습니다. 아래 내용을 자세히 읽어 보시고,
                모든 내용을 이해하신 후에 동의 여부를 결정해 주시기 바랍니다.
              </Text>
            </View>
            <Text>개인정보의 수집. 및 이용 동의서</Text>
            <Text style={styles.termsLightSubtitle}>
              - 이용자가 제공한 모든 정보는 다음의 목적을 위해 활용하며, 하기
              목적 이외의 용도로는 사용되지 않습니다.
            </Text>
            <Text style={styles.termsSubtitle}>
              ① 개인정보 수집 항목 및 수집·이용 목적
            </Text>
            <Text style={styles.termsBasicText}>가) 수집 항목 (필수항목)</Text>
            <Text style={styles.termsSmallText}>- 전화번호(휴대전화)</Text>
            <Text style={styles.termsBasicText}>나) 수집 및 이용 목적</Text>
            <Text style={styles.termsSmallText}>- 서비스 제공 및 운영</Text>
            <Text style={styles.termsSmallText}>- 사용자 본인 확인</Text>
            <Text style={styles.termsSubtitle}>
              ② 개인정보 보유 및 이용 기간
            </Text>
            <Text style={styles.termsSmallText}>
              - 수집·이용 동의일로부터 개인정보의 수집·이용 목적을 달성할 때까지
            </Text>
            <Text style={styles.termsSubtitle}>③ 동의거부관리</Text>
            <Text style={styles.termsSmallText}>
              - 귀하께서는 본 안내에 따른 개인정보 수집, 이용에 대하여 동의를
              거부하실 권리가 있습니다. 다만, 귀하가 개인정보의 수집·이용에
              동의를 거부하시는 경우에 서비스 이용 과정에 있어 불이익이 발생할
              수 있음을 알려드립니다.
            </Text>
          </View>
          <View style={styles.headerNumberContainer}>
            <Pressable style={styles.confirmButton} onPress={onConfirmPress}>
              <Text style={styles.numberInputText}>동의하고 시작하기</Text>
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
  wrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingLeft: 20,
    paddingRight: 20,
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
  termsContainer: {
    flex: 1,
    marginTop: 20,
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
  numberInputText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Pretendard-Regular',
  },
  headerNumberContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    height: 100,
  },
  confirmButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 40,
    backgroundColor: 'black',
    borderRadius: 5,
  },
  bigTitle: {
    fontSize: 24,
    fontFamily: 'Pretendard-SemiBold',
  },
  titleContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 60,
  },
});

export default TermsScreen;
