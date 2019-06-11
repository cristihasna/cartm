import { createDrawerNavigator, createStackNavigator } from 'react-navigation';

import { Home, CurrentSession, Summary, Payment, Profile, Debts, Expenses, Popular } from '../screens';
import { DrawerContent } from '../components';
import colors from '../style/colors';

const SessionNavigator = createStackNavigator(
	{
		CurrentSession,
		Summary,
		Payment
	},
	{
		defaultNavigationOptions: {
			header: null
		},
		initialRouteName: 'CurrentSession'
	}
);

const ProfileNavigator = createStackNavigator(
	{
		Profile,
		Debts,
		Expenses,
		Popular
	},
	{
		defaultNavigationOptions: {
			header: null
		},
		initialRouteName: 'Profile'
	}
);

const AppNavigator = createDrawerNavigator(
	{
		Home,
		SessionNavigator,
		ProfileNavigator
	},
	{
		defaultNavigationOptions: {
			header: null
		},
		initialRouteName: 'Home',
		contentComponent: DrawerContent,
		overlayColor: colors.darkPurple
	}
);

export default AppNavigator;
