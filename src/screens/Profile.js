import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MenuButton, User, ProfileSection } from '../components';
import { connect } from 'react-redux';
import colors from '../style/colors';

class Profile extends Component {
	render() {
		const owe = '0.00';
		const owed = '0.00';
		return (
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
							heading={[ { title: 'You owe:', right: owe }, { title: 'You are owed:', right: owed } ]}
							buttonLabel="more details"
							buttonAction={() => console.warn('debts')}
						/>
						<ProfileSection
							heading={{ title: 'Total spent this month:', right: '9.92' }}
							buttonLabel="view expenses"
							buttonAction={() => console.warn('expenses')}
						/>
						<ProfileSection
							heading={{ title: 'Your most popular products' }}
							buttonLabel="view more"
							buttonAction={() => console.warn('view more popular products')}>
							<Text>Hello</Text>
						</ProfileSection>
					</ScrollView>
				</View>
			</View>
		);
	}
}

const mapStateToProps = (state) => ({
	login: state.login,
	debts: state.debts,
	history: state.history,
	loading: state.loading
});

export default connect(mapStateToProps)(Profile);

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
		padding: 20,
		flex: 1
	}
});
