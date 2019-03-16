import React, { Component } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native';
import { Logo, HorizontalSeparator, CredentialInput } from '../components';
import colors from '../style/colors';

export default class Home extends Component {
	componentDidMount(){
        console.warn("home mounted");
    }
	render() {
		return (
			<View>
				<Text>Home</Text>
			</View>
		);
	}
}
