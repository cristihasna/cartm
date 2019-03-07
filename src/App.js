import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import Login from './screens/Login';

export default class App extends Component {
	render() {
		return (
			<View>
				<Login />
			</View>
		);
	}
}
