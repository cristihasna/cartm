import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import sessionReducer from './sessionReducer';

export default combineReducers({
    login: loginReducer,
    session: sessionReducer
})