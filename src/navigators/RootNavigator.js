import { createStackNavigator, createAppContainer } from 'react-navigation';
import LoginNavigator from './LoginNavigator';
import AppNavigator from './AppNavigator';

const RootNavigator = createStackNavigator(
	{
		LoginNavigator,
		AppNavigator
	},
	{
		initialRouteName: 'LoginNavigator',
		defaultNavigationOptions: {
			header: null
		}
	}
);

export default createAppContainer(RootNavigator);
