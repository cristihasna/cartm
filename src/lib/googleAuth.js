import { GoogleSignin } from 'react-native-google-signin';
import firebase from 'react-native-firebase';

export default function googleLogin() {
	return new Promise((resolve, reject) => {
		// configure google signin
		GoogleSignin.configure({
            webClientId: '774125276061-5fgkh5jua2nam88olmrg0q9mfqvc6s7g.apps.googleusercontent.com'
        });

		//request idToken and accessToken from Google
		GoogleSignin.signIn()
			.then((data) => {
				//obtain credential frin firebase using idToken and accessToken from Google
				const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);

				//sign in with obtained credential
				firebase
					.auth()
					.signInWithCredential(credential)
					.then((credentials) => {
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
							.catch((err) => reject(err));
					})
					.catch((err) => reject(err));
			})
			.catch((err) => reject(err));
	});
}
