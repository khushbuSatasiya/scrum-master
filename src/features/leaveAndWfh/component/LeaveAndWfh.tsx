import { FC, useCallback, useEffect, useState } from 'react';
import { ErrorMessage, Form, Formik, FormikValues } from 'formik';

import Select from 'react-select';

import httpService from 'shared/services/http.service';
import { API_CONFIG } from 'shared/constants/api';

import '../style/LeaveAndWfh.scss';
import { useParams } from 'react-router-dom';
import { CUSTOM_STYLE } from 'shared/constants/constants';
import { isEmpty } from 'lodash';

const months = [
	{ value: '1', label: 'January' },
	{ value: '2', label: 'February' },
	{ value: '3', label: 'March' },
	{ value: '4', label: 'April' },
	{ value: '5', label: 'May' },
	{ value: '6', label: 'June' },
	{ value: '7', label: 'July' },
	{ value: '8', label: 'August' },
	{ value: '9', label: 'September' },
	{ value: '10', label: 'October' },
	{ value: '11', label: 'November' },
	{ value: '12', label: 'December' }
];

const currentMonthIndex = new Date().getMonth();
const monthIni: any = months[currentMonthIndex].value;

const LeaveAndWfh: FC = () => {
	const [projectNames, setProjectNames] = useState<any>([]);
	const [month, setMonth] = useState(Number(months[monthIni].value));
	const [project, setProject] = useState('');
	const [leaveAndWfhData, setLeaveAndWfhData] = useState<any>();

	const { token }: any = useParams();

	const initialValues = {
		month: months[monthIni - 1],
		project: projectNames[0]
	};

	const handleSubmit = () => {
		//
	};

	const getUserDetails = useCallback((token: string) => {
		const payload = {
			token: token
		};

		httpService
			.post(API_CONFIG.path.projectList, payload)

			.then((res) => {
				const projectNames = res.data.map((data: any) => {
					return {
						label: data.projectName,
						value: data.id
					};
				});
				setProjectNames(projectNames);
				setProject(projectNames[0].value);
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	useEffect(() => {
		getUserDetails(token);
	}, [getUserDetails, token]);

	const leaveAndWfh = useCallback((month: any, token: string, project: string) => {
		const payload = {
			token: token,
			month: Number(month),
			projectId: project
		};

		!isEmpty(payload.projectId) &&
			httpService
				.post(API_CONFIG.path.leaveAndWfh, payload)

				.then((res) => {
					setLeaveAndWfhData(res.data);
				})
				.catch((err) => {
					console.error(err);
				});
	}, []);

	useEffect(() => {
		leaveAndWfh(month, token, project);
	}, [leaveAndWfh, month, token, project]);

	return (
		<>
			<Formik
				initialValues={initialValues}
				onSubmit={handleSubmit}
				validateOnChange
				validateOnBlur
				validateOnMount
				enableReinitialize
			>
				{({ setFieldValue, values, handleSubmit }) => {
					return (
						<Form className='mt--100' onSubmit={handleSubmit}>
							<h4 className='text--primary no--margin mb--20 text--center'>Team Report</h4>
							<div className='flex check-in__form flex justify-content--around'>
								<div className='form-item position--relative width--100px'>
									<div className='text--black input-select'>
										<Select
											value={values.month}
											onChange={(value: any) => {
												setFieldValue('month', value);
												setMonth(value.value);
											}}
											className='text--black bg--white'
											options={months}
											styles={CUSTOM_STYLE}
										/>
									</div>
									<ErrorMessage
										name={'month'}
										component='p'
										className='text--red-400 font-size--xxs pl--10 error-message mt--10'
									/>
								</div>
								<div className='form-item position--relative width--100px'>
									<div className='input-select text--black'>
										<Select
											value={values.project}
											onChange={(value: any) => {
												setFieldValue('project', value);
												setProject(value.value);
											}}
											className='text--black bg--white'
											options={projectNames}
											styles={CUSTOM_STYLE}
										/>
									</div>
									<ErrorMessage
										name={'month'}
										component='p'
										className='text--red-400 font-size--xxs pl--10 error-message mt--10'
									/>
								</div>
							</div>
						</Form>
					);
				}}
			</Formik>
			{leaveAndWfhData && (
				<div className='table display-flex-center'>
					<table className='customers'>
						<thead>
							<tr>
								<th className='text--black'>Date</th>
								<th className='text--black'>Leave Availability</th>
								<th className='text--black'>WFH Availability</th>
							</tr>
						</thead>
						<tbody>
							{Object.keys(leaveAndWfhData.leave).map((date) => (
								<tr key={date}>
									<td className='text--black'>{date}</td>
									<td className='text--black'>{leaveAndWfhData.leave[date].join(', ')}</td>
									<td className='text--black'>{leaveAndWfhData.wfh[date].join(', ')}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</>
	);
};

export default LeaveAndWfh;
