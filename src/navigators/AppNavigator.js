import { createStackNavigator } from 'react-navigation';

import { Home } from '../screens';

const AppNavigator = createStackNavigator(
	{
		Home: {
			screen: Home,
			navigationOptions: {
				header: null
			}
		}
	},
	{
		initialRouteName: 'Home'
	}
);

export default AppNavigator;
