import { AccessToken, LoginManager } from 'react-native-fbsdk';
import firebase from 'react-native-firebase';

// Calling the following function will open the FB login dialogue:
export default function facebookLogin() {
	return new Promise((resolve, reject) => {
		//request public profile and email permissions from facebook user
		LoginManager.logInWithReadPermissions([ 'public_profile', 'email' ])
			.then((result) => {
				// check if the user has canceled the login action
				if (result.isCancelled) reject({ status: 'canceled' });

				// obtain an access token from Facebook
				AccessToken.getCurrentAccessToken()
					.then((data) => {
						//obtain credential from Firebase using the accessToken from FB
						const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);

						//sign in with credential
						firebase
							.auth()
							.signInWithCredential(credential)
							.then((credentials) =>
								//obtain ID token used to verify login status on server
								firebase
									.auth()
									.currentUser.getIdToken(/*forceRefresh*/ true)
									.then((IDToken) => {
										resolve({
											status: 'ok',
											credentials,
											IDToken
										});
									})
									.catch((err) =>
										reject(err)
									)
							)
							.catch((err) => reject(err));
					})
					.catch((err) => reject(err));
			})
			.catch((err) => reject(err));
	});
}
