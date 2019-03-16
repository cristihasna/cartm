import {LOGIN_USER, LOGOUT_USER} from './types';

export const loginUser = loginData => dispatch => {
    dispatch({
        type: LOGIN_USER,
        loginData
    })
}

export const logoutUser = () => dispatch => {
    dispatch({
        type: LOGOUT_USER
    })
}