import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import colors from '../style/colors';

export default ({ title, action }) => (
	<TouchableOpacity style={styles.container} onPress={action}>
		<Icon name="long-arrow-alt-left" style={styles.icon} />
		<Text style={styles.title}>{title}</Text>
	</TouchableOpacity>
);

const styles = StyleSheet.create({
	container: {
		padding: 10,
		display: 'flex',
		flexDirection: 'row'
	},
	icon: {
		color: colors.purple,
		fontSize: 24
    },
    title: {
        color: colors.purple,
        fontSize: 24,
        marginLeft: 10
    }
});
