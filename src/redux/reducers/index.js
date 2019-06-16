import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import sessionReducer from './sessionReducer';
import loadingReducer from './loadingReducer';
import debtsReducer from './debtsReducer';
import historyReducer from './historyReducer';
import receiptReducer from './receiptReducer';

export default combineReducers({
    login: loginReducer,
    session: sessionReducer,
    loading: loadingReducer,
    debts: debtsReducer,
    history: historyReducer,
    receipt: receiptReducer
})