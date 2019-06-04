import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
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
				const UserContainer = onItemPress ? TouchableOpacity : View;
				return (
					<View key={keyExtractor(participant)} style={styles.participant}>
						<UserContainer
							onPress={() => (onItemPress ? onItemPress(participant) : null)}
							style={styles.participantContainer}>
							<View style={styles.participantProfileImg}>
								{userData.photoURL ? (
									<Image style={styles.profileImg} source={{ uri: userData.photoURL }} />
								) : (
									<Text style={styles.profileImgReplacement}>{userData.profileImgReplacement}</Text>
								)}
							</View>
							<Text style={styles.participantDisplayName}>{userData.displayName}</Text>
						</UserContainer>
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
	participantContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center'
	},
	participantProfileImg: {
		width: 42,
		height: 42,
		borderRadius: 42,
		borderWidth: 3,
		borderColor: colors.lightPurple,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.white
	},
	profileImg: {
		flex: 1,
		width: 100 + '%',
		height: 100 + '%',
		borderRadius: 35
	},
	profileImgReplacement: {
		fontSize: 20,
		fontWeight: 'bold',
		color: colors.purple
	},
	participantDisplayName: {
		fontSize: 24,
		marginLeft: 10,
		color: colors.purple
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
