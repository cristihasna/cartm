import React, { Component } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableOpacity, ToastAndroid } from 'react-native';
import { Logo, HorizontalSeparator, CredentialInput } from '../components';
import { emailRegister } from '../lib';
import colors from '../style/colors';

export default class Register extends Component {
	static navigationOptions = {
		title: 'Register',
		headerStyle: {
			backgroundColor: colors.white
		},
		headerTintColor: colors.purple
	};

	constructor(props) {
		super(props);
		const showMessage = this.props.navigation.getParam('showMessage', false);
		const message = showMessage ? 'Your email is not currently registered. Register a new account' : '';
		this.state = {
			showMessage,
			message,
			highlighted: {
				email: false,
				password: false,
				confirmPassword: false
			}
		};
	}

	_showToast(message) {
		ToastAndroid.showWithGravityAndOffset(message, ToastAndroid.SHORT, ToastAndroid.BOTTOM, 0, 20);
	}

	handleSubmit() {
		const email = this.emailField.value;
		const password = this.passField.value;
		const confirmPassword = this.confirmPassField.value;

		let highlighted = {
			email: false,
			password: false,
			confirmPassword: false
		};

		if (!email || !password || !confirmPassword) {
			highlighted.email = highlighted.password = highlighted.confirmPassword = true;
			this._showToast('Fields must not be empty');
			this.setState({ highlighted });
			return;
		}
		if (confirmPassword !== password) {
			highlighted.password = highlighted.confirmPassword = true;
			this._showToast("Passwords don't match");
			this.setState({ highlighted });
			return;
		}

		emailRegister(email, password)
			.then((data) => this.props.navigation.navigate('Home'))
			.catch((err) => {
				const showMessage = true;
				let message = '';
				if (err.code === 'auth/email-already-in-use') {
					highlighted.email = true;
					message = 'This email is already in use. Log in with your password in the login screen.';
				} else if (err.code === 'auth/auth/invalid-email') {
					highlighted.email = true;
					message = 'Please check the email, it appears to be invalid';
				} else if (err.code === 'auth/weak-password') {
					highlighted.password = true;
					highlighted.confirmPassword = true;
					message = 'Your password is to weak. Try a stronger password';
				}
				this.passField.value = '';
				this.confirmPassField.value = '';

				this.setState({ showMessage, message, highlighted });
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
						{this.state.showMessage ? (
							<View style={{ paddingHorizontal: 20 }}>
								<View style={styles.descriptionContainer}>
									<Text style={styles.description}>{this.state.message}</Text>
								</View>
							</View>
						) : null}
						<HorizontalSeparator
							lineColor={colors.purple}
							text={'Email address and password'}
							bgColor={colors.lightGrey}
							textColor={colors.darkPurple}
						/>
						<View style={{ paddingHorizontal: 20 }}>
							<CredentialInput
								ref={(ref) => (this.emailField = ref)}
								icon={'envelope'}
								defaultValue={this.props.navigation.getParam('email', '')}
								type={'email'}
								highlighted={this.state.highlighted.email}
							/>
							<CredentialInput
								ref={(ref) => (this.passField = ref)}
								icon={'key'}
								defaultValue={this.props.navigation.getParam('password', '')}
								type={'password'}
								highlighted={this.state.highlighted.password}
							/>
						</View>
						<HorizontalSeparator
							lineColor={colors.purple}
							text={'Confirm password'}
							bgColor={colors.lightGrey}
							textColor={colors.darkPurple}
						/>
						<View style={{ paddingHorizontal: 20 }}>
							<CredentialInput
								ref={(ref) => (this.confirmPassField = ref)}
								icon={'key'}
								placeholder={'confirm password'}
								type={'password'}
								highlighted={this.state.highlighted.confirmPassword}
							/>
						</View>
						<View style={{ paddingHorizontal: 20 }}>
							<View style={styles.submitButtons}>
								<TouchableOpacity activeOpacity={0.8} onPress={this.handleSubmit.bind(this)}>
									<Text style={styles.loginButtonText}>Register</Text>
								</TouchableOpacity>
							</View>
						</View>
					</ScrollView>
				</KeyboardAvoidingView>
			</View>
		);
	}
}

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
		marginTop: -20,
		marginBottom: 10
	},
	description: {
		width: 100 + '%',
		textAlign: 'center',
		color: colors.darkPurple,
		fontSize: 18
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
	}
});
