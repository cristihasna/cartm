import { LOADING_STATE_CHANGE, RESET_RECEIPT, UPDATE_RECEIPT } from './types';
import { API_BASE_URL } from 'react-native-dotenv';
import { ToastAndroid, AsyncStorage } from 'react-native';
import firebase from 'react-native-firebase';
import UUID from 'react-native-uuid';

export const resetReceipt = () => async (dispatch) => {
	const { displayName, photoURL, email } = firebase.auth().currentUser;

	const newParticipant = {
		payed: 0,
		debt: 0,
		isHost: true,
		_id: UUID.v1(),
		profile: {
			displayName,
			photoURL,
			email
		},
		email
	};

	AsyncStorage.multiSet([
		[ 'rProducts', JSON.stringify([]) ],
		[ 'rParticipants', JSON.stringify([ newParticipant ]) ]
	])
		.then(() => {
			dispatch({ type: RESET_RECEIPT, hostParticipant: newParticipant});
		})
		.catch((err) => console.log(err));
};

export const updateReceipt = (receipt) => async (dispatch) => {
	dispatch({ type: UPDATE_RECEIPT, receiptData: receipt });
};

export const endReceipt = (receipt, navigation) => async (dispatch) => {
	// set loading true
	dispatch({ type: LOADING_STATE_CHANGE, loading: true });
	// get user email and IDToken
	const user = firebase.auth().currentUser;
	const IDToken = await user.getIdToken();
	const url = `${API_BASE_URL}/receipts/`;

	// POST to /receipts
	console.log(`[POST] ${url}`);
	fetch(url, {
		method: 'POST',
		body: JSON.stringify({ products: receipt.products, participants: receipt.participants }),
		headers: {
			Authorization: `Bearer ${IDToken}`,
			'Content-Type': 'application/json',
			Accepts: 'application/json'
		}
	})
		.then((res) => res.json().then((data) => ({ status: res.status, body: data })))
		.then((res) => {
			if (res.status !== 200) throw Error(res.body.message);
			resetReceipt()(dispatch).then(() => {
				// set loading false
				dispatch({ type: LOADING_STATE_CHANGE, loading: false });
				navigation.navigate('Receipt');
			});
		})
		.catch((err) => {
			ToastAndroid.show(err.toString(), ToastAndroid.LONG);
			// set loading false
			dispatch({ type: LOADING_STATE_CHANGE, loading: false });
		});
};
