import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import colors from '../style/colors';

const Participant = ({ participant, style }) => {
	return (
		<View style={[ styles.participantContainer, style ]}>
			{participant.photoURL ? (
				<Image source={{ uri: participant.photoURL }} style={styles.profileImg} />
			) : (
				<Text style={styles.imageReplacement}>{participant.profileImgReplacement}</Text>
			)}
		</View>
	);
};

export default ({ participants, containerStyle, itemStyle }) => {
	let participantsArr;
	if (participants.length === 0)
		participantsArr = <Participant style={itemStyle} participant={{ profileImgReplacement: '?' }} />;
	else if (participants.length <= 4)
		participantsArr = participants.map((p, i) => <Participant style={itemStyle} key={i} participant={p} />);
	else
		participantsArr = participants
			.slice(0, 3)
			.concat({ profileImgReplacement: '...' })
			.map((p, i) => <Participant style={itemStyle} key={i} participant={p} />);
	return <View style={[styles.container, containerStyle]}>{participantsArr}</View>;
};

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	participantContainer: {
		backgroundColor: colors.white,
		borderRadius: 35,
		borderWidth: 3,
		justifyContent: 'center',
		alignItems: 'center',
		borderColor: colors.mediumGrey,
		marginLeft: -10,
		width: 35,
		height: 35
	},
	profileImg: {
		width: 30,
		height: 30,
		borderRadius: 30
		// backgroundColor: colors.black
	},
	imageReplacement: {
		fontSize: 18,
		color: colors.purple,
		fontWeight: 'bold',
		justifyContent: 'center',
		alignItems: 'center'
	}
});