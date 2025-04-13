import {getApp} from '@react-native-firebase/app';
import {
  getAnalytics,
  logEvent,
  setUserId,
  setUserProperties,
} from '@react-native-firebase/analytics';

const useAnalytics = () => {
  const app = getApp();
  const analytics = getAnalytics(app);

  return {
    logEvent: (eventName: string, params?: Record<string, any>) => {
      return logEvent(analytics, eventName, params);
    },
    setUserId: (id: string) => {
      return setUserId(analytics, id);
    },
    setUserProperties: (props: Record<string, string>) => {
      return setUserProperties(analytics, props);
    },
  };
};

export default useAnalytics;
