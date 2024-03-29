import React, { Component } from 'react';
import { connect } from 'react-redux';
import { normalizeUserData } from '../lib';
import SummaryPresentational from './SummaryPresentational';

class Summary extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	componentDidMount() {
		let state = this.state;
		for (let participant of this.props.session.participants) state[participant._id] = false;
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

	componentWillReceiveProps(newProps) {
		if (!newProps.session) return;
		let state = this.state;
		for (let participant of newProps.session.participants) {
			if (!state.hasOwnProperty(participant._id)) state[participant._id] = false;
		}
		this.setState(state);
	}

	computeParticipants() {
		const participantsDict = {};
		for (let participant of this.props.session.participants) {
			participantsDict[participant.email] = normalizeUserData(participant.profile);
		}

		// constructing participants array
		let participantsArray = [];
		for (let participant of this.props.session.participants) {
			let products = [];
			for (let product of this.props.session.products) {
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
		if (!this.props.session) return null;
		const total = this.props.session.products.reduce((total, product) => {
			const cost = product.unitPrice * product.quantity;
			return total + cost;
		}, 0);
		const participantsArray = this.computeParticipants();
		return (
			<SummaryPresentational 
				screenTitle='Back to cart'
				participantsState={this.state}
				participantsArray={participantsArray}
				navigation={this.props.navigation}
				total={total}
				onToggle={this.handleToggle.bind(this)}
				paymentScreenName='Payment' />
		);
	}
}

const mapStateToProps = (state) => ({
	loading: state.loading,
	session: state.session,
	login: state.login
});

export default connect(mapStateToProps)(Summary);
