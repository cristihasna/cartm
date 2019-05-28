import { UPDATE_SESSION, LEAVE_SESSION, LOADING_STATE_CHANGE } from './types';
import { API_BASE_URL } from 'react-native-dotenv';
import { ToastAndroid } from 'react-native';
import firebase from 'react-native-firebase';

console.log(`${API_BASE_URL} is the actual api base url`);

export const createSession = (navigation) => async (dispatch) => {
	// set loading true
	dispatch({ type: LOADING_STATE_CHANGE, loading: true });

	// get user email and IDToken
	const user = firebase.auth().currentUser;
	const IDToken = await user.getIdToken();
	const url = `${API_BASE_URL}/sessions/${user.email}/create`;

	// POST to /sessions/{user email} to create a new session
	console.log(`[POST] ${url}`);
	fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${IDToken}`
		}
	}) /*workaround to save the status code */
		.then((res) => res.json().then((data) => ({ status: res.status, body: data })))
		.then((res) => {
			if (res.status === 200) dispatch({ type: UPDATE_SESSION, sessionData: res.body });
			else throw Error(res.body.data);
			if (navigation) navigation.navigate('CurrentSession');
		})
		.catch((err) => {
			ToastAndroid.show(err.toString(), ToastAndroid.LONG);
		});

	// set loading false
	dispatch({ type: LOADING_STATE_CHANGE, loading: false });
};

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
			'Accepts': 'application/json'
		}
	})
		.then((res) => res.json().then((data) => ({status: res.status, body: data})))
		.then((res) => {
			if (res.status === 200)
				dispatch({ type: UPDATE_SESSION, sessionData: res.body });
			else throw Error(res.body.message);
		})
		.catch((err) => {
			ToastAndroid.show(err.toString(), ToastAndroid.LONG);
		});

	// set loading false
	dispatch({ type: LOADING_STATE_CHANGE, loading: false });
};

export const fetchSession = () => async (dispatch) => {
	// set loading true
	dispatch({ type: LOADING_STATE_CHANGE, loading: true });

	// get user email and IDToken
	const user = firebase.auth().currentUser;
	const IDToken = await user.getIdToken();
	const url = `${API_BASE_URL}/sessions/${user.email}`;

	// GET to /sessions/{user email} to fetch the current session
	console.log(`[GET] ${url}`);
	fetch(url, {
		headers: {
			Authorization: `Bearer ${IDToken}`
		}
	})
		.then((res) => res.json().then(data => ({status: res.status, body: data})))
		.then((res) => {
			if (res.status !== 200) throw Error(res.body.message);
			dispatch({ type: UPDATE_SESSION, sessionData: res.body });
		})
		.catch((err) => {
			ToastAndroid.show(err.toString(), ToastAndroid.LONG);
		});

	// set loading false
	dispatch({ type: LOADING_STATE_CHANGE, loading: false });
};

export const leaveSession = (navigation) => async (dispatch) => {
	// set loading true
	dispatch({ type: LOADING_STATE_CHANGE, loading: true });

	// get user email and IDToken
	const user = firebase.auth().currentUser;
	const IDToken = await user.getIdToken();
	const url = `${API_BASE_URL}/sessions/${user.email}/participants/${user.email}`;

	// DELETE to /sessions/{user email} to leave the current session
	console.log(`[DELETE] ${url}`);
	fetch(url, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${IDToken}`
		}
	})
		.then((res) => res.json().then(data => ({status: res.status, body: data})))
		.then((res) => {
			if (res.status !== 200) throw Error(res.body.message);
			dispatch({ type: LEAVE_SESSION });
			if (navigation) navigation.navigate('Home');
		})
		.catch((err) => {
			ToastAndroid.show(err.toString(), ToastAndroid.LONG);
		});

	// set loading false
	dispatch({ type: LOADING_STATE_CHANGE, loading: false });
};
