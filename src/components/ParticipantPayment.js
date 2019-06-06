import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, ToastAndroid } from 'react-native';
import User from './User';
import colors from '../style/colors';
import PropTypes from 'prop-types';

export default class ParticipantPayment extends Component {
	constructor(props) {
		super(props);
		this.state = { payed: this.props.participant.payed.toFixed(2) };
	}

	_handlePaymentFocus() {
		if (this.state.payed === '0.00') {
			const focusValue = parseFloat(this.state.payed) + this.props.remainder;
			this.setState({ payed: focusValue.toFixed(2) });
		}
	}

	_handlePaymentChange(payed) {
		this.setState({ payed });
	}

	_handlePaymentBlur() {
		const payed = parseFloat(this.state.payed);
		const remainder = this.props.remainder + this.props.participant.payed;
		if (this.state.payed === '') {
			// if the user lets the input empty, consider that the payment is removed
			this.setState({payed: '0.00'});
			this.props.onChange(this.props.participant, 0);
		} else if (isNaN(payed)) {
			// if there is an invalid payment, reset back to initial value
			this.setState({ payed: this.props.participant.payed.toFixed(2) });
			ToastAndroid.show('Invalid payment', ToastAndroid.SHORT);
		} else if (0 <= payed <= remainder) {
			// if the payment is valid, save it and call the callback
			this.setState({ payed: payed.toFixed(2) });
			this.props.onChange(this.props.participant, payed);
		} else {
			// otherwise, reset the payment
			this.setState({ payed: this.props.participant.payed.toFixed(2) });
		}
	}

	render() {
		return (
			<View style={styles.participantContainer}>
				<User data={this.props.participant.profile} />
				<View style={styles.hasBorderLeft}>
					<View style={styles.dropdownSection}>
						<Text style={styles.label}>payed:</Text>
						<TextInput
							keyboardType="decimal-pad"
							onFocus={this._handlePaymentFocus.bind(this)}
							onChangeText={this._handlePaymentChange.bind(this)}
							onBlur={this._handlePaymentBlur.bind(this)}
							style={styles.accent}
							value={this.state.payed}
							selectTextOnFocus
						/>
					</View>
				</View>
			</View>
		);
	}
}

ParticipantPayment.propTypes = {
	participant: PropTypes.object.isRequired,
	remainder: PropTypes.number.isRequired,
	onChange: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
	participantContainer: {
		marginVertical: 10
	},
	hasBorderLeft: {
		paddingLeft: 15,
		marginLeft: 20,
		marginTop: 5,
		borderLeftColor: colors.purple,
		borderLeftWidth: 1
	},
	dropdownSection: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},
	label: {
		fontSize: 18,
		color: colors.darkPurple
	},
	accent: {
		fontSize: 20,
		marginLeft: 5,
		marginVertical: 0,
		paddingVertical: 0,
		borderBottomColor: colors.purple,
		borderBottomWidth: 1,
		color: colors.purple,
		fontWeight: 'bold'
	}
});
