import { createStackNavigator, createAppContainer } from 'react-navigation';
import LoginNavigator from './LoginNavigator';
import { Home } from '../screens';

const RootNavigator = createStackNavigator(
	{
		LoginNavigator
	},
	{
		initialRouteName: 'LoginNavigator',
		defaultNavigationOptions: {
			header: null
		}
	}
);

export default createAppContainer(RootNavigator);


