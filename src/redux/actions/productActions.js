import { UPDATE_SESSION, LOADING_STATE_CHANGE } from './types';
import { API_BASE_URL } from 'react-native-dotenv';
import { ToastAndroid } from 'react-native';
import firebase from 'react-native-firebase';

console.log();

export const addProduct = (product) => async (dispatch) => {
	// set loading true
	dispatch({ type: LOADING_STATE_CHANGE, loading: true });

	// get user email and IDToken
	const user = firebase.auth().currentUser;
	const IDToken = await user.getIdToken();
	const url = `${API_BASE_URL}/sessions/${user.email}/products`;

	// POST to /sessions/{user email}/products to add a new product to the session
	console.log(`[POST] ${url}`);
	fetch(url, {
		method: 'POST',
		body: JSON.stringify(product),
		headers: {
			Authorization: `Bearer ${IDToken}`,
			'Content-Type': 'application/json',
			Accepts: 'application/json'
		}
	})
		.then((res) => res.json().then((data) => ({ status: res.status, body: data })))
		.then((res) => {
			if (res.status === 200) dispatch({ type: UPDATE_SESSION, sessionData: res.body });
			else throw Error(res.body.message);
			// set loading false
			dispatch({ type: LOADING_STATE_CHANGE, loading: false });
		})
		.catch((err) => {
			ToastAndroid.show(err.toString(), ToastAndroid.LONG);
			// set loading false
			dispatch({ type: LOADING_STATE_CHANGE, loading: false });
		});
};

export const patchProduct = (product) => async (dispatch) => {
	// set loading true
	dispatch({ type: LOADING_STATE_CHANGE, loading: true });
	// get user email and IDToken
	const user = firebase.auth().currentUser;
	const IDToken = await user.getIdToken();
	const url = `${API_BASE_URL}/sessions/${user.email}/products/${product._id}`;

	// PATCH to /sessions/{user email}/products/{product id} to patch the product instance
	console.log(`[PATCH] ${url}`);
	fetch(url, {
		method: 'PATCH',
		body: JSON.stringify(product),
		headers: {
			Authorization: `Bearer ${IDToken}`,
			'Content-Type': 'application/json',
			Accepts: 'application/json'
		}
	})
		.then((res) => res.json().then((data) => ({ status: res.status, body: data })))
		.then((res) => {
			if (res.status === 200) dispatch({ type: UPDATE_SESSION, sessionData: res.body });
			else throw Error(res.body.message);

			// set loading false
			dispatch({ type: LOADING_STATE_CHANGE, loading: false });
		})
		.catch((err) => {
			ToastAndroid.show(err.toString(), ToastAndroid.LONG);

			// set loading false
			dispatch({ type: LOADING_STATE_CHANGE, loading: false });
		});
};

export const addParticipantToProduct = (product, participant) => async (dispatch) => {
	// set loading true
	dispatch({ type: LOADING_STATE_CHANGE, loading: true });

	// get user email and IDToken
	const user = firebase.auth().currentUser;
	const IDToken = await user.getIdToken();
	const url = `${API_BASE_URL}/sessions/${user.email}/products/${product._id}/participants`;

	// POST to /sessions/{user email}/products/{product ID}/participants
	// to add a new participant to the session
	console.log(`[POST] ${url}`);
	fetch(url, {
		method: 'POST',
		body: JSON.stringify({ participant }),
		headers: {
			Authorization: `Bearer ${IDToken}`,
			'Content-Type': 'application/json',
			Accepts: 'application/json'
		}
	})
		.then((res) => res.json().then((data) => ({ status: res.status, body: data })))
		.then((res) => {
			if (res.status === 200) dispatch({ type: UPDATE_SESSION, sessionData: res.body });
			else throw Error(res.body.message);
			// set loading false
			dispatch({ type: LOADING_STATE_CHANGE, loading: false });
		})
		.catch((err) => {
			ToastAndroid.show(err.toString(), ToastAndroid.LONG);
			// set loading false
			dispatch({ type: LOADING_STATE_CHANGE, loading: false });
		});

};

export const removeParticipantFromProduct = (product, participant) => async (dispatch) => {
	// set loading true
	dispatch({ type: LOADING_STATE_CHANGE, loading: true });

	// get user email and IDToken
	const user = firebase.auth().currentUser;
	const IDToken = await user.getIdToken();
	const url = `${API_BASE_URL}/sessions/${user.email}/products/${product._id}/participants/${participant}`;

	// DELETE to /sessions/{user email}/products/{product ID}/participants/{participant email}
	// to add a new participant to the session
	console.log(`[DELETE] ${url}`);
	fetch(url, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${IDToken}`,
			'Content-Type': 'application/json',
			Accepts: 'application/json'
		}
	})
		.then((res) => res.json().then((data) => ({ status: res.status, body: data })))
		.then((res) => {
			if (res.status === 200) dispatch({ type: UPDATE_SESSION, sessionData: res.body });
			else throw Error(res.body.message);
			// set loading false
			dispatch({ type: LOADING_STATE_CHANGE, loading: false });
		})
		.catch((err) => {
			ToastAndroid.show(err.toString(), ToastAndroid.LONG);
			// set loading false
			dispatch({ type: LOADING_STATE_CHANGE, loading: false });
		});
};

export const removeProduct = (product) => async (dispatch) => {
	// set loading true
	dispatch({ type: LOADING_STATE_CHANGE, loading: true });

	// get user email and IDToken
	const user = firebase.auth().currentUser;
	const IDToken = await user.getIdToken();
	const url = `${API_BASE_URL}/sessions/${user.email}/products/${product._id}`;

	// DELETE to /sessions/{user email}/products/{product ID} to add a new product to the session
	console.log(`[DELETE] ${url}`);
	fetch(url, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${IDToken}`,
			'Content-Type': 'application/json',
			Accepts: 'application/json'
		}
	})
		.then((res) => res.json().then((data) => ({ status: res.status, body: data })))
		.then((res) => {
			if (res.status === 200) dispatch({ type: UPDATE_SESSION, sessionData: res.body });
			else throw Error(res.body.message);
			// set loading false
			dispatch({ type: LOADING_STATE_CHANGE, loading: false });
		})
		.catch((err) => {
			ToastAndroid.show(err.toString(), ToastAndroid.LONG);
			// set loading false
			dispatch({ type: LOADING_STATE_CHANGE, loading: false });
		});
};
