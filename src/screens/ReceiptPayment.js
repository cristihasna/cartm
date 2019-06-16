import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import { normalizeUserData } from '../lib';
import PaymentPresentational from './PaymentPresentational';

export default class ReceiptPayment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			participants: [],
			products: []
		};
	}

	componentDidMount() {
		// check if there is a saved instance of a receipt
		AsyncStorage.multiGet([ 'rProducts', 'rParticipants' ])
			.then(([ [ a, stringifiedProducts ], [ b, stringifiedParticipants ] ]) => {
				if (stringifiedProducts && stringifiedParticipants) {
					// retreiving saved instance of receipt
					products = JSON.parse(stringifiedProducts);
					participants = JSON.parse(stringifiedParticipants);
					this.setState({ products, participants });
				} else this.setState({ loading: false });
			})
			.catch((err) => {
				console.log(err);
			});
	}

	_handlePaymentChange(participant, payment) {
		let participants = this.state.participants;
		let indexOf = participants.findIndex((other) => other._id === participant._id);
		if (indexOf === -1) return;
		participants[indexOf].payed = payment;
		this.setState({ participants });
	}

	_handleReceiptEnd() {
		console.log('request to end receipt and set debts');
		const stringifiedProducts = JSON.stringify([]);
		const stringifiedParticipants = JSON.stringify(
			this.state.participants.map((p) => Object.assign(p, { payed: 0 }))
		);
		console.log('Saving to storage: ', stringifiedProducts, stringifiedParticipants);
		AsyncStorage.multiSet([ [ 'rProducts', stringifiedProducts ], [ 'rParticipants', stringifiedParticipants ] ])
			.then(() => this.props.navigation.navigate('Home'))
			.catch((err) => console.log(err));
	}

	render() {
		const total = this.state.products.reduce((total, product) => {
			const cost = product.unitPrice * product.quantity;
			return total + cost;
		}, 0);
		const totalPayment = this.state.participants.reduce((total, participant) => {
			return total + participant.payed;
		}, 0);
		// constructing participants array
		let participantsArray = this.state.participants.map((participant) =>
			Object.assign(participant, { profile: normalizeUserData(participant.profile) })
		);

		return (
			<PaymentPresentational
				screenTitle="Back to summary"
				navigation={this.props.navigation}
				total={total}
				participantsArray={participantsArray}
				totalPayment={totalPayment}
				onChangePayment={this._handlePaymentChange.bind(this)}
				endSession={this._handleReceiptEnd.bind(this)}
			/>
		);
	}
}
