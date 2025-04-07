import {Pressable, StyleSheet, Text, View} from 'react-native';

type MyCustomToastProps = {
  text1: string;
  text2?: string;
  onPress?: () => void;
  props: any;
};

const MyCustomToast = ({
  text1,
  text2,
  onPress,
  ...props
}: MyCustomToastProps) => (
  <View style={styles.customToastContainer}>
    <View>
      <Text style={styles.customSubtitleText}>
        고객번호{' '}
        {
          // 3자리 , 4자리 ,4자리
          text2?.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3') || ''
        }
      </Text>
      <Text style={styles.customTitleText}>{text1}</Text>
    </View>
    <Pressable
      onPress={onPress}
      style={styles.buttonContainer}
      android_ripple={{color: '#FFFFFF', radius: 20}}>
      <Text style={styles.buttonText}>돌아가기</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  customToastContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FE7901',
    width: '95%',
    height: 98,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  customTitleText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Pretendard-Medium',
    lineHeight: 32,
    letterSpacing: -1,
  },
  customSubtitleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Pretendard-Medium',
    lineHeight: 26,
    letterSpacing: -1,
  },
  buttonContainer: {
    backgroundColor: '#F2F2F2',
    width: 86,
    height: 32,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#4E5056',
    fontSize: 16,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 26,
    letterSpacing: -1,
  },
});

// Register the Custom Toast Component
export default MyCustomToast;
