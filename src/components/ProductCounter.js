import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import colors from '../style/colors';

export default ({ counter, title }) => {
	return (
		<View style={styles.container}>
			<View style={styles.counterContainer}>
				<Text style={styles.counter}>{counter}</Text>
			</View>
			<Text style={styles.title}>
				{title.length > 25 ? title.slice(0, 19) + '...' + title.slice(title.length - 3) : title}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
        paddingVertical: 3,
        display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},
	counterContainer: {
		height: 36,
		width: 36,
		backgroundColor: colors.white,
		borderRadius: 36,
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 2,
		borderColor: colors.lightPurple
	},
	counter: {
		color: colors.purple,
		fontSize: 16
	},
	title: {
		color: colors.darkPurple,
		marginLeft: 10,
		fontSize: 18
	}
});
