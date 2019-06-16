import React, { Component } from 'react';
import { connect } from 'react-redux';
import { normalizeUserData } from '../lib';
import { setParticipantPayment, endSession } from '../redux/actions/sessionActions';
import PaymentPresentational from './PaymentPresentational';

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
		let participantsArray = this.props.session.participants.map((participant) =>
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
				endSession={() => this.props.endSession(this.props.navigation)}
				loading={this.props.loading}
			/>
		);
	}
}

const mapStateToProps = (state) => ({
	session: state.session,
	loading: state.loading
});

export default connect(mapStateToProps, { setParticipantPayment, endSession })(Payment);
