import React, { Component } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, ScrollView, TouchableOpacity } from 'react-native';

import { Logo, HorizontalSeparator, SocialLoginButton, CredentialInput } from '../components';

import colors from '../style/colors';

export default class Login extends Component {
	constructor(props) {
		super(props);
	}

	handleFacebookLogin() {
		console.log('Facebook login handler');
	}

	handleGoogleLogin() {
		console.log('Google login handler');
	}

	handleSubmit() {
		const email = this.emailField.value;
		const pass = this.passField.value;
		console.log({email, pass});
		console.log('Submit button handler');
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
									title="log in with Facebook"
									iconName="facebook-f"
									color={colors.facebookColor}
									onClick={this.handleFacebookLogin.bind(this)}
								/>
								<SocialLoginButton
									style={{ marginTop: 10 }}
									title="log in with Google"
									iconName="google"
									color={colors.googleColor}
									onClick={this.handleGoogleLogin.bind(this)}
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
								defaultValue={'your.email@site.com'}
							/>
							<CredentialInput
								ref={(ref) => (this.passField = ref)}
								icon={'key'}
								defaultValue={'password'}
								secure={true}
							/>
							<View style={styles.submitButton}>
								<TouchableOpacity activeOpacity={0.8} onPress={this.handleSubmit.bind(this)}>
									<Text style={styles.submitButtonText}>Login / Signup</Text>
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
		marginBottom: 30
	},
	description: {
		width: 100 + '%',
		textAlign: 'center',
		color: colors.darkPurple,
		fontSize: 14
	},
	descriptionAccent: {
		color: colors.purple,
		fontWeight: 'bold',
		textDecorationLine: 'underline'
	},
	submitButton: {
		height: 35,
		marginTop: 20,
		alignItems: 'center'
	},
	submitButtonText: {
		color: colors.white,
		fontSize: 18,
		backgroundColor: colors.purple,
		textAlign: 'center',
		height: 35,
		lineHeight: 35,
		paddingHorizontal: 30
	}
});
