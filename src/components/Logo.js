import React from 'react';
import { StyleSheet, View, Image } from 'react-native';

const logoImage = require('../../assets/logo.png');

export default () => {
	return (
		<View style={styles.container}>
			<Image source={logoImage} style={styles.logo} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		paddingTop: 10 + '%',
		paddingBottom: 20 + '%'
	},
	logo: {
		width: 100 + '%',
		height: 100,
		resizeMode: 'contain'
	}
});
