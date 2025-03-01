import {createStackNavigator} from '@react-navigation/stack';
import {SignInScreen} from '../screens/auth';

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="SignIn"
      component={SignInScreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

export default AuthStack;
