import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import colors from '../style/colors';

const Participant = (p, style) => {
	const participant = p.participant;
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

export default class ParticipantsList extends Component {
	render() {
		let participants;
		if (this.props.participants.length === 0) participants = <Participant participant={{ profileImgReplacement: '?' }} />;
		else if (this.props.participants.length <= 4)
			participants = this.props.participants.map((p, i) => <Participant key={i} participant={p} />);
		else
			participants = this.props.participants
				.slice(0, 3)
				.concat({ profileImgReplacement: '...' })
				.map((p, i) => <Participant key={i} participant={p} />);
		return (
			<View style={styles.container}>
				{participants}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		width: 100 + '%'
	},
	participantContainer: {
		backgroundColor: colors.white,
		borderRadius: 35,
		borderWidth: 3,
		// flex: 1,
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

ParticipantsList.propTypes = {
	participants: PropTypes.array.isRequired
};
