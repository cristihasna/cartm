import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenHeading, ParticipantSummary, RoundButton } from '../components';
import colors from '../style/colors';

const SummaryPresentational = ({
	participantsState,
	participantsArray,
	screenTitle,
	navigation,
	total,
	onToggle,
	paymentScreenName
}) => {
	return (
		<View style={styles.container}>
			<ScreenHeading title={screenTitle} action={() => navigation.goBack()} />
			<View style={styles.contentWrapper}>
				<View style={styles.totalCostContainer}>
					<Text style={styles.label}>Total: </Text>
					<Text style={[ styles.accent, { fontSize: 28 } ]}>{total.toFixed(2)}</Text>
					<Text style={[ styles.accent, { fontSize: 20, marginLeft: 5 } ]}>RON</Text>
				</View>
				<ScrollView style={styles.participantsContainer}>
					<View style={{ height: 25 }} />
					{participantsArray.map((participant) => (
						<ParticipantSummary
							onToggle={onToggle}
							key={participant._id}
							collapsed={participantsState[participant._id]}
							participant={participant}
						/>
					))}
					<View style={{ height: 128 }} />
				</ScrollView>
			</View>
			<View style={styles.productsButtonsWrapper}>
				<RoundButton iconName="credit-card" onPress={() => navigation.navigate(paymentScreenName)} large />
			</View>
		</View>
	);
};

export default SummaryPresentational;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: 100 + '%',
		height: 100 + '%',
		backgroundColor: colors.lightGrey
	},
	contentWrapper: {
		paddingVertical: 10,
		flex: 1
	},
	totalCostContainer: {
		marginTop: 10,
		paddingHorizontal: 20,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},
	label: {
		fontSize: 24,
		color: colors.darkPurple
	},
	accent: {
		fontSize: 24,
		color: colors.purple,
		fontWeight: 'bold'
	},
	participantsContainer: {
		paddingHorizontal: 20
	},
	productsButtonsWrapper: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 128,
		left: 50 + '%',
		marginLeft: -38,
		position: 'absolute',
		bottom: 0
	}
});
