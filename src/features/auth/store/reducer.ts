import { IAction } from 'shared/interface/state';
import AuthService from 'shared/services/auth.service';

import * as actionTypes from 'store/actionTypes';
import { IAuthState, IUserData } from '../interface/auth';

const initialState: IAuthState = {
	isLogin: AuthService.isLogin(),
	userData: {} as IUserData
};

const reducer = (state: IAuthState = initialState, action: IAction) => {
	switch (action.type) {
		case actionTypes.AUTH_SUCCESS:
			return {
				...state,
				isLogin: true
			};
		case actionTypes.AUTH_FAILED:
			return {
				...state,
				isLogin: false
			};
		case actionTypes.UPDATE_USER_DATA:
			return {
				...state,
				userData: action.payload
			};
		case actionTypes.AUTH_LOGOUT:
			return {
				...state,
				isLogin: false
			};
		default:
			return state;
	}
};

export default reducer;
