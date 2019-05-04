import { UPDATE_SESSION, LEAVE_SESSION, LOADING_STATE_CHANGE } from './types';
import { API_BASE_URL } from 'react-native-dotenv';
import { ToastAndroid } from 'react-native';
import firebase from 'react-native-firebase';

export const createSession = (navigation) => async (dispatch) => {
	// set loading true
	dispatch({ type: LOADING_STATE_CHANGE, loading: true });

	// get user email and IDToken
	const user = firebase.auth().currentUser;
	const IDToken = await user.getIdToken();
	const url = `${API_BASE_URL}/sessions/${user.email}/create?token=${IDToken}`;

	// POST to /sessions/{user email} to create a new session
	console.log(`[POST] ${url}`);
	fetch(url, { method: 'POST' })
		.then((res) => res.json())
		.then((data) => {
			if (data.message) throw Error(data.message);
			dispatch({ type: UPDATE_SESSION, sessionData: data });
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
	const url = `${API_BASE_URL}/sessions/${user.email}/products?token=${IDToken}`;

	// POST to /sessions/{user email}/products to add a new product to the session
	console.log(`[POST] ${url}`);
	fetch(url, { method: 'POST', body: JSON.stringify(product) })
		.then((res) => res.json())
		.then((data) => {
			if (data.message) throw Error(data.message);
			dispatch({ type: UPDATE_SESSION, sessionData: data });
			if (navigation) navigation.navigate('CurrentSession');
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
	const url = `${API_BASE_URL}/sessions/${user.email}?token=${IDToken}`;

	// GET to /sessions/{user email} to fetch the current session
	console.log(`[GET] ${url}`);
	fetch(url)
		.then((res) => res.json())
		.then((data) => {
			if (data && data.message) throw Error(data.message);
			dispatch({ type: UPDATE_SESSION, sessionData: data });
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
	const url = `${API_BASE_URL}/sessions/${user.email}/participants/${user.email}?token=${IDToken}`;

	// DELETE to /sessions/{user email} to leave the current session
	console.log(`[DELETE] ${url}`);
	fetch(url, { method: 'DELETE' })
		.then((res) => res.json())
		.then((data) => {
			if (data.message) throw Error(data.message);
			dispatch({ type: LEAVE_SESSION });
			if (navigation) navigation.navigate('Home');
		})
		.catch((err) => {
			ToastAndroid.show(err.toString(), ToastAndroid.LONG);
		});

	// set loading false
	dispatch({ type: LOADING_STATE_CHANGE, loading: false });
};
