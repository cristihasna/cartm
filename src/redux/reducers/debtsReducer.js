import { UPDATE_DEBTS } from '../actions/types';

const initialState = null;

export default function(state = initialState, action) {
	switch (action.type) {
		case UPDATE_DEBTS:
			return action.debts;
		default:
			return state;
	}
}
