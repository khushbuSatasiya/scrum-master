import { FC, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import '../style/dashboard.scss';
import httpService from 'shared/services/http.service';
import { API_CONFIG } from 'shared/constants/api';
import { BulletIcon } from 'shared/components/icons/icons';

const Dashboard: FC = () => {
	const navigate = useNavigate();
	const [action, setAction] = useState('');
	const [statusCode, setStatusCode] = useState(null);
	const [timeSheet, setTimeSheet] = useState<any>([]);
	const [userTask, setUserTask] = useState<any>([]);
	const [userName, setUserName] = useState('');

	const { search } = useLocation();
	const query = useMemo(() => new URLSearchParams(search), [search]);
	const token = query.get('token');
	console.log('token:', token);

	const getUserDetails = () => {
		httpService
			.get(`${API_CONFIG.path.getUserDetails}?token=token`)

			.then((res) => {
				setAction(res.action);
				res?.findUser && setTimeSheet(res.findUser[0]?.timesheet[0]);
				res?.findUser && setUserTask(res?.findUser[0]?.usertasks);
				res?.findUser && setUserName(res.findUser[0].realName);
			})
			.catch((err) => {
				err?.response?.status && setStatusCode(err?.response.status || '');
				console.error(err);
			});
	};

	useEffect(() => {
		getUserDetails();
	}, []);

	return (
		<div className='display-flex-center mt--100'>
			{(action === 'checkIn' || statusCode === 400) && (
				<>
					<h3 className='text--primary mb--20'>Hello, {userName && userName}</h3>
					<button
						className={`check-in__btn font-size--lg text--uppercase text--white border-radius--default no--border bg--primary ${
							statusCode === 400 && 'pointer-events--none'
						}`}
						onClick={() => navigate('/check-in')}
					>
						Check In
					</button>
				</>
			)}

			{action === 'checkOut' && (
				<>
					<button
						className='check-in__btn font-size--lg text--uppercase text--white border-radius--default no--border bg--primary ml--15'
						onClick={() => navigate('/check-out')}
					>
						Check Out
					</button>
				</>
			)}

			{action === 'Success' && (
				<div className='flex  flex--column '>
					<h3 className='text--primary mb--20'>Hello, {userName}</h3>
					<div className='dashboard'>
						<div className='flex align-items--start justify-content--evenly'>
							<div>
								<h6 className='text--black no--margin mb--25 font-size--28 '>
									Check-In Time:
									<span className='font--regular ml--5 font-size--xxl'>{timeSheet.inTime}</span>
								</h6>
								<div className='flex flex--column'>
									<h6 className='text--black no--margin mb--10 font-size--24 font--semi-bold'>
										Planned Tasks:
									</h6>
									{userTask.map((task: any, index: number) => {
										return (
											<div key={index}>
												<p className='text--black font-size--xxl font--medium'>
													{task.projectdeatils.projectName}
												</p>
												<div className='flex ml--10 mb--10'>
													<BulletIcon />
													<p className='text--black '>{task.task}</p>
												</div>
											</div>
										);
									})}
								</div>
							</div>
							<div>
								<h6 className='text--black no--margin mb--25 font-size--28 '>
									Check-Out Time:
									<span className='font--regular ml--5 font-size--xxl'>{timeSheet.outTime}</span>
								</h6>
								<div className='flex flex--column'>
									<h6 className='text--black no--margin mb--10 font-size--24 font--semi-bold'>
										Completed Tasks
									</h6>
									{userTask.map((task: any, index: number) => {
										return (
											<div key={index}>
												<p className='text--black font-size--xxl font--medium'>
													{task.projectdeatils.projectName}
												</p>
												<div className='flex ml--10 mb--10'>
													<BulletIcon />
													<p className='text--black'>
														{task.task} <span className='status ml--5'>{task.status}</span>
													</p>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Dashboard;
