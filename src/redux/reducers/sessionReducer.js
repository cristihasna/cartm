import { UPDATE_SESSION, LEAVE_SESSION } from '../actions/types';

const initialState = null

export default function(state = initialState, action) {
	switch (action.type) {
        case UPDATE_SESSION:
            return action.sessionData;
        case LEAVE_SESSION:
            return null
        default:
            return state
	}
}
