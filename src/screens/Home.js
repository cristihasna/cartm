import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Logo, MenuButton, RoundButton } from '../components';
import { connect } from 'react-redux';
import { createSession } from '../redux/actions/sessionActions';
import colors from '../style/colors';

const Home = ({ createSession, navigation }) => (
	<View style={styles.container}>
		<View style={styles.headerContainer}>
			<MenuButton onPress={() => navigation.toggleDrawer()} />
		</View>
		<Logo />
		<Text style={styles.description}>
			You can create a new shopping session or you can access the menu for more options.
		</Text>
		<View style={styles.buttonContainer}>
			<RoundButton iconName={'cart-plus'} onPress={() => createSession(navigation)} large />
		</View>
	</View>
);

export default connect(null, { createSession })(Home);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: 100 + '%',
		height: 100 + '%',
		backgroundColor: colors.lightGrey
	},
	headerContainer: {
		paddingHorizontal: 10,
		paddingVertical: 10
	},
	description: {
		paddingHorizontal: 40,
		textAlign: 'center',
		color: colors.darkPurple,
		fontSize: 20,
		marginTop: -20
	},
	buttonContainer: {
		position: 'absolute',
		right: 20,
		bottom: 20
	}
});
