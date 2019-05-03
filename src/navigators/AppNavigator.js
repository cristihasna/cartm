import { createDrawerNavigator } from 'react-navigation';

import { Home, CurrentSession } from '../screens';
import { DrawerContent } from '../components';

const AppNavigator = createDrawerNavigator(
	{
		Home,
		CurrentSession
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
