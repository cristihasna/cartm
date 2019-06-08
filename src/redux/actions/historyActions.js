import { UPDATE_HISTORY_BOUNDINGS, UPDATE_HISTORY_PRODUCTS, LOADING_STATE_CHANGE } from './types';
import { ToastAndroid } from 'react-native';
import fetchHistory from '../../lib/fetchHistory';

export const fetchPopularProducts = (kind, beginDate, endDate) => async (dispatch) => {
	// set loading true
	dispatch({ type: LOADING_STATE_CHANGE, loading: true });

	if (kind === 'monthly') {
		const now = new Date();
		beginDate = new Date(now.getFullYear(), now.getMonth());
		endDate = new Date();
	}

	try {
		const products = await fetchHistory('popular', 3, beginDate, endDate);
		dispatch({ type: UPDATE_HISTORY_PRODUCTS, products: { popular: products }, kind });
	} catch (err) {
        console.log(err);
		ToastAndroid.show(err.toString(), ToastAndroid.LONG);
	}
	// set loading false
	dispatch({ type: LOADING_STATE_CHANGE, loading: false });
};

export const fetchExpensiveProducts = (kind, beginDate, endDate) => async (dispatch) => {
	// set loading true
	dispatch({ type: LOADING_STATE_CHANGE, loading: true });

	if (kind === 'monthly') {
		const now = new Date();
		beginDate = new Date(now.getFullYear(), now.getMonth());
		endDate = new Date();
	}

	try {
		const products = await fetchHistory('price', 3, beginDate, endDate);
		dispatch({ type: UPDATE_HISTORY_PRODUCTS, products: { expensive: products }, kind });
	} catch (err) {
		ToastAndroid.show(err.toString(), ToastAndroid.LONG);
	}
	// set loading false
	dispatch({ type: LOADING_STATE_CHANGE, loading: false });
};

export const fetchLatestProducts = (kind, beginDate, endDate) => async (dispatch) => {
	// set loading true
	dispatch({ type: LOADING_STATE_CHANGE, loading: true });

	if (kind === 'monthly') {
		const now = new Date();
		beginDate = new Date(now.getFullYear(), now.getMonth());
		endDate = new Date();
	}

	try {
		const products = await fetchHistory('date', 3, beginDate, endDate);
		dispatch({ type: UPDATE_HISTORY_PRODUCTS, products: { latest: products }, kind });
	} catch (err) {
		ToastAndroid.show(err.toString(), ToastAndroid.LONG);
	}
	// set loading false
	dispatch({ type: LOADING_STATE_CHANGE, loading: false });
};

export const updateHistoryBoundings = ({ beginDate, endDate }) => (dispatch) => {
	dispatch({ type: UPDATE_HISTORY_BOUNDINGS, boundings: { beginDate, endDate } });
};
