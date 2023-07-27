import React from 'react';

import LoginForm from '../component/loginForm';
import { ScaletechWhiteLogo } from 'shared/components/icons/icons';

import '../style/login.scss';

const Login: React.FC = () => {
	return (
		<div className='login-wrapper flex justify-content--center align-items--center flex--column height--full-viewport'>
			<div className='logo-wrapper'>
				<ScaletechWhiteLogo width='200px' height='200px' />
			</div>
			<div className=' auth_form width--50 m--0-auto form'>
				<LoginForm />
			</div>
		</div>
	);
};

export default Login;
