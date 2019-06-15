import { createDrawerNavigator, createStackNavigator } from 'react-navigation';

import {
	Home,
	CurrentSession,
	Summary,
	Payment,
	Profile,
	Debts,
	Expenses,
	Popular,
	History,
	Receipt,
	ReceiptSummary
} from '../screens';
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

const ReceiptNavigator = createStackNavigator(
	{
		Receipt,
		ReceiptSummary
	},
	{
		defaultNavigationOptions: {
			header: null
		},
		initialRouteName: 'Receipt'
	}
);

const ProfileNavigator = createStackNavigator(
	{
		Profile,
		Debts,
		Expenses,
		Popular,
		History
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
		ProfileNavigator,
		ReceiptNavigator
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
