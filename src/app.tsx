import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Routes, Navigate } from 'react-router-dom';

import Login from 'features/auth/container/login';
import ForgotPassword from 'features/auth/component/forgotPassword';
import ResetPassword from 'features/auth/component/resetPassword';

import { IState } from 'shared/interface/state';

import Layout from 'hoc/layout/layout';

import Dashboard from 'features/dashboard/component/dashboard';
import CheckIn from 'features/checkIn/component/checkIn';
import CheckOut from 'features/checkOut/component/checkOut';
import LeaveAndWfh from 'features/leaveAndWfh/component/LeaveAndWfh';

const App: React.FC = () => {
	const isLogin: boolean = useSelector((state: IState) => state.auth.isLogin);

	if (!isLogin) {
		return (
			<Layout>
				<Routes>
					<Route path='/' element={<Dashboard />} />
					<Route path='/:token' element={<Dashboard />} />
					<Route path='/check-in/:token' element={<CheckIn />} />
					<Route path='/check-out/:token' element={<CheckOut />} />
					<Route path='/team-report/:token' element={<LeaveAndWfh />} />
					<Route path='*' element={<Navigate replace to='/' />} />
				</Routes>
			</Layout>
		);
	} else {
		return (
			<Routes>
				<Route path='/login' element={<Login />} />
				<Route path='/forgot-password' element={<ForgotPassword />} />
				<Route path='/reset-password/:token' element={<ResetPassword />} />
				<Route path='*' element={<Navigate replace to='/login' />} />
			</Routes>
		);
	}
};

export default App;
