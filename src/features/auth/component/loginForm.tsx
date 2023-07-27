import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Formik, FormikValues, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';

import AuthService from 'shared/services/auth.service';
import HttpService from 'shared/services/http.service';
import { API_CONFIG } from 'shared/constants/api';
import { createAction } from 'shared/util/utility';
import { HidePasswordIcon, ShowPasswordIcon } from 'shared/components/icons/icons';
import { loginFormValidationSchema } from 'shared/constants/validation-schema';
import * as actionTypes from 'store/actionTypes';

const LoginForm: React.FC = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();

	const onSubmit = useCallback(
		(values: FormikValues) => {
			const params = {
				email: values.email,
				password: values.password
			};

			setLoading(true);
			HttpService.post(API_CONFIG.path.login, params)
				.then((res) => {
					setLoading(false);
					res.data && AuthService.setAuthData(res.data.token);
					dispatch(createAction(actionTypes.AUTH_SUCCESS));
					dispatch(createAction(actionTypes.UPDATE_USER_DATA, res.data));
				})
				.catch((err: Error) => {
					setLoading(false);
					dispatch(createAction(actionTypes.AUTH_FAILED));
					console.log('Error', err);
				});
		},
		[dispatch]
	);

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={onSubmit}
			validationSchema={loginFormValidationSchema}
			validateOnChange
			validateOnBlur
			validateOnMount
		>
			<Form>
				<div className='form-item mb--25 position--relative'>
					<Field
						name='email'
						type='email'
						className='input-field font--regular width--full border-radius--sm bg--grey-300 text--white'
						autoComplete='off'
						placeholder='Email Address'
					/>
					<ErrorMessage
						name='email'
						component='p'
						className='text--red-400 font-size--xxs pl--10 error-message mt--10'
					/>
				</div>
				<div className='form-item mb--25 position--relative'>
					<Field
						name='password'
						type={showPassword ? 'text' : 'password'}
						className='input-field font--regular width--full border-radius--sm bg--grey-300 text--white'
						autoComplete='off'
						placeholder='Password'
					/>
					<div
						className='password-icon position--absolute  flex cursor--pointer align-items--center'
						onClick={() => setShowPassword(!showPassword)}
					>
						{showPassword ? (
							<ShowPasswordIcon className='fill--comet' />
						) : (
							<HidePasswordIcon className='fill--white' />
						)}
					</div>
					<ErrorMessage
						name='password'
						component='p'
						className='text--red-400 font-size--xxs pl--10 error-message mt--10'
					/>
				</div>
				<div className='flex align-items--center justify-content--end mb--15'>
					<Link
						to={{
							pathname: '/forgot-password'
						}}
						className='forgot-password font-size--default text-decoration--underline text--primary'
					>
						Forgot Password?
					</Link>
				</div>
				<button
					disabled={loading}
					className='login-btn width--full font-size--lg text--uppercase text--white border-radius--default no--border bg--primary'
					type='submit'
				>
					Login
				</button>
			</Form>
		</Formik>
	);
};

const initialValues = {
	email: '',
	password: ''
};

export default LoginForm;
