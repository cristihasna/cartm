import { createDrawerNavigator, createStackNavigator } from 'react-navigation';

import { Home, CurrentSession, Summary, Payment } from '../screens';
import { DrawerContent } from '../components';
import colors from '../style/colors';

const SessionNavigator = createStackNavigator(
	{
		CurrentSession,
		Summary,
		Payment
	},
	{
		defaultNavigationOptions:{
			header: null
		},
		initialRouteName: 'CurrentSession'
	}
);


const AppNavigator = createDrawerNavigator(
	{
		Home,
		SessionNavigator
	},
	{
		defaultNavigationOptions:{
			header: null
		},
		initialRouteName: 'Home',
		contentComponent: DrawerContent,
		overlayColor: colors.darkPurple
	}
);

export default AppNavigator;
