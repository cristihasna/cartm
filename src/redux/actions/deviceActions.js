import firebase from 'react-native-firebase';
import { API_BASE_URL } from 'react-native-dotenv';
import { AsyncStorage } from 'react-native';

export const updateRegistrationToken = async () => {
	const user = firebase.auth().currentUser;
	const IDToken = await user.getIdToken();

    const url = `${API_BASE_URL}/register-device/${user.email}`;
    
    const registrationToken = await AsyncStorage.getItem('fcmToken');

    if (!registrationToken) return;
	// POST to /register-device/{user email} to register the registrationToken
	// in order to receive notifications
    
    console.log(`[POST] ${url}`);
	await fetch(url, {
		method: 'POST',
		body: JSON.stringify({ registrationToken }),
		headers: {
			Authorization: `Bearer ${IDToken}`,
			'Content-Type': 'application/json',
			Accepts: 'application/json'
		}
	});
};
