import { LOGIN_USER, LOGOUT_USER } from './types';
import { fetchSession } from '../actions/sessionActions';

export const loginUser = (loginData) => (dispatch) => {
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
