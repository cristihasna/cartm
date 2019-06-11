import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Animated } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { ScreenHeading, User, ProfileSection, Graph } from '../components';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import colors from '../style/colors';
import DatePicker from 'react-native-datepicker';
import { fetchExpensiveProducts, updateHistoryBoundings, HistoryKind } from '../redux/actions/historyActions';

const HistoryDate = ({ date, onChange }) => (
	<View style={styles.datepickerContainer}>
		<Icon name="calendar-alt" style={styles.dateIcon} />
		<DatePicker
			style={styles.datePicker}
			customStyles={{
				dateInput: styles.datePickerInput,
				dateText: styles.datePickerText,
				placeholderText: styles.datePickerPH
			}}
			date={date}
			mode="date"
			placeholder="no deadline set"
			format="YYYY-MM-DD"
			confirmBtnText="Confirm"
			cancelBtnText="Cancel"
			onDateChange={onChange}
			androidMode="spinner"
			showIcon={false}
		/>
	</View>
);


class Expenses extends Component {
	_handleRefresh() {
		const beginDate = this.props.history.beginDate;
		const endDate = this.props.history.endDate;
		this.props.fetchExpensiveProducts(HistoryKind.CUSTOM, null, beginDate, endDate);
	}

	componentDidMount() {
		const beginDate = this.props.history.beginDate;
		const endDate = this.props.history.endDate;
		this.props.fetchExpensiveProducts(HistoryKind.CUSTOM, null, beginDate, endDate);
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
		let totalExpenses = 0;
		const expensiveProducts = this.props.history.custom.expensive;
		if (expensiveProducts) {
			totalExpenses = expensiveProducts.reduce(
				(total, product) => total + product.unitPrice * product.quantity / product.participants.length,
				0 /*initial value*/
			);
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
					<ProfileSection heading={{ title: 'Expenses:', right: totalExpenses.toFixed(2) }} />
					<View style={styles.datePickersContainer}>
						<HistoryDate date={this.props.history.beginDate} onChange={console.log} />
						<Icon name="long-arrow-alt-right" style={styles.datesArrow} />
						<HistoryDate date={this.props.history.endDate} onChange={console.log} />
					</View>
					<View style={styles.graphContainer}>
						<Graph products={expensiveProducts} />
					</View>
				</View>
			</View>
		);
		return debtsContent;
	}
}

const mapStateToProps = (state) => ({
	login: state.login,
	history: state.history,
	loading: state.loading
});

export default connect(mapStateToProps, {
	fetchExpensiveProducts,
	updateHistoryBoundings
})(Expenses);

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
		flex: 1,
		paddingHorizontal: 20
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
	datePickersContainer: {
		height: 50,
		backgroundColor: colors.mediumGrey,
		paddingHorizontal: 10,
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	datesArrow: {
		fontSize: 20,
		color: colors.purple
	},
	datepickerContainer: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 10
	},
	dateIcon: {
		fontSize: 20,
		color: colors.purple
	},
	datePicker: {
		width: 'auto',
		flex: 0,
		marginLeft: 10
	},
	datePickerInput: {
		flex: 0,
		borderWidth: 0,
		alignItems: 'flex-start'
	},
	datePickerText: {
		color: colors.purple,
		fontSize: 20,
		fontWeight: 'bold'
	},
});
