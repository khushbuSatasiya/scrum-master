import { FC, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import httpService from 'shared/services/http.service';
import { API_CONFIG } from 'shared/constants/api';
import { BulletIcon } from 'shared/components/icons/icons';

import '../style/dashboard.scss';
import { changedDateFormat } from 'shared/util/utility';

const Dashboard: FC = () => {
	const navigate = useNavigate();
	const [action, setAction] = useState('');
	const [statusCode, setStatusCode] = useState(null);
	const [timeSheet, setTimeSheet] = useState<any>([]);
	const [userTask, setUserTask] = useState<any>([]);
	const [userName, setUserName] = useState('');

	const { token }: any = useParams();

	const getUserDetails = useCallback((token: any) => {
		httpService
			.get(`${API_CONFIG.path.getUserDetails}?token=${token}`)

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
	}, []);

	useEffect(() => {
		getUserDetails(token);
		localStorage.setItem('token', token);
	}, [getUserDetails, token]);

	return (
		<div className='display-flex-center mt--100 flex--column'>
			{(action === 'checkIn' || statusCode === 400) && (
				<>
					{userName && <h3 className='text--primary mb--20'>Hello, {userName}</h3>}
					<button
						className={`check-in__btn font-size--lg text--uppercase text--white border-radius--default no--border bg--primary ${
							statusCode === 400 && 'pointer-events--none'
						}`}
						onClick={() => navigate(`/check-in/${token}`)}
					>
						Check In
					</button>
				</>
			)}

			{action === 'checkOut' && (
				<>
					{userName && <h3 className='text--primary mb--20'>Hello, {userName}</h3>}
					<div className='dashboard mb--25'>
						{timeSheet.date && (
							<h6 className='text--center text--black no--margin mb--15 pl--17'>
								Date: <span className='font--regular'> {changedDateFormat(timeSheet.date)}</span>
							</h6>
						)}
						<div className='flex align-items--start justify-content--evenly'>
							<h6 className='text--black no--margin mb--25 font-size--24 font--semi-bold'>
								Check-In Time:
								<span className='font--regular ml--5 font-size--xxl'>
									{timeSheet.inTime.slice(0, -3)}
								</span>
							</h6>
							<div className='flex flex--column'>
								<h6 className='text--black no--margin mb--10 font-size--xxl font--medium'>
									Planned Tasks:
								</h6>
								{userTask.length === 0 && (
									<p className='text--black font-size--xxl font--regular'>No task added</p>
								)}
								{userTask.map((task: any, index: number) => {
									return (
										<div key={index}>
											<p className='text--black font-size--xxl font--regular mb--5'>
												{task.projectdeatils.projectName.charAt(0).toUpperCase() +
													task.projectdeatils.projectName.slice(1)}
											</p>
											<div className='flex ml--10 mb--10'>
												<BulletIcon />
												<p className='text--black break-word--word line-height--24'>
													{task.task}
												</p>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
					<button
						className='check-in__btn font-size--lg text--uppercase text--white border-radius--default no--border bg--primary ml--15'
						onClick={() => navigate(`/check-out/${token}`)}
					>
						Check Out
					</button>
				</>
			)}

			{action === 'Success' && (
				<div className='flex flex--column mb--100'>
					<h3 className='text--primary mb--20'>Hello, {userName}</h3>
					<div className='dashboard'>
						{timeSheet.date && (
							<h6 className='text--center text--black no--margin mb--15'>
								Date: <span className='font--regular'> {changedDateFormat(timeSheet.date)}</span>
							</h6>
						)}
						<div className='check-wrapper flex align-items--start justify-content--evenly'>
							<div className='check-in__content'>
								<h6 className='text--black no--margin mb--25 font-size--24 font--semi-bold'>
									Check-In Time:
									<span className='font--regular ml--5 font-size--xxl'>
										{timeSheet.inTime.slice(0, -3)}
									</span>
								</h6>
								<div className='flex flex--column'>
									<h6 className='text--black no--margin mb--10 font-size--xxl font--medium'>
										Planned Tasks:
									</h6>
									{timeSheet.taskCreate === 'NO TASK PROVIDED' ? (
										<p className='text--black font-size--xxl font--regular mb--5'>No task added</p>
									) : (
										userTask.map((task: any, index: number) => {
											return (
												<div key={index}>
													<p className='text--black font-size--xxl font--regular mb--5'>
														{task.projectdeatils.projectName.charAt(0).toUpperCase() +
															task.projectdeatils.projectName.slice(1)}
													</p>
													<div className='flex ml--10 mb--10'>
														<BulletIcon />
														<p className='text--black break-word--word line-height--24'>
															{task.task}
														</p>
													</div>
												</div>
											);
										})
									)}
								</div>
							</div>
							<div className='check-out__content'>
								<h6 className='text--black no--margin mb--25 font-size--24 font--semi-bold'>
									Check-Out Time:
									<span className='font--regular ml--5 font-size--xxl'>
										{timeSheet.outTime.slice(0, -3)}
									</span>
								</h6>
								<div className='flex flex--column'>
									<h6 className='text--black no--margin mb--10 font-size--xxl font--medium'>
										Completed Tasks:
									</h6>
									{userTask.map((task: any, index: number) => {
										return (
											<div key={index}>
												<p className='text--black font-size--xxl font--regular mb--5'>
													{task.projectdeatils.projectName.charAt(0).toUpperCase() +
														task.projectdeatils.projectName.slice(1)}
												</p>
												<div className='flex ml--10 mb--10'>
													<BulletIcon />
													<p className='text--black break-word--word line-height--24'>
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
