import { combineReducers } from 'redux';

import { IAction, IState } from 'shared/interface/state';

import loadingReducer from './loadingReducer';
import authReducer from 'features/auth/store/reducer';
import AuthService from 'shared/services/auth.service';

const appReducer = combineReducers({
	loading: loadingReducer,
	auth: authReducer
});

const rootReducer = (state: IState | undefined, action: IAction) => {
	if (action.type === 'AUTH_LOGOUT') {
		AuthService.removeAuthData();
		state = undefined;
	}
	return appReducer(state, action);
};

export default rootReducer;
