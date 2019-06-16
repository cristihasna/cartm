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
			if (res.status === 201) dispatch({ type: UPDATE_SESSION, sessionData: res.body });
			else if (res.status !== 400) throw Error(res.body.message);
			if (navigation) navigation.navigate('CurrentSession');
			// set loading false
			dispatch({ type: LOADING_STATE_CHANGE, loading: false });
		})
		.catch((err) => {
			ToastAndroid.show(err.toString(), ToastAndroid.LONG);
			// set loading false
			dispatch({ type: LOADING_STATE_CHANGE, loading: false });
		});
};

export const addParticipantToSession = (email) => async (dispatch) => {
	// set loading true
	dispatch({ type: LOADING_STATE_CHANGE, loading: true });

	
	// get user email and IDToken
	const user = firebase.auth().currentUser;
	const IDToken = await user.getIdToken();
	const url = `${API_BASE_URL}/sessions/${user.email}/participants/`;

	// POST to /sessions/{user email}/participants to add a new participant to the session
	console.log(`[POST] ${url}`);
	fetch(url, {
		method: 'POST',
		body: JSON.stringify({ email }),
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

export const removeParticipantFromSession = (email) => async (dispatch) => {
	// set loading true
	dispatch({ type: LOADING_STATE_CHANGE, loading: true });

	// get user email and IDToken
	const user = firebase.auth().currentUser;
	const IDToken = await user.getIdToken();
	const url = `${API_BASE_URL}/sessions/${user.email}/participants/${email}`;

	// DELETE to /sessions/{user email}/participants/{participant email} to remove the session
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

export const setParticipantPayment = (email, payment) => async (dispatch) => {
	// set loading true
	dispatch({ type: LOADING_STATE_CHANGE, loading: true });

	// get user email and IDToken
	const user = firebase.auth().currentUser;
	const IDToken = await user.getIdToken();
	const url = `${API_BASE_URL}/sessions/${user.email}/participants/${email}/payment`;

	// POST to /sessions/{user email}/participants/{participant email} to add user payment
	console.log(`[POST] ${url}`);
	fetch(url, {
		body: JSON.stringify({ payment }),
		method: 'POST',
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

export const fetchSession = (navigation) => async (dispatch) => {
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
		.then((res) => res.json().then((data) => ({ status: res.status, body: data })))
		.then((res) => {
			if (res.status === 200) {
				dispatch({ type: UPDATE_SESSION, sessionData: res.body });
				if (navigation) navigation.navigate('CurrentSession');
			} else if (res.status !== 404) throw Error(res.body.message);
			// set loading false
			dispatch({ type: LOADING_STATE_CHANGE, loading: false });
		})
		.catch((err) => {
			ToastAndroid.show(err.toString(), ToastAndroid.LONG);
			// set loading false
			dispatch({ type: LOADING_STATE_CHANGE, loading: false });
		});
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
		.then((res) => res.json().then((data) => ({ status: res.status, body: data })))
		.then((res) => {
			if (res.status !== 200) throw Error(res.body.message);
			dispatch({ type: LEAVE_SESSION });
			if (navigation) navigation.navigate('Home');
			// set loading false
			dispatch({ type: LOADING_STATE_CHANGE, loading: false });
		})
		.catch((err) => {
			ToastAndroid.show(err.toString(), ToastAndroid.LONG);
			// set loading false
			dispatch({ type: LOADING_STATE_CHANGE, loading: false });
		});
};

export const endSession = (navigation) => async (dispatch) => {
	// set loading true
	dispatch({type: LOADING_STATE_CHANGE, loading: true});
	// get user email and IDToken
	const user = firebase.auth().currentUser;
	const IDToken = await user.getIdToken();
	const url = `${API_BASE_URL}/sessions/${user.email}/end`;

	// DELETE to /sessions/{user email} to leave the current session
	console.log(`[POST] ${url}`);
	fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${IDToken}`
		}
	})
		.then((res) => res.json().then((data) => ({ status: res.status, body: data })))
		.then((res) => {
			if (res.status !== 200) throw Error(res.body.message);
			dispatch({ type: LEAVE_SESSION });
			if (navigation) navigation.navigate('Home');
			// set loading false
			dispatch({ type: LOADING_STATE_CHANGE, loading: false });
		})
		.catch((err) => {
			ToastAndroid.show(err.toString(), ToastAndroid.LONG);
			// set loading false
			dispatch({ type: LOADING_STATE_CHANGE, loading: false });
		});
}
