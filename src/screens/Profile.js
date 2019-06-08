import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MenuButton, User, ProfileSection, SpinningIcon } from '../components';
import { connect } from 'react-redux';
import colors from '../style/colors';
import { fetchDebts } from '../redux/actions/debtsActions';
import { fetchPopularProducts, fetchExpensiveProducts, fetchLatestProducts } from '../redux/actions/historyActions';

class Profile extends Component {
	componentDidMount() {
		if (!this.props.debts) this.props.fetchDebts();
		if (!this.props.history.monthly.popular) this.props.fetchPopularProducts('monthly');
		if (!this.props.history.monthly.latest) this.props.fetchLatestProducts('monthly');
		if (!this.props.history.monthly.expensive) this.props.fetchExpensiveProducts('monthly');
	}

	render() {
		const preloader = (
			<View style={styles.preloaderContainer}>
				<SpinningIcon cycleTime={1000} name="circle-notch" style={styles.preloaderIcon} />
			</View>
		);
		let owedBy = 0;
		let owedTo = 0;
		let spentThisMonth = 0;

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
		const profileContent = (
			<View style={styles.container}>
				<View style={styles.headerContainer}>
					<MenuButton onPress={this.props.navigation.toggleDrawer} logo />
				</View>
				<View style={styles.contentWrapper}>
					<ScrollView style={styles.scrollView}>
						<View style={styles.userContainer}>
							<User data={this.props.login} />
						</View>
						<ProfileSection
							heading={[
								{ title: 'You owe:', right: owedBy.toFixed(2) },
								{ title: 'You are owed:', right: owedTo.toFixed(2) }
							]}
							buttonLabel="more details"
							buttonAction={() => console.warn('debts')}
						/>
						<ProfileSection
							heading={{ title: 'Total spent this month:', right: spentThisMonth.toFixed(2) }}
							buttonLabel="view expenses"
							buttonAction={() => console.warn('expenses')}
						/>
						<ProfileSection
							heading={{ title: 'Your most popular products' }}
							buttonLabel="view more"
							buttonAction={() => console.warn('view more popular products')}>
							<Text>Hello</Text>
						</ProfileSection>
                        <ProfileSection
							heading={{ title: 'History' }}
							buttonLabel="view more"
							buttonAction={() => console.warn('view more history')}>
							<Text>Hello</Text>
						</ProfileSection>
					</ScrollView>
				</View>
			</View>
		);

		if (this.props.loading) return preloader;
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
		padding: 20,
		flex: 1
	}
});
