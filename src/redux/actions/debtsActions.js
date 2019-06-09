import firebase from 'react-native-firebase';
import { ToastAndroid } from 'react-native';
import { UPDATE_DEBTS, LOADING_STATE_CHANGE } from './types';
import { API_BASE_URL } from 'react-native-dotenv';

export const fetchDebts = () => async (dispatch) => {
	// set loading true
	dispatch({ type: LOADING_STATE_CHANGE, loading: true });

	// get user email and IDToken
	const user = firebase.auth().currentUser;
	const IDToken = await user.getIdToken();
	const url = `${API_BASE_URL}/debts/`;

	// GET to /debts to add a new product to the session
	console.log(`[GET] ${url}`);
	fetch(url, {
		headers: {
			Authorization: `Bearer ${IDToken}`,
			'Content-Type': 'application/json',
			Accepts: 'application/json'
		}
	})
		.then((res) => res.json().then((data) => ({ status: res.status, body: data })))
		.then((res) => {
			if (res.status === 200) dispatch({ type: UPDATE_DEBTS, debts: res.body });
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

export const setDebtDeadline = (debt, deadline) => async (dispatch) => {
	// set loading true
	dispatch({ type: LOADING_STATE_CHANGE, loading: true });

	// get user email and IDToken
	const user = firebase.auth().currentUser;
	const IDToken = await user.getIdToken();
	const url = `${API_BASE_URL}/debts/${debt._id}`;

	// PATCH to /debts to add a new product to the session
	console.log(`[PATCH] ${url}`);
	fetch(url, {
		method: 'PATCH',
		body: JSON.stringify({ deadline }),
		headers: {
			Authorization: `Bearer ${IDToken}`,
			'Content-Type': 'application/json',
			Accepts: 'application/json'
		}
	})
		.then((res) => res.json().then((data) => ({ status: res.status, body: data })))
		.then((res) => {
			if (res.status !== 200) throw Error(res.body.message);
			// set loading false
			dispatch({ type: LOADING_STATE_CHANGE, loading: false });
		})
		.catch((err) => {
			ToastAndroid.show(err.toString(), ToastAndroid.LONG);
			// set loading false
			dispatch({ type: LOADING_STATE_CHANGE, loading: false });
		});
};

export const setDebtPayed = (debt) => async (dispatch) => {
	// set loading true
	dispatch({ type: LOADING_STATE_CHANGE, loading: true });

	// get user email and IDToken
	const user = firebase.auth().currentUser;
	const IDToken = await user.getIdToken();
	const url = `${API_BASE_URL}/debts/${debt._id}`;

	// PATCH to /debts to add a new product to the session
	console.log(`[PATCH] ${url}`);
	fetch(url, {
		method: 'PATCH',
		body: JSON.stringify({ payed: new Date() }),
		headers: {
			Authorization: `Bearer ${IDToken}`,
			'Content-Type': 'application/json',
			Accepts: 'application/json'
		}
	})
		.then((res) => res.json().then((data) => ({ status: res.status, body: data })))
		.then((res) => {
			if (res.status !== 200) throw Error(res.body.message);
			// set loading false
			dispatch({ type: LOADING_STATE_CHANGE, loading: false });
		})
		.catch((err) => {
			ToastAndroid.show(err.toString(), ToastAndroid.LONG);
			// set loading false
			dispatch({ type: LOADING_STATE_CHANGE, loading: false });
		});
};
