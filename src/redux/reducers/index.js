import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import sessionReducer from './sessionReducer';
import loadingReducer from './loadingReducer';

export default combineReducers({
    login: loginReducer,
    session: sessionReducer,
    loading: loadingReducer
})