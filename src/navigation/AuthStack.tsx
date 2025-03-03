import {createStackNavigator} from '@react-navigation/stack';
import {ModeSelectionScreen, SignInScreen} from '../screens/auth';

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ModeSelection"
      component={ModeSelectionScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="SignIn"
      component={SignInScreen}
      options={{headerShown: false}}
    />
  </Stack.Navigator>
);

export default AuthStack;
