import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import User from './User';
import colors from '../style/colors';
import { normalizeUserData } from '../lib';

const UserList = ({
	participants,
	onAction,
	onItemPress,
	isApplicable,
	keyExtractor,
	iconName,
	iconReversed,
	containerStyle
}) => {
	return (
		<ScrollView style={[ {}, containerStyle ]}>
			{participants.map((participant) => {
				const userData = normalizeUserData(participant.profile ? participant.profile : participant);
				return (
					<View key={keyExtractor(participant)} style={styles.participant}>
						<User onPress={() => (onItemPress ? onItemPress(participant) : null)} data={userData} />
						{isApplicable &&
						isApplicable(participant) && (
							<TouchableOpacity
								onPress={() => onAction(participant)}
								style={[ styles.userActionButton, iconReversed && styles.userActionButtonR ]}>
								<Icon
									name={iconName}
									style={[ styles.userActionIcon, iconReversed && styles.userActionIconR ]}
								/>
							</TouchableOpacity>
						)}
					</View>
				);
			})}
		</ScrollView>
	);
};

export default UserList;

const styles = StyleSheet.create({
	participant: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 5
	},
	userActionButton: {
		width: 32,
		height: 32,
		borderRadius: 32,
		backgroundColor: colors.purple,
		justifyContent: 'center',
		alignItems: 'center'
	},
	userActionButtonR: {
		backgroundColor: 'transparent'
	},
	userActionIcon: {
		fontSize: 18,
		color: colors.lightGrey
	},
	userActionIconR: {
		fontSize: 24,
		color: colors.purple
	}
});
