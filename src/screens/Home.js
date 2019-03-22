import React, { Component } from 'react';
import { View, Text, Button,  StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native';
import firebase from 'react-native-firebase'
import { Logo, HorizontalSeparator, CredentialInput } from '../components';
import colors from '../style/colors';

import {connect} from 'react-redux';


class Home extends Component {
	render() {
		return (
			<View>
				<Text
					style={{
						fontSize: 50,
					}}>Hello</Text>
				<Text>{this.props.login.displayName}</Text>
				<Button
					onPress={() =>{
						firebase.auth().signOut().then(data => {
							console.log('signout data', data);
							this.props.navigation.navigate('RootNavigator');
						})
					}}
					title="Log out"
					/>
			</View>
		);
	}
}
const mapStateToProps = (state) => ({
	login: state.login
})
export default connect(mapStateToProps)(Home);