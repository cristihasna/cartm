import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenHeading, ParticipantPayment, RoundButton } from '../components';
import { connect } from 'react-redux';
import colors from '../style/colors';
import { normalizeUserData } from '../lib';
import { setParticipantPayment, endSession } from '../redux/actions/sessionActions';

class Payment extends Component {
	_handlePaymentChange(participant, payment) {
		if (participant.payed !== payment) this.props.setParticipantPayment(participant.email, payment);
	}

	render() {
        if (!this.props.session) return null;
		const session = this.props.session;
		const total = session.products.reduce((total, product) => {
			const cost = product.unitPrice * product.quantity;
			return total + cost;
		}, 0);
		const totalPayment = this.props.session.participants.reduce((total, participant) => {
			return total + participant.payed;
		}, 0);
		// constructing participants array
		let participantsArray = this.props.session.participants.map((participant) => (
			<ParticipantPayment
				onChange={this._handlePaymentChange.bind(this)}
				key={participant._id}
				remainder={total - totalPayment}
				participant={Object.assign(participant, { profile: normalizeUserData(participant.profile) })}
			/>
		));

		return (
			<View style={styles.container}>
				<ScreenHeading title={'Back to cart'} action={() => this.props.navigation.goBack()} />
				<View style={styles.contentWrapper}>
					<View style={styles.totalCostContainer}>
						<Text style={styles.label}>Total: </Text>
						<Text style={[ styles.accent, { fontSize: 28 } ]}>{total}</Text>
					</View>
					<ScrollView style={styles.participantsContainer}>
						<View style={{ height: 25 }} />
						{participantsArray}
						<View style={{ height: 128 }} />
					</ScrollView>
				</View>
				<View style={styles.productsButtonsWrapper}>
					<RoundButton
						{...(totalPayment !== total ? { containerStyle: styles.disabledButton } : null)}
						iconName={this.props.loading ? 'circle-notch' : 'credit-card'}
						onPress={() => {
							if (this.props.loading || totalPayment !== total) return;
							this.props.endSession(this.props.navigation);
						}}
						large
						{...this.props.loading && { spinning: true }}
					/>
				</View>
			</View>
		);
	}
}

const mapStateToProps = (state) => ({
	session: state.session,
	loading: state.loading
});

export default connect(mapStateToProps, { setParticipantPayment, endSession })(Payment);

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
	},
	disabledButton: {
		backgroundColor: colors.lightPurple
	}
});
