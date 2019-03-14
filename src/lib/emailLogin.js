import firebase from 'react-native-firebase';

// Calling the following function will open the FB login dialogue:
export default function emailLogin(email, password) {
	return new Promise((resolve, reject) => {
		const credential = firebase.auth.EmailAuthProvider.credential(email, password);

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
					.catch((err) => reject(err))
			)
			.catch((err) => reject(err));
	});
}
