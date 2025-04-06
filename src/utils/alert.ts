import {Alert} from 'react-native';

export const confirm = (title: string | undefined, message: string) => {
  return new Promise(resolve => {
    Alert.alert(
      title || 'Confirm',
      message,
      [
        {text: 'Cancel', onPress: () => resolve(false), style: 'cancel'},
        {text: 'OK', onPress: () => resolve(true)},
      ],
      {cancelable: false},
    );
  });
};
