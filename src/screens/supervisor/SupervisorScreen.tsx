import {createStackNavigator} from '@react-navigation/stack';
import MainScreen from './MainScreen';
import DetailScreen from './DetailScreen';

const Stack = createStackNavigator();

const SupervisorStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Main"
      component={MainScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="Detail"
      component={DetailScreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

export default SupervisorStack;
