import { UPDATE_HISTORY_BOUNDINGS, UPDATE_HISTORY_PRODUCTS, LOADING_STATE_CHANGE } from './types';
import { ToastAndroid } from 'react-native';
import fetchHistory from '../../lib/fetchHistory';
import { PROFILE_HISTORY_LIMIT } from 'react-native-dotenv';

export const HistoryKind = {
	MONTHLY: 'monthly',
	CUSTOM: 'custom'
};

export const fetchPopularProducts = (kind, limit, beginDate, endDate) => async (dispatch) => {
	// set loading true
	dispatch({ type: LOADING_STATE_CHANGE, loading: true });
	if (kind === HistoryKind.MONTHLY) {
		const now = new Date();
		beginDate = new Date(now.getFullYear(), now.getMonth());
		endDate = new Date();
	}

	try {
		const products = await fetchHistory('popular', limit || PROFILE_HISTORY_LIMIT || 3, beginDate, endDate);
		dispatch({ type: UPDATE_HISTORY_PRODUCTS, products: { popular: products }, kind });
	} catch (err) {
		ToastAndroid.show(err.toString(), ToastAndroid.LONG);
	}
	// set loading false
	dispatch({ type: LOADING_STATE_CHANGE, loading: false });
};

export const fetchExpensiveProducts = (kind, limit, beginDate, endDate) => async (dispatch) => {
	// set loading true
	dispatch({ type: LOADING_STATE_CHANGE, loading: true });

	if (kind === HistoryKind.MONTHLY) {
		const now = new Date();
		beginDate = new Date(now.getFullYear(), now.getMonth());
		endDate = new Date();
	}

	try {
		const products = await fetchHistory('price', limit || PROFILE_HISTORY_LIMIT || 3, beginDate, endDate);
		dispatch({ type: UPDATE_HISTORY_PRODUCTS, products: { expensive: products }, kind });
	} catch (err) {
		ToastAndroid.show(err.toString(), ToastAndroid.LONG);
	}
	// set loading false
	dispatch({ type: LOADING_STATE_CHANGE, loading: false });
};

export const fetchLatestProducts = (kind, limit, beginDate, endDate) => async (dispatch) => {
	// set loading true
	dispatch({ type: LOADING_STATE_CHANGE, loading: true });

	if (kind === HistoryKind.MONTHLY) {
		const now = new Date();
		beginDate = new Date(now.getFullYear(), now.getMonth());
		endDate = new Date();
	}

	try {
		const products = await fetchHistory('date', limit || PROFILE_HISTORY_LIMIT || 3, beginDate, endDate);
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
