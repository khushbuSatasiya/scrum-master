import { FC, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AxiosResponse, AxiosError } from 'axios';

import { axiosInstance } from 'shared/services/http.service';
import { createAction } from 'shared/util/utility';
import { IResponseObject } from 'shared/interface';
import Notification, { notify } from 'shared/components/notification/notification';

const ErrorHandler: FC = () => {
	const dispatch = useDispatch();

	const logout = useCallback(() => {
		// dispatch(createAction(actionTypes.LOGOUT_SUCCESS));
		dispatch(createAction('RESET_MODAL'));
	}, [dispatch]);

	useEffect(() => {
		const resInterceptor = axiosInstance.interceptors.response.use(
			(res: AxiosResponse<IResponseObject<any>>) => {
				const data = res.data;
				if (data && data.message) {
					if (data.isError) {
						notify(data.message, 'error');
						throw new Error(data.message as string);
					} else {
						notify(data.message, 'success');
					}
				}

				return res;
			},
			(error: AxiosError<IResponseObject<any>>) => {
				const res = error.response;
				// check if error is having data
				if (res && res.data && res.status) {
					const status = res.status;
					const responseData = res.data;

					// is http error code is 401, log out of the application
					if (status === 401 && responseData) {
						logout();
						notify(error.message, 'error');
					} else if (res && responseData && responseData.message) {
						// if error data contains message field, add error notification
						notify(responseData.message, 'error');
					} else {
						notify(error.message, 'error');
					}
					throw error;
				}
			}
		);

		return () => axiosInstance.interceptors.response.eject(resInterceptor);
	}, [logout]);

	return <Notification />;
};

export default ErrorHandler;
