import { createDrawerNavigator } from 'react-navigation';

import { Home } from '../screens';
import { DrawerContent } from '../components';

const AppNavigator = createDrawerNavigator(
	{
		Home
	},
	{
		defaultNavigationOptions:{
			header: null
		},
		initialRouteName: 'Home',
		contentComponent: DrawerContent
	}
);

export default AppNavigator;
