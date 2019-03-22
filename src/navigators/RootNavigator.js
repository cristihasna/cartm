import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import LoginNavigator from './LoginNavigator';
import AppNavigator from './AppNavigator';
import { Root } from '../screens';

const RootNavigator = createSwitchNavigator(
	{
		RootNavigator: Root,
		LoginNavigator,
		AppNavigator
	},
	{
		initialRouteName: 'RootNavigator',
		defaultNavigationOptions: {
			header: null
		}
	}
);

export default createAppContainer(RootNavigator);
