import firebase from 'react-native-firebase';
import normalize from './normalizeUserData';
// Calling the following function will open the FB login dialogue:
export default function emailLogin(email, password) {
	return new Promise((resolve, reject) => {
		const credential = firebase.auth.EmailAuthProvider.credential(email, password);

		//sign in with credential
		firebase
			.auth()
			.signInWithCredential(credential)
			.then((credentials) => {
				const loginData = normalize({
					email: credentials.user.email,
					displayName: credentials.user.displayName,
					profileImg: credentials.user.photoURL
				});
				resolve(loginData);
			})
			.catch((err) => reject(err));
	});
}
