import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './redux/store';

import RootNavigator from './navigators/RootNavigator';

export default class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<RootNavigator />
			</Provider>
		);
	}
}
