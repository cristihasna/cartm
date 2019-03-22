import { LOGIN_USER, LOGOUT_USER } from '../actions/types';

const initialState = null

export default function(state = initialState, action) {
	switch (action.type) {
		case LOGIN_USER:
			return action.loginData;
		case LOGOUT_USER:
            return null;
        default:
            return state
	}
}
