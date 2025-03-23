import React, {useEffect} from 'react';
import AuthStack from './AuthStack'; // 인증 스택
import MainTab from './MainTab'; // 메인 스택
import {useAuth} from '../hooks';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

const RootNavigator = () => {
  const {mode, isAuthenticated} = useAuth(); // AuthContext에서 상태 가져오기

  type NavigationProp = StackNavigationProp<
    {
      Supervisor: {screen: 'Main'};
      Client: {screen: 'NumberInput'};
    },
    'Supervisor' | 'Client'
  >;
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    if (isAuthenticated) {
      if (mode === 'supervisor') {
        navigation.navigate('Supervisor', {screen: 'Main'});
      } else {
        navigation.navigate('Client', {screen: 'NumberInput'});
      }
    }
  }, [isAuthenticated, mode]);

  return isAuthenticated ? <MainTab /> : <AuthStack />;
};

export default RootNavigator;
