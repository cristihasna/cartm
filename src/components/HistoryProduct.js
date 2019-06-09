import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../style/colors';

export default ({ title, productDate }) => {
	const date = new Date(productDate);
	const now = new Date();
	const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
	const month = [ 'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC' ][
		date.getMonth()
    ];
    const year = date.getFullYear();
	let timeline = `${day} - ${month} - ${year}`;
	if (now.getFullYear() === date.getFullYear() && now.getMonth() === date.getMonth()) {
		if (now.getDate() === date.getDate()) timeline = 'today';
		else if (now.getDate() - date.getDate() === 1) timeline = 'yesterday';
	}
	return (
		<View style={styles.container}>
			<Text style={styles.title}>
				{title.length > 25 ? title.slice(0, 19) + '...' + title.slice(title.length - 3) : title}
			</Text>
			<Text style={styles.timeline}>{timeline}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
        marginVertical: 3,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between'
    },
    title: {
        fontSize: 18,
        color: colors.darkPurple
    },
    timeline: {
        fontStyle: 'italic',
        color: colors.purple,
        fontSize: 16
    }
});
