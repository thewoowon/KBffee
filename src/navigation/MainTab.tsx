import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import SupervisorScreen from '../screens/supervisor';
import ClientScreen from '../screens/client';

const Tab = createBottomTabNavigator();

const MainTab = () => (
  <Tab.Navigator
    screenOptions={{
      // 간격 조정
      tabBarStyle: {
        height: 86,
        paddingVertical: 10,
      },
      tabBarItemStyle: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
      },
      tabBarLabelStyle: {
        fontSize: 13,
        fontFamily: 'Pretendard-Medium',
        color: '#8E979E',
      },
      tabBarActiveTintColor: 'blue', // 활성화된 탭의 텍스트 색상
      tabBarInactiveTintColor: 'gray', // 비활성화된 탭의 텍스트 색상
    }}>
    <Tab.Screen
      name="Supervisor"
      component={SupervisorScreen}
      options={{
        headerShown: false,
        tabBarItemStyle: {
          display: 'none',
        },
      }}
    />
    <Tab.Screen
      name="Client"
      component={ClientScreen}
      options={{
        headerShown: false,
        tabBarItemStyle: {
          display: 'none',
        },
      }}
    />
  </Tab.Navigator>
);

export default MainTab;
