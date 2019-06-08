import { UPDATE_HISTORY_PRODUCTS, UPDATE_HISTORY_BOUNDINGS } from '../actions/types';

const getInitialState = () => ({
	popular: null,
	expensive: null,
	latest: null
});

const initialState = {
	monthly: getInitialState(),
	custom: getInitialState(),
	beginDate: new Date(new Date().getFullYear(), new Date().getMonth()),
	endDate: new Date()
};

export default function(state = initialState, action) {
	switch (action.type) {
		case UPDATE_HISTORY_PRODUCTS:
			if (action.kind === 'monthly')
				return Object.assign({}, state, { monthly: Object.assign(state.monthly, action.products) });
			else return Object.assign({}, state, { custom: Object.assign(state.custom, action.products) });
		case UPDATE_HISTORY_BOUNDINGS:
			return Object.assign(
				{},
				state,
				action.boundings.beginDate ? { beginDate } : null,
				action.boundings.endDate ? { endDate } : null
			);
		default:
			return state;
	}
}
