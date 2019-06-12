import { LOGIN_USER, LOGOUT_USER } from './types';
import { fetchSession } from '../actions/sessionActions';
import { updateRegistrationToken } from './deviceActions';

export const loginUser = (loginData) => (dispatch) => {
	updateRegistrationToken().then(() => {});
	dispatch({
		type: LOGIN_USER,
		loginData
	});
};

export const logoutUser = () => (dispatch) => {
	dispatch({
		type: LOGOUT_USER
	});
};
