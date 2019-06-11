import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { MenuButton, User, ProfileSection, ProductCounter, HistoryProduct } from '../components';
import { PROFILE_HISTORY_LIMIT } from 'react-native-dotenv';
import { connect } from 'react-redux';
import colors from '../style/colors';
import { fetchDebts } from '../redux/actions/debtsActions';
import {
	HistoryKind,
	fetchPopularProducts,
	fetchExpensiveProducts,
	fetchLatestProducts
} from '../redux/actions/historyActions';

class Profile extends Component {
	_handleRefresh() {
		this.props.fetchDebts();
		this.props.fetchPopularProducts(HistoryKind.MONTHLY);
		this.props.fetchLatestProducts(HistoryKind.MONTHLY);
		this.props.fetchExpensiveProducts(HistoryKind.MONTHLY);
	}

	componentDidMount() {
		if (!this.props.debts) this.props.fetchDebts();
		if (!this.props.history.monthly.popular) this.props.fetchPopularProducts(HistoryKind.MONTHLY);
		if (!this.props.history.monthly.latest) this.props.fetchLatestProducts(HistoryKind.MONTHLY);
		if (!this.props.history.monthly.expensive) this.props.fetchExpensiveProducts(HistoryKind.MONTHLY);
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
		let spentThisMonth = 0;

		let popularProducts = [];
		let latestProducts = [];

		if (this.props.debts) {
			owedBy = this.props.debts.owedBy.reduce((total, debt) => total + debt.amount, 0);
			owedTo = this.props.debts.owedTo.reduce((total, debt) => total + debt.amount, 0);
		}
		if (this.props.history.monthly.latest) {
			spentThisMonth = this.props.history.monthly.latest.reduce(
				(total, product) => total + product.unitPrice * product.quantity / product.participants.length,
				0 /*initial value*/
			);
		}
		if (this.props.history.monthly.popular) {
			popularProducts = this.props.history.monthly.popular
				.slice(0, PROFILE_HISTORY_LIMIT)
				.map((product) => <ProductCounter key={product._id} counter={product.counter} title={product.name} />);
		}
		if (this.props.history.monthly.latest) {
			latestProducts = this.props.history.monthly.latest
				.slice(0, PROFILE_HISTORY_LIMIT)
				.map((product) => (
					<HistoryProduct key={product._id} title={product.product.name} productDate={product.date} />
				));
		}
		const profileContent = (
			<View style={styles.container}>
				<View style={styles.headerContainer}>
					<MenuButton onPress={this.props.navigation.toggleDrawer} logo />
				</View>
				<View style={styles.contentWrapper}>
					<ScrollView
						style={styles.scrollView}
						refreshControl={refreshControl}
						contentOffset={{ x: 0, y: 20 }}>
						<View style={styles.scrollViewWrapper}>
							<View style={styles.userContainer}>
								{this.props.login && <User data={this.props.login} />}
							</View>
							<ProfileSection
								heading={[
									{ title: 'You owe:', right: owedBy.toFixed(2) },
									{ title: 'You are owed:', right: owedTo.toFixed(2) }
								]}
								buttonLabel="more details"
								buttonAction={() => this.props.navigation.navigate('Debts')}
							/>
							<ProfileSection
								heading={{ title: 'Total spent this month:', right: spentThisMonth.toFixed(2) }}
								buttonLabel="view expenses"
								buttonAction={() => this.props.navigation.navigate('Expenses')}
							/>
							<ProfileSection
								heading={{ title: 'Your most popular products' }}
								buttonLabel="view more"
								buttonAction={() => this.props.navigation.navigate('Popular')}>
								{popularProducts.length > 0 ? popularProducts : noDetailsToShow}
							</ProfileSection>
							<ProfileSection
								heading={{ title: 'History' }}
								buttonLabel="view more"
								buttonAction={() => this.props.navigation.navigate('History')}>
								{latestProducts.length > 0 ? latestProducts : noDetailsToShow}
							</ProfileSection>
						</View>
					</ScrollView>
				</View>
			</View>
		);

		return profileContent;
	}
}

const mapStateToProps = (state) => ({
	login: state.login,
	debts: state.debts,
	history: state.history,
	loading: state.loading
});

export default connect(mapStateToProps, {
	fetchDebts,
	fetchExpensiveProducts,
	fetchLatestProducts,
	fetchPopularProducts
})(Profile);

const styles = StyleSheet.create({
	preloaderContainer: {
		flex: 1,
		width: 100 + '%',
		height: 100 + '%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.lightGrey
	},
	preloaderIcon: {
		fontSize: 64,
		color: colors.purple
	},
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
	}
});
