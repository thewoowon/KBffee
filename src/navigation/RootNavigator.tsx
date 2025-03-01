import React from 'react';
import AuthStack from './AuthStack'; // 인증 스택
import MainTab from './MainTab'; // 메인 스택
import {useAuth} from '../hooks';

const RootNavigator = () => {
  const {isAuthenticated} = useAuth(); // AuthContext에서 상태 가져오기

  return isAuthenticated ? <MainTab /> : <AuthStack />;
};

export default RootNavigator;
