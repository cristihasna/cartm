import firebase from 'react-native-firebase';
import normalize from './normalizeUserData';

// Calling the following function will open the FB login dialogue:
export default function emailRegister(email, password) {
	return new Promise((resolve, reject) => {
		// create user with given username and password
		firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
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
