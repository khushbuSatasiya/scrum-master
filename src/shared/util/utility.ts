import { ThunkDispatch } from 'redux-thunk';
import _ from 'lodash';
import { IAction, IState } from 'shared/interface/state';

/**
 * create action creator
 * @param ACTION - type of action
 * @param data - data
 */
export const createAction = (ACTION: string, data: any = null): IAction => ({
	type: ACTION,
	payload: data
});

/**
 * create loading selector
 * @param actions - actions to dispatch
 */
export const createLoadingSelector = (actions: string[]) => (state: IState) =>
	// returns true only when all actions is not loading
	_(actions).some((action: string) => _.get(state, `loading.api.${action}`));

/**
 * dispatch action after given time (to handle some events like close modal after success api call)
 * @param dispatch - dispatch object
 * @param action - action type
 * @param time - time after which action is to be dispatched (default - 100ms)
 */
export const dispatchActionAfterTime = (
	dispatch: ThunkDispatch<unknown, unknown, IAction>,
	action: string,
	time = 100
) => {
	setTimeout(() => {
		dispatch(createAction(action));
	}, time);
};

export const camelCaseToFirstUpperLetter = (text: string) => {
	const result = text.replace(/([A-Z])/g, ' $1');
	const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
	return finalResult;
};

export const debounce = (func: any, wait = 400) => {
	let h: NodeJS.Timeout;
	return (...args: any) => {
		clearTimeout(h);
		h = setTimeout(() => func(...args), wait);
	};
};
export const generateColor = () => {
	const x = Math.floor(Math.random() * 256);
	const y = Math.floor(Math.random() * 256);
	const z = Math.floor(Math.random() * 256);
	const RGBColor = `${x} ,${y}, ${z}`;
	return RGBColor;
};

export const getTodayDate = () => {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const day = String(today.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

export const getCurrentTimeString = () => {
	const currentTime = new Date();
	const hours = currentTime.getHours().toString().padStart(2, '0');
	const minutes = currentTime.getMinutes().toString().padStart(2, '0');
	const currentTimeString = `${hours}:${minutes}`;
	return currentTimeString;
};

export const changedDateFormat = (date: string) => {
	const dateObject = new Date(date);
	const day = dateObject.getDate();
	const month = dateObject.getMonth() + 1;
	const year = dateObject.getFullYear();

	return `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;
};
