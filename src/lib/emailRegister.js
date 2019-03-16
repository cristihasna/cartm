import firebase from 'react-native-firebase';

// Calling the following function will open the FB login dialogue:
export default function emailRegister(email, password) {
	return new Promise((resolve, reject) => {

        // create user with given username and password
		firebase
			.auth()
			.createUserWithEmailAndPassword(email, password)
			.then((credentials) => {
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
	});
}
