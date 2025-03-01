import {createStackNavigator} from '@react-navigation/stack';
import StandbyScreen from './StandbyScreen';
import NumberInputScreen from './NumberInputScreen';
import TermsScreen from './TermsScreen';
import DashboardScreen from './DashboardScreen';

const Stack = createStackNavigator();

const ClientStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Standby"
      component={StandbyScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="Terms"
      component={TermsScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="NumberInput"
      component={NumberInputScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

export default ClientStack;
