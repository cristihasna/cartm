import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import firebase from 'react-native-firebase';
import { SpinningIcon } from '../components';
import colors from '../style/colors';
import { loginUser } from '../redux/actions/loginActions';
import { fetchSession } from '../redux/actions/sessionActions';
import { connect } from 'react-redux';
import normalize from '../lib/normalizeUserData';

class Root extends Component {
	componentDidMount() {
		const user = firebase.auth().currentUser;
		if (user) this._loginUser(user);
		else this._navigateTo('LoginNavigator');
	}

	_navigateTo(route) {
		setTimeout(() => this.props.navigation.navigate(route), 500);
	}

	_loginUser(data) {
		let loginData = normalize({
			email: data.email,
			displayName: data.displayName,
			profileImg: data.photoURL || null
		});
		this.props.loginUser(loginData);
		this.props.fetchSession();
		this._navigateTo('AppNavigator');
	}

	render() {
		return (
			<View style={styles.container}>
				<SpinningIcon cycleTime={1000} name="circle-notch" style={styles.icon} />
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: 100 + '%',
		height: 100 + '%',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: colors.lightGrey
	},
	icon: {
		fontSize: 64,
		color: colors.purple
	}
});

const mapStateToProps = (state) => ({
	login: state.login
});

export default connect(mapStateToProps, { loginUser, fetchSession })(Root);
