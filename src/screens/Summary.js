import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import { ScreenHeading, ParticipantSummary, RoundButton } from '../components';
import { connect } from 'react-redux';
import colors from '../style/colors';
import { normalizeUserData } from '../lib';

class Summary extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

    componentDidMount(){
        let state = this.state;
        for (let participant of this.props.session.participants)
            state[participant._id] = false;
        this.setState(state);
    }

	handleToggle(participantId) {
        let state = this.state;
        for (let key in state){
            if (key !== participantId) state[key] = false;
        }
        if (state.hasOwnProperty(participantId)) state[participantId] = !state[participantId];
        this.setState(state);
    }

    componentWillReceiveProps(newProps){
        let state = this.state;
        for (let participant of newProps.session.participants){
            if (!state.hasOwnProperty(participant._id)) state[participant._id] = false;
        }
        this.setState(state);
    }
	render() {
		const participantsDict = {};
		for (let participant of this.props.session.participants) {
			participantsDict[participant.email] = normalizeUserData(participant.profile);
		}

		const session = this.props.session;
		const total = session.products.reduce((total, product) => {
			const cost = product.unitPrice * product.quantity;
			return total + cost;
		}, 0);

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
					// skip current user, as we will display just the co-participants
					// if (other === participant.email) continue;
					coParticipants.push(participantsDict[other]);
				}
				products.push(Object.assign(product, { coParticipants }));
				participant.profile = participantsDict[participant.email];
			}
			participantsArray.push(
				<ParticipantSummary
					onToggle={this.handleToggle.bind(this)}
					key={participant._id}
                    collapsed={this.state[participant._id]}
					participant={Object.assign(participant, { products })}
				/>
			);
		}
		return (
			<View style={styles.container}>
				<ScreenHeading title={'Back to cart'} action={() => this.props.navigation.goBack()} />
				<View style={styles.contentWrapper}>
					<View style={styles.totalCostContainer}>
						<Text style={styles.label}>Total: </Text>
						<Text style={[ styles.accent, { fontSize: 28 } ]}>{total}</Text>
					</View>
					<Animated.ScrollView style={styles.participantsContainer}>
						<View style={{ height: 25 }} />
						{participantsArray}
						<View style={{ height: 128 }} />
					</Animated.ScrollView>
				</View>
				<View style={styles.productsButtonsWrapper}>
					<RoundButton iconName="credit-card" onPress={() => console.warn('payment')} large />
				</View>
			</View>
		);
	}
}

const mapStateToProps = (state) => ({
	loading: state.loading,
	session: state.session,
	login: state.login
});

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
	}
});

export default connect(mapStateToProps)(Summary);
