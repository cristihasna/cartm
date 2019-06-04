import { API_BASE_URL } from 'react-native-dotenv';
import firebase from 'react-native-firebase';

export default async (name) => {
	const user = firebase.auth().currentUser;
	const IDToken = await user.getIdToken();
	const url = `${API_BASE_URL}/products?name=${encodeURIComponent(name)}`;

	return fetch(url, {
		headers: {
			Authorization: `Bearer ${IDToken}`,
			'Content-Type': 'application/json',
			Accepts: 'application/json'
		}
	})
		.then((res) => {
			return res.json().then((data) => ({ status: res.status, body: data }));
		})
		.then((res) => {
			if (res.status === 200) return res.body;
			return null;
		})
		.catch((err) => {
			return null;
		});
};
