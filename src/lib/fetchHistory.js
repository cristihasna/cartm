import { API_BASE_URL } from 'react-native-dotenv';
import firebase from 'react-native-firebase';

export default async (sort, limit, beginDate, endDate) => {
	// get user email and IDToken
	const user = firebase.auth().currentUser;
	const IDToken = await user.getIdToken();
	let url = `${API_BASE_URL}/history/${user.email}/products?sort=${sort}`;
	if (limit !== undefined) url += `&limit=${limit}`;
	if (beginDate) url += `&beginDate=${beginDate}`;
	if (endDate) url += `&endDate=${endDate}`;

	// GET to /history/{user email}/products to add a new product to the session
	console.log(`[GET] ${url}`);
	return fetch(url, {
		headers: {
			Authorization: `Bearer ${IDToken}`,
			'Content-Type': 'application/json',
			Accepts: 'application/json'
		}
	})
		.then((res) => res.json().then((data) => ({ status: res.status, body: data })))
		.then((res) => {
			if (res.status === 200) return res.body;
			else throw Error(res.body.message);
		});
};
