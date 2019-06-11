import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { ScreenHeading, User, ProfileSection, ProductCounter } from '../components';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import colors from '../style/colors';
import DatePicker from 'react-native-datepicker';
import { fetchPopularProducts, updateHistoryBoundings, HistoryKind } from '../redux/actions/historyActions';

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
			androidMode="calendar"
			showIcon={false}
		/>
	</View>
);

class Expenses extends Component {
	_handleRefresh() {
		const beginDate = this.props.history.beginDate;
		const endDate = this.props.history.endDate;
		this.props.fetchPopularProducts(HistoryKind.CUSTOM, null, beginDate, endDate);
	}

	_handleBeginDateUpdate(beginDate) {
		const endDate = this.props.history.endDate;
		this.props.updateHistoryBoundings({ beginDate: new Date(beginDate), endDate });
		this.props.fetchPopularProducts(HistoryKind.CUSTOM, null, beginDate, endDate);
	}

	_handleEndDateUpdate(endDate) {
		const beginDate = this.props.history.beginDate;
		this.props.updateHistoryBoundings({ beginDate, endDate });
		this.props.fetchPopularProducts(HistoryKind.CUSTOM, null, beginDate, endDate);
	}

	componentDidMount() {
		const beginDate = this.props.history.beginDate;
		const endDate = this.props.history.endDate;
		this.props.fetchPopularProducts(HistoryKind.CUSTOM, null, beginDate, endDate);
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
		let popularProducts = [];
		if (this.props.history.custom.popular) {
			popularProducts = this.props.history.custom.popular;
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
					<View style={styles.datePickersContainer}>
						<HistoryDate
							date={this.props.history.beginDate}
							onChange={this._handleBeginDateUpdate.bind(this)}
						/>
						<Icon name="long-arrow-alt-right" style={styles.datesArrow} />
						<HistoryDate
							date={this.props.history.endDate}
							onChange={this._handleEndDateUpdate.bind(this)}
						/>
					</View>
					<ProfileSection heading={{ title: 'Most popular products' }} containerStyle={{ flex: 1 }}>
						{popularProducts.length > 0 ? (
							<FlatList
								refreshControl={refreshControl}
								data={popularProducts}
								keyExtractor={(product) => product._id}
								renderItem={({ item }) => {
									return <ProductCounter counter={item.counter} title={item.name} />;
								}}
							/>
						) : (
							noDetailsToShow
						)}
					</ProfileSection>
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
	fetchPopularProducts,
	updateHistoryBoundings
})(Expenses);

const styles = StyleSheet.create({
	container: {
		// flex: 1,
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
		paddingHorizontal: 20,
		paddingBottom: 40
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
	}
});
