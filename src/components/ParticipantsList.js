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
		return (
			<TouchableOpacity style={styles.container}>
				{this.props.participants.length > 0 ? (
					this.props.participants.map((p, i) => <Participant key={i} participant={p} />)
				) : (
					<Participant participant={{ profileImgReplacement: '?' }} />
				)}
			</TouchableOpacity>
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
		flex: 1,
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
