import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../style/dashboard.scss';
import httpService from 'shared/services/http.service';
import { API_CONFIG } from 'shared/constants/api';

const Dashboard: FC = () => {
	const navigate = useNavigate();
	const [action, setAction] = useState('');
	const [timeSheet, setTImeSheet] = useState<any>([]);

	const getUserDetails = () => {
		httpService
			.get(`${API_CONFIG.path.getUserDetails}?token=b2fac31298d5f9c57cb3cc455d14ae0f`)

			.then((res) => {
				setAction(res.action);
				res[0]?.timesheet[0] && setTImeSheet(res);
			})
			.catch((err) => {
				console.error(err);
			});
	};

	useEffect(() => {
		getUserDetails();
	}, []);

	return (
		<div className='display-flex-center mt--100'>
			{action === 'checkIn' ? (
				<button
					className='check-in__btn font-size--lg text--uppercase text--white border-radius--default no--border bg--primary'
					onClick={() => navigate('/check-in')}
				>
					Check In
				</button>
			) : (
				<>
					<button
						className='check-in__btn font-size--lg text--uppercase text--white border-radius--default no--border bg--primary ml--15'
						onClick={() => navigate('/check-out')}
					>
						Check Out
					</button>

					{/* {timeSheet && <h5>{timeSheet[0].timesheet[0].inTime}</h5>} */}
				</>
			)}
		</div>
	);
};

export default Dashboard;
