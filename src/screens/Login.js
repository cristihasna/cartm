import React, { Component } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, ScrollView, TouchableOpacity, ToastAndroid } from 'react-native';
import { facebookLogin, googleLogin, emailLogin } from '../lib';
import { Logo, HorizontalSeparator, SocialLoginButton, CredentialInput } from '../components';
import { loginUser } from '../redux/actions/loginActions';
import { fetchSession } from '../redux/actions/sessionActions';
import { connect } from 'react-redux';

import colors from '../style/colors';

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			highlighted: {
				email: false,
				password: false
			}
		};
	}

	_loginUser(data) {
		this.props.loginUser(data);
		this.props.fetchSession(this.props.navigation);
		this.props.navigation.navigate('AppNavigator');
	}

	_initRegistrationScreen(email, password, showMessage) {
		this.props.navigation.navigate('Register', { email, password, showMessage });
	}

	_showToast(message) {
		ToastAndroid.showWithGravityAndOffset(message, ToastAndroid.SHORT, ToastAndroid.BOTTOM, 0, 20);
	}

	handleSocialLogin(signinProvider) {
		this.setState({ loading: true });
		signinProvider().then((data) => this._loginUser(data)).catch((data) => {
			console.log(data);
			if (data.code === 'auth/account-exists-with-different-credential')
				alert(
					'Your email address is listed using a different sign in method. Please use the same sign in method'
				);
			this.setState({ loading: false });
		});
	}

	handleEmailLogin() {
		this.setState({ loading: true });
		const email = this.emailField.value;
		const password = this.passField.value;
		let highlighted = {
			email: false,
			password: false
		};
		if (!email || !password) {
			highlighted.email = highlighted.password = true;
			this.setState({ highlighted });
			this._showToast('Fields must not pe empty');
			this.setState({ loading: false });
			return;
		}
		emailLogin(email, password).then((data) => this._loginUser(data)).catch((data) => {
			this.setState({ loading: false });
			if (data.code === 'auth/invalid-email') {
				highlighted.email = true;
				this._showToast('Email is invalid');
			} else if (data.code === 'auth/wrong-password') {
				highlighted.password = true;
				this._showToast('Wrong password');
			} else if (data.code === 'auth/user-not-found') {
				highlighted.email = false;
				highlighted.password = false;
				this._showToast('Email is not registered');
				this._initRegistrationScreen(email, password, true);
				return;
			} else if (data.code === 'auth/user-disabled') {
				highlighted.email = true;
				highlighted.password = true;
				this._showToast('Account disabled');
			}
			this.setState({ highlighted });
		});
	}

	render() {
		return (
			<View style={styles.container}>
				<KeyboardAvoidingView style={styles.wrapper} enabled>
					<ScrollView showsVerticalScrollIndicator={false}>
						<View style={styles.logoContainer}>
							<Logo />
						</View>
						<View style={{ paddingHorizontal: 20 }}>
							<View style={styles.descriptionContainer}>
								<Text style={styles.description}>
									Keep track of your shopping cart, or share it with your friends by creating private
									rooms.
								</Text>
								<Text style={styles.description}>
									Start by <Text style={styles.descriptionAccent}>signing up</Text>.
								</Text>
							</View>
							<View>
								<SocialLoginButton
									title="continue with Facebook"
									iconName="facebook-f"
									color={colors.facebookColor}
									onClick={this.handleSocialLogin.bind(this, facebookLogin)}
									loading={this.state.loading}
								/>
								<SocialLoginButton
									style={{ marginTop: 10 }}
									title="continue with Google"
									iconName="google"
									color={colors.googleColor}
									onClick={this.handleSocialLogin.bind(this, googleLogin)}
									loading={this.state.loading}
								/>
							</View>
						</View>
						<HorizontalSeparator
							lineColor={colors.purple}
							text={'via email'}
							bgColor={colors.lightGrey}
							textColor={colors.darkPurple}
						/>
						<View style={{ paddingHorizontal: 20 }}>
							<CredentialInput
								ref={(ref) => (this.emailField = ref)}
								icon={'envelope'}
								placeholder={'your.email@site.com'}
								highlighted={this.state.highlighted.email}
								defaultValue={this.props.navigation.getParam('email', '')}
								type={'email'}
							/>
							<CredentialInput
								ref={(ref) => (this.passField = ref)}
								icon={'key'}
								placeholder={'password'}
								type={'password'}
								highlighted={this.state.highlighted.password}
							/>
							<View style={styles.submitButtons}>
								<TouchableOpacity activeOpacity={0.8} onPress={this.handleEmailLogin.bind(this)}>
									<Text style={styles.loginButtonText}>Login</Text>
								</TouchableOpacity>
								<Text style={styles.buttonsSeparator}>|</Text>
								<TouchableOpacity activeOpacity={0.8} onPress={() => this._initRegistrationScreen()}>
									<Text style={styles.registerButtonText}>Register</Text>
								</TouchableOpacity>
							</View>
						</View>
					</ScrollView>
				</KeyboardAvoidingView>
			</View>
		);
	}
}

export default connect(null, { loginUser, fetchSession })(Login);

const styles = StyleSheet.create({
	container: {
		width: 100 + '%',
		height: 100 + '%',
		backgroundColor: colors.lightGrey
	},
	wrapper: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		flex: 1
	},
	logoContainer: {
		paddingHorizontal: 10
	},
	descriptionContainer: {
		marginBottom: 30
	},
	description: {
		width: 100 + '%',
		textAlign: 'center',
		color: colors.darkPurple,
		fontSize: 18
	},
	descriptionAccent: {
		color: colors.purple,
		fontWeight: 'bold',
		textDecorationLine: 'underline'
	},
	submitButtons: {
		height: 35,
		marginTop: 30,
		flex: 1,
		justifyContent: 'center',
		flexDirection: 'row',
		width: 100 + '%'
	},
	loginButtonText: {
		color: colors.white,
		fontSize: 18,
		backgroundColor: colors.purple,
		textAlign: 'center',
		height: 35,
		lineHeight: 40,
		paddingHorizontal: 30
	},
	buttonsSeparator: {
		height: 35,
		lineHeight: 40,
		marginHorizontal: 10,
		fontSize: 20,
		color: colors.darkGrey
	},
	registerButtonText: {
		color: colors.black,
		fontSize: 16,
		height: 35,
		lineHeight: 40
	}
});
