import { IAction, ILoadingState } from 'shared/interface/state';

const loadingReducer = (state: ILoadingState = { api: {} }, action: IAction): ILoadingState => {
	const { type } = action;
	const matches = /(.*)_(INIT|SUCCESS|FAIL)/.exec(type);

	// not a *INIT / *_SUCCESS /  *_FAIL actions, so we ignore them
	if (!matches) return state;

	const [, requestName, requestState] = matches;
	return {
		...state,
		// Store whether a request is happening at the moment or not
		// e.g. will be true when receiving FETCH_USER_INIT
		//      and false when receiving FETCH_USER_SUCCESS / FETCH_USER_FAIL
		api: {
			...state.api,
			[requestName]: requestState === 'INIT'
		}
	};
};

export default loadingReducer;
