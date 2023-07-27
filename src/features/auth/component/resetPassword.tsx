import React, { useCallback, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Formik, FormikValues, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';

import { HidePasswordIcon, ShowPasswordIcon } from 'shared/components/icons/icons';
import HttpService from 'shared/services/http.service';
import { API_CONFIG } from 'shared/constants/api';
import { notify } from 'shared/components/notification/notification';
import { resetPasswordFormValidationSchema } from 'shared/constants/validation-schema';

const ResetPassword: React.FC = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setConfirmPassword] = useState(false);

	const { token } = useParams();

	const callResetPass = useCallback(
		(values: FormikValues) => {
			const params = {
				token: token,
				password: values.password
			};
			HttpService.post(API_CONFIG.path.reset, params)
				.then(() => {
					notify(
						'Your password has been changed successfully.\n Please login again with your new password',
						'error'
					);
				})
				.catch((err: Error) => {
					console.log('Error', err);
				});
		},
		[token]
	);

	return (
		<div className='flex justify-content--center align-items--center flex--column height--full-viewport'>
			<p className='auth-title text--white font-size--28'>Reset Password</p>
			<div className='auth_form form reset-password_form width--50'>
				<Formik
					initialValues={initialValues}
					onSubmit={callResetPass}
					validationSchema={resetPasswordFormValidationSchema}
					validateOnChange
					validateOnBlur
					validateOnMount
				>
					<Form>
						<div className='form-item mb--25 position--relative'>
							<label className='login-label'>New Password</label>
							<Field
								name='password'
								type={showPassword ? 'text' : 'password'}
								className='input-field font--regular width--full mt--10  border-radius--sm bg--grey-300 text--white'
								autoComplete='off'
								placeholder='Password'
							/>
							<div
								className='password-icon position--absolute  flex cursor--pointer align-items--center'
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? (
									<ShowPasswordIcon className='fill--comet cursor--pointer' />
								) : (
									<HidePasswordIcon className='fill--white cursor--pointer' />
								)}
							</div>
							<ErrorMessage
								name='password'
								component='span'
								className='text--red-400 font-size--xxs pl--10 error-message position--absolute'
							/>
						</div>
						<div className='form-item mb--25 position--relative'>
							<label className='login-label'> Confirm Password</label>
							<Field
								name='confirmPassword'
								type={showConfirmPassword ? 'text' : 'password'}
								className='input-field font--regular width--full mt--10  border-radius--sm bg--grey-300 text--white'
								autoComplete='off'
								placeholder='Confirm Password'
							/>
							<div
								className='password-icon position--absolute  flex cursor--pointer align-items--center'
								onClick={() => setConfirmPassword(!showConfirmPassword)}
							>
								{showConfirmPassword ? (
									<ShowPasswordIcon className='fill--comet cursor--pointer' />
								) : (
									<HidePasswordIcon className='fill--white cursor--pointer' />
								)}
							</div>
							<ErrorMessage
								name='confirmPassword'
								component='span'
								className='text--red-400 font-size--xxs pl--10 error-message position--absolute'
							/>
						</div>
						<div className='flex justify-content--between align-items--center'>
							<div>
								<button
									className='reset-password-btn login-btn width--full font-size--lg text--uppercase text--white border-radius--default no--border bg--primary'
									type='submit'
								>
									Save Password
								</button>
							</div>
							<Link
								to={{ pathname: '/login' }}
								className='redirect-link_login text-decoration--underline font-size--lg text--primary'
							>
								Login
							</Link>
						</div>
					</Form>
				</Formik>
			</div>
		</div>
	);
};

const initialValues = {
	password: '',
	confirmPassword: ''
};

export default ResetPassword;
