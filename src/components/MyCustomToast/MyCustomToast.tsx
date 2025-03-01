import {StyleSheet, Text, View} from 'react-native';

type MyCustomToastProps = {
  text1: string;
  props: any;
};

const MyCustomToast = ({text1, props}: MyCustomToastProps) => (
  <View style={styles.customToastContainer}>
    <Text style={styles.customText}>{text1}</Text>
  </View>
);

const styles = StyleSheet.create({
  customToastContainer: {
    backgroundColor: 'rgba(31, 31, 31, 0.4)',
    paddingTop: 12,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 14,
    borderRadius: 7,
    marginLeft: 20,
    marginRight: 20,
  },
  customText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Pretendard-Regular',
    lineHeight: 20,
  },
});

// Register the Custom Toast Component
export default MyCustomToast;
