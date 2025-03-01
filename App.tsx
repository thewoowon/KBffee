import './gesture-handler.native';
import React, {useEffect} from 'react';

import {NavigationContainer} from '@react-navigation/native';

import Toast, {BaseToast, ToastConfig} from 'react-native-toast-message';

import {FIREBASE_API_KEY} from '@env';
import {AuthProvider} from './src/contexts';
import RootNavigator from './src/navigation/RootNavigator';
import {useAuth} from './src/hooks';
import MyCustomToast from './src/components/MyCustomToast';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

// Custom ToastConfig
const toastConfig: ToastConfig = {
  success: (props: any) => <BaseToast {...props} />,
  error: (props: any) => <BaseToast {...props} />,
  info: (props: any) => <BaseToast {...props} />,
  custom_type: (props: any) => <MyCustomToast {...props} />,
};

function App(): React.JSX.Element {
  const {initializeAuth} = useAuth();

  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer
        theme={{
          dark: false,
          colors: {
            primary: '#FF6B6B',
            background: '#FFFFFF',
            card: '#FFFFFF',
            text: '#000000',
            border: '#E5E5E5',
            notification: '#FF6B6B',
          },
          fonts: {
            regular: {
              fontFamily: 'Pretendard-Regular',
              fontWeight: 'normal',
            },
            medium: {
              fontFamily: 'Pretendard-Medium',
              fontWeight: 'normal',
            },
            bold: {
              fontFamily: 'Pretendard-Bold',
              fontWeight: 'normal',
            },
            heavy: {
              fontFamily: 'Pretendard-ExtraBold',
              fontWeight: 'normal',
            },
          },
        }}>
        <RootNavigator />
        <Toast config={toastConfig} />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default function RootApp() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
