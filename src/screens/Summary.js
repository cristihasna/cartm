import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ScreenHeading, User, ParticipantsList, RoundButton } from '../components';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import colors from '../style/colors';
import { normalizeUserData } from '../lib';

const ParticipantSummary = ({ participant, collapsed = true }) => (
	<View style={styles.participantContainer}>
		<User data={normalizeUserData(participant.profile)} />
		<View style={styles.hasBorderLeft}>
			<View style={styles.dropdownContainer}>
				<View style={styles.dropdownSection}>
					<Icon style={styles.dropdownIcon} name={collapsed ? 'chevron-down' : 'chevron-right'} />
					<Text style={[ styles.accent, { color: colors.darkPurple, fontSize: 20 } ]}>
						{participant.products.length}
					</Text>
					<Text style={[ styles.label, { fontSize: 20, marginLeft: 5 } ]}>
						{participant.products.length === 1 ? 'product' : 'products'}
					</Text>
				</View>
				<View style={[ styles.hasBorderLeft, { marginLeft: 10 } ]}>
					{participant.products.map((product) => (
						<View style={styles.participantProductContainer} key={product._id}>
							<Text style={styles.participantProductName}>
								{product.product.name.length <= 25 ? (
									product.product.name
								) : (
									product.product.name.substr(0, 22) + '...'
								)}
							</Text>
							<View style={styles.participantProductInfo}>
								<Text style={[ styles.accent, { fontSize: 18, marginRight: 10 } ]}>+</Text>
								<ParticipantsList
									containerStyle={{ width: 'auto' }}
									itemStyle={{ borderColor: colors.lightGrey }}
									participants={product.coParticipants.filter(p => p.email !== participant.email)}
								/>
							</View>
						</View>
					))}
				</View>

				<View style={styles.dropdownSection}>
					<Text style={[ styles.label, { fontSize: 20 } ]}>total:</Text>
					<Text style={[ styles.accent, { fontSize: 20, marginLeft: 10 } ]}>
						{participant.debt.toFixed(2)}
					</Text>
				</View>
			</View>
		</View>
	</View>
);

class Summary extends Component {
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
			}
			participantsArray.push(
				<ParticipantSummary key={participant._id} participant={Object.assign(participant, { products })} />
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
					<ScrollView style={styles.participantsContainer}>
						<View style={{ height: 25 }} />
						{participantsArray}
						<View style={{ height: 128 }} />
					</ScrollView>
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
	dropdownContainer: {},
	dropdownSection: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
	},
	dropdownIcon: {
		width: 20,
		textAlign: 'center',
		fontSize: 18,
		marginRight: 10,
		color: colors.purple
	},
	participantProductContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center'
    },
    participantProductName: {
        fontSize: 16,
        color: colors.darkPurple
    },
	participantProductInfo: {
		flex: 1,
		justifyContent: 'flex-end',
		flexDirection: 'row',
		alignItems: 'center'
	},
	productsButtonsWrapper: {
		justifyContent: 'center',
		alignItems: 'center',
        height: 128,
        left: 50 + '%',
        marginLeft: -38,
        position: 'absolute',
        bottom: 0,
	}
});

export default connect(mapStateToProps)(Summary);
