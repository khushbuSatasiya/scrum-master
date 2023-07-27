import React from 'react';

import LoginForm from '../component/loginForm';

const Login: React.FC = () => {
	return (
		<div className='flex justify-content--center align-items--center flex--column height--full-viewport'>
			<p className='auth-title text--center text--white font-size--28'>Log In</p>
			<div className='auth_form width--50 m--0-auto form'>
				<LoginForm />
			</div>
		</div>
	);
};

export default Login;
