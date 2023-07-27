import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, FormikValues, Field, ErrorMessage, Form } from 'formik';

import * as Yup from 'yup';
import HttpService from 'shared/services/http.service';
import { API_CONFIG } from 'shared/constants/api';
import { notify } from 'shared/components/notification/notification';
import { forgotPasswordFormValidationSchema } from 'shared/constants/validation-schema';

const ForgotPassword: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const onSubmit = useCallback((values: FormikValues) => {
		setLoading(true);
		const params = { email: values.email };
		HttpService.post(API_CONFIG.path.forget, params)
			.then(() => {
				setLoading(false);
				notify('An email has been sent to the provided address.\nPlease check.', 'success');
			})
			.catch((err: Error) => {
				console.log('Error', err);
				setLoading(false);
			});
	}, []);

	return (
		<div className='flex justify-content--center align-items--center flex--column height--full-viewport'>
			<p className='auth-title text--center text--white font-size--28'>Forgot Password</p>
			<div className='auth_form form width--50'>
				<Formik
					initialValues={initialValues}
					onSubmit={onSubmit}
					validationSchema={forgotPasswordFormValidationSchema}
					validateOnChange
					validateOnBlur
					validateOnMount
				>
					<Form>
						<div className='form-item mb--50 position--relative'>
							<label className='login-label'>Email</label>
							<Field
								name='email'
								type='email'
								className='input-field font--regular width--full mt--10 border-radius--sm bg--grey-300 text--white'
								autoComplete='off'
								placeholder='Email Address'
							/>
							<ErrorMessage
								name='email'
								component='span'
								className='text--red-400 font-size--xxs pl--10 error-message position--absolute'
							/>
						</div>
						<button
							className='login-btn width--full font-size--lg text--uppercase text--white border-radius--default no--border bg--primary'
							type='submit'
							disabled={loading}
						>
							Send Mail
						</button>
						<button
							className='login-btn width--full font-size--lg text--uppercase text--white border-radius--default no--border bg--primary mt--15'
							type='button'
							disabled={loading}
							onClick={() => navigate('/login')}
						>
							Back To Login
						</button>
					</Form>
				</Formik>
			</div>
		</div>
	);
};

const initialValues = { email: '' };

export default ForgotPassword;
