import React, { Component } from 'react';
import { normalizeUserData } from '../lib';
import PaymentPresentational from './PaymentPresentational';
import { connect } from 'react-redux';
import { updateReceipt, endReceipt } from '../redux/actions/receiptActions';

class ReceiptPayment extends Component {
	_handlePaymentChange(participant, payment) {
		let participants = this.props.receipt.participants;
		let indexOf = participants.findIndex((other) => other._id === participant._id);
		if (indexOf === -1) return;
		participants[indexOf].payed = payment;
		this.props.updateReceipt({ participants, products: this.props.receipt.products });
	}

	shouldComponentUpdate(nextProps){
		return true;
	}

	_handleReceiptEnd() {
		this.props.endReceipt(
			{
				products: this.props.receipt.products,
				participants: this.props.receipt.participants
			},
			this.props.navigation
		);
	}

	render() {
		const total = this.props.receipt.products.reduce((total, product) => {
			const cost = product.unitPrice * product.quantity;
			return total + cost;
		}, 0);
		const totalPayment = this.props.receipt.participants.reduce((total, participant) => {
			return total + participant.payed;
		}, 0);
		// constructing participants array
		let participantsArray = this.props.receipt.participants.map((participant) =>
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

const mapStateToProps = (state) => ({
	receipt: state.receipt
});

export default connect(mapStateToProps, { updateReceipt, endReceipt })(ReceiptPayment);
