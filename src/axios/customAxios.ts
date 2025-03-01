import axios from 'axios';
import {Platform} from 'react-native';
import {API_URL} from '@env';

const BASE_URL = Platform.select({
  ios: API_URL, // iOS 시뮬레이터
  android: API_URL, // Android 에뮬레이터
});

const customAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10초 제한
  headers: {
    'Content-Type': 'application/json',
  },
});

export default customAxios;
