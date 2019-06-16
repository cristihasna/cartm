import { UPDATE_RECEIPT, RESET_RECEIPT } from '../actions/types';

const initialState = {
	participants: [],
	products: []
};

export default function(state = initialState, action) {
	switch (action.type) {
		case UPDATE_RECEIPT:
			return action.receiptData;
		case RESET_RECEIPT:
			return {
				products: [],
				participants: [ action.hostParticipant ]
			};
		default:
			return state;
	}
}
