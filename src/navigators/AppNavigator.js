import { createDrawerNavigator } from 'react-navigation';

import { Home, CurrentSession } from '../screens';
import { DrawerContent } from '../components';
import colors from '../style/colors';

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
		contentComponent: DrawerContent,
		overlayColor: colors.darkPurple
	}
);

export default AppNavigator;
