import React, { Component } from 'react';
import { normalizeUserData } from '../lib';
import SummaryPresentational from './SummaryPresentational';

export default class ReceiptSummary extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		let state = this.state;
		const participants = this.props.navigation.getParam('rParticipants', []);
		for (let participant of participants) state[participant._id] = false;
		this.setState(state);
	}

	handleToggle(participantId) {
		let state = this.state;
		for (let key in state) {
			if (key !== participantId) state[key] = false;
		}
		if (state.hasOwnProperty(participantId)) state[participantId] = !state[participantId];
		this.setState(state);
	}

	computeParticipants(receiptParticipants, receiptProducts) {
		const participantsDict = {};
		for (let participant of receiptParticipants) {
			participantsDict[participant.email] = normalizeUserData(participant.profile);
		}

		// constructing participants array
		let participantsArray = [];
		for (let participant of receiptParticipants) {
			let products = [];
			for (let product of receiptProducts) {
				// skip products for which the current user is not a participant
				if (!product.participants.includes(participant.email)) continue;
				// user is participant of this product
				let coParticipants = [];
				for (let other of product.participants) {
					coParticipants.push(participantsDict[other]);
				}
				products.push(Object.assign(product, { coParticipants }));
			}
			participant.profile = participantsDict[participant.email];
			participantsArray.push(Object.assign(participant, { products }));
		}
		return participantsArray;
	}

	render() {
		const receiptParticipants = this.props.navigation.getParam('rParticipants', []);
		const receiptProducts = this.props.navigation.getParam('rProducts', []);

		const total = receiptProducts.reduce((total, product) => {
			const cost = product.unitPrice * product.quantity;
			return total + cost;
		}, 0);

		const participantsArray = this.computeParticipants(receiptParticipants, receiptProducts);
		return (
			<SummaryPresentational
				screenTitle="Back to receipt"
				participantsState={this.state}
				participantsArray={participantsArray}
				navigation={this.props.navigation}
				total={total}
				onToggle={this.handleToggle.bind(this)}
				paymentScreenName="ReceiptPayment"
			/>
		);
	}
}
