import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Animated } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { ScreenHeading, User, ProfileSection } from '../components';
import { DebtDeadlineManager } from '../modals';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import colors from '../style/colors';
import { fetchDebts, setDebtDeadline, setDebtPayed } from '../redux/actions/debtsActions';
import { normalizeUserData } from '../lib';

class Debt extends Component {
	constructor(props) {
		super(props);
		this.state = {
			marginBottom: new Animated.Value(0),
			opacity: 1
		};
	}

	handlePayed() {
		this.swipeable.close();
		Animated.timing(this.state.marginBottom, {
			toValue: -56,
			duration: 200
		}).start();
		this.setState({ opacity: 0 });
		this.props.onPay();
	}

	handleSetDeadline() {
		this.swipeable.close();
		this.props.onSetDeadline();
	}

	renderPayButton(_, dragX) {
		const scale = dragX.interpolate({
			inputRange: [ -50, 0 ],
			outputRange: [ 1, 0 ],
			extrapolate: 'clamp'
		});
		return (
			<Animated.View style={{ transform: [ { scale } ] }}>
				<TouchableOpacity style={styles.payButton} onPress={this.handlePayed.bind(this)}>
					<Icon name="check" style={styles.payIcon} />
				</TouchableOpacity>
			</Animated.View>
		);
	}

	renderDeadlineButton(_, dragX) {
		const scale = dragX.interpolate({
			inputRange: [ 0, 50 ],
			outputRange: [ 0, 1 ],
			extrapolate: 'clamp'
		});
		return (
			<Animated.View style={{ transform: [ { scale } ] }}>
				<View style={styles.payButton}>
					<Icon name="user-clock" style={styles.payIcon} />
				</View>
			</Animated.View>
		);
	}

	render() {
		const debtContent = (
			<View style={styles.debtContainer}>
				<User
					iconStyle={{ transform: [ { scale: 0.7 } ] }}
					textStyle={{ fontSize: 18, marginLeft: 0, color: colors.darkPurple }}
					data={this.props.user}
				/>
				<Text style={styles.debtAmount}>{this.props.debt.toFixed(2)}</Text>
			</View>
		);
		return this.props.onPay ? (
			<Swipeable
				containerStyle={{ marginBottom: this.state.marginBottom, opacity: this.state.opacity }}
				ref={(ref) => (this.swipeable = ref)}
				friction={2}
				onSwipeableLeftOpen={this.handleSetDeadline.bind(this)}
				renderRightActions={this.renderPayButton.bind(this)}
				renderLeftActions={this.renderDeadlineButton.bind(this)}
				leftThreshold={50}
				rightThreshold={50}>
				{debtContent}
			</Swipeable>
		) : (
			debtContent
		);
	}
}

class Debts extends Component {
	_handleRefresh() {
		this.props.fetchDebts();
	}

	handlePayed(debt) {
		this.props.setDebtPayed(debt);
		this.props.fetchDebts();
	}

	handleSetDeadline(debt, deadline) {
		this.debtManager.hide();
		this.props.setDebtDeadline(debt, deadline);
		this.props.fetchDebts();
	}

	componentDidMount() {
		if (!this.props.debts) this.props.fetchDebts();
	}

	render() {
		// refresh control component
		const refreshControl = (
			<RefreshControl refreshing={this.props.loading} onRefresh={this._handleRefresh.bind(this)} />
		);

		const noDetailsToShow = (
			<View style={styles.noDataContainer}>
				<Text style={styles.noDataText}>no details to show</Text>
			</View>
		);

		// default values
		let owedBy = 0;
		let owedTo = 0;

		let owedByDebts = [];
		let owedToDebts = [];

		if (this.props.debts) {
			owedBy = this.props.debts.owedBy.reduce((total, debt) => total + debt.amount, 0);
			owedTo = this.props.debts.owedTo.reduce((total, debt) => total + debt.amount, 0);
			owedByDebts = this.props.debts.owedBy.map((debt) => (
				<Debt key={debt._id} debt={debt.amount} user={normalizeUserData(debt.owedTo)} />
			));
			owedToDebts = this.props.debts.owedTo.map((debt) => (
				<Debt
					key={debt._id}
					debt={debt.amount}
					user={normalizeUserData(debt.owedBy)}
					onPay={() => this.handlePayed(debt)}
					onSetDeadline={() => this.debtManager.show(debt)}
				/>
			));
		}

		const debtsContent = (
			<View style={styles.container}>
				<View style={styles.headerContainer}>
					<ScreenHeading title={'Back to profile'} action={() => this.props.navigation.goBack()} />
					{this.props.login && (
						<User data={this.props.login} containerStyle={{ flex: 0, transform: [ { scale: 0.75 } ] }} />
					)}
				</View>
				<View style={styles.contentWrapper}>
					<ScrollView
						style={styles.scrollView}
						refreshControl={refreshControl}
						contentOffset={{ x: 0, y: 20 }}>
						<View style={styles.scrollViewWrapper}>
							<ProfileSection heading={{ title: 'You owe:', right: owedBy.toFixed(2) }} />
							{owedByDebts.length > 0 ? owedByDebts : noDetailsToShow}
							<ProfileSection heading={{ title: 'You are owed:', right: owedTo.toFixed(2) }} />
							{owedToDebts.length > 0 ? owedToDebts : noDetailsToShow}
							<View style={{ height: 20 }} />
						</View>
					</ScrollView>
				</View>
				<DebtDeadlineManager
					ref={(ref) => (this.debtManager = ref)}
					onSetDeadline={this.handleSetDeadline.bind(this)}
				/>
			</View>
		);
		return debtsContent;
	}
}

const mapStateToProps = (state) => ({
	login: state.login,
	debts: state.debts,
	loading: state.loading
});

export default connect(mapStateToProps, {
	fetchDebts,
	setDebtDeadline,
	setDebtPayed
})(Debts);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: 100 + '%',
		height: 100 + '%',
		backgroundColor: colors.lightGrey
	},
	headerContainer: {
		paddingHorizontal: 10,
		paddingVertical: 10,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	contentWrapper: {
		flex: 1
	},
	scrollViewWrapper: {
		paddingHorizontal: 20
	},
	noDataContainer: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	noDataText: {
		color: colors.purple,
		fontStyle: 'italic'
	},
	debtContainer: {
		display: 'flex',
		flexDirection: 'row',
		paddingHorizontal: 10,
		height: 50,
		backgroundColor: colors.mediumGrey,
		marginVertical: 3,
		alignItems: 'center'
	},
	debtAmount: {
		color: colors.purple,
		fontSize: 20,
		fontWeight: 'bold'
	},
	payButton: {
		height: 50,
		width: 50,
		justifyContent: 'center',
		alignItems: 'center'
	},
	payIcon: {
		fontSize: 24,
		color: colors.purple
	}
});
