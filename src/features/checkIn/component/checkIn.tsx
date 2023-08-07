import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, FormikValues, Field, ErrorMessage, Form, FieldArray } from 'formik';

import Select from 'react-select';
import TimePicker from 'react-time-picker';

import { DeleteIcon, PlusIcon } from 'shared/components/icons/icons';
import { checkInValidationSchema } from 'shared/constants/validation-schema';
import httpService from 'shared/services/http.service';
import { API_CONFIG } from 'shared/constants/api';
import { CUSTOM_STYLE } from 'shared/constants/constants';
import { notify } from 'shared/components/notification/notification';
import { getCurrentTimeString } from 'shared/util/utility';

import '../style/checkIn.scss';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

const CheckIn: React.FC = () => {
	const navigate = useNavigate();

	const [maxTime, setMaxTime] = useState('23:59');
	const [projectNames, setProjectNames] = useState<any>([]);
	const [isLoading, setIsLoading] = useState(true);

	const { token } = useParams();

	const handleSubmit = (values: FormikValues) => {
		const uniqueTasks = new Set();
		const uniqueIdsAndTasks: any = [];

		values.array.forEach((item: any) => {
			const taskName = item.task;

			uniqueTasks.add(taskName);

			uniqueIdsAndTasks.push({
				projectId: item.project.value,
				taskName: taskName
			});
		});

		const payload = {
			token: token,
			InTime: values.time,
			tasks: uniqueIdsAndTasks
		};

		httpService
			.post(`${API_CONFIG.path.checkIn}?token=${token}`, payload)
			.then(() => {
				notify('You have successfully checked in', 'success');
				navigate(`/${token}`);
			})
			.catch((err) => {
				console.error(err);
			});
	};

	const updateMaxTime = () => {
		setMaxTime(getCurrentTimeString());
	};

	useEffect(() => {
		updateMaxTime();

		const intervalId = setInterval(updateMaxTime, 60000);

		return () => clearInterval(intervalId);
	}, []);

	const getUserDetails = () => {
		httpService
			.get(`${API_CONFIG.path.getUserDetails}?token=${token}`)

			.then((res) => {
				const projectNames = res.projects.map((data: any) => {
					return {
						label: data.projectName,
						value: data.id
					};
				});
				setProjectNames(projectNames);
				setIsLoading(false);
			})
			.catch((err) => {
				console.error(err);
				setIsLoading(false);
			});
	};

	useEffect(() => {
		getUserDetails();
	}, []);

	const currentTime = new Date().toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit'
	});

	const initOpt = { label: 'project names...', value: '' };

	const initialValues = {
		time: currentTime,
		array: [] as any
	};

	return (
		<>
			{!isLoading && (
				<Formik
					initialValues={initialValues}
					onSubmit={handleSubmit}
					validationSchema={checkInValidationSchema}
					validateOnChange
					validateOnBlur
					validateOnMount
					enableReinitialize
				>
					{({ setFieldValue, values, handleSubmit }) => {
						return (
							<Form className='check-in__form flex flex--column mt--100' onSubmit={handleSubmit}>
								<h4 className='text--primary no--margin mb--20 text--center'>Check In</h4>
								<div className='mb--25'>
									<p className='text--black font--medium mb--10 font-size--browser-default'>
										Enter time in 24 hour format.
									</p>
									<div className='form-item flex flex--column justify-content--between mb--20'>
										<TimePicker
											value={values.time}
											maxTime={maxTime}
											className='time-input font--regular border-radius--sm text--black'
											name='time'
											onChange={(time: any) => {
												setFieldValue('time', time);
											}}
											format='HH:mm'
											clockIcon={null}
											autoFocus
										/>

										<ErrorMessage
											name={'time'}
											component='p'
											className='text--red-400 font-size--xxs pl--10 error-message mt--10'
										/>
									</div>

									<FieldArray
										name='array'
										render={(arrayHelper) => {
											return values.array && values.array.length > 0 ? (
												values.array.map((item: any, index: number) => (
													<div
														key={index}
														className='fields flex justify-content--between mb--20 align-items--start'
													>
														<div className='form-item position--relative'>
															<div className='input-select'>
																<Select
																	value={values.array[index].project as any}
																	onChange={(value: any) => {
																		setFieldValue(`array[${index}].project`, value);
																	}}
																	options={projectNames}
																	styles={CUSTOM_STYLE}
																	placeholder='Project names...'
																/>
															</div>
															<ErrorMessage
																name={`array[${index}].project.value`}
																component='p'
																className='text--red-400 font-size--xxs pl--10 error-message mt--10'
															/>
														</div>

														<div className='form-item position--relative'>
															<Field
																name={`array[${index}].task`}
																type='text'
																className='input-field task-input font--regular  border-radius--sm text--black'
																autoComplete='off'
																placeholder='Enter a task'
																onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
																	setFieldValue(
																		`array[${index}].task`,
																		e.target.value
																	)
																}
															/>

															<ErrorMessage
																name={`array[${index}].task`}
																component='p'
																className='text--red-400 font-size--xxs pl--10 error-message mt--10'
															/>
														</div>
														{index !== values.array.length - 1 ? (
															<div className='flex width--100px'>
																<button
																	className='login-btn ml--5 font-size--lg text--uppercase text--white border-radius--default no--border no--bg'
																	type='button'
																	onClick={() => {
																		arrayHelper.remove(index);
																	}}
																>
																	<DeleteIcon width='35px' height='35px' />
																</button>
															</div>
														) : (
															<div className='flex width--100px'>
																<button
																	className='login-btn ml--5 font-size--lg text--uppercase text--white border-radius--default no--border no--bg'
																	type='button'
																	onClick={() => {
																		arrayHelper.remove(index);
																	}}
																>
																	<DeleteIcon width='35px' height='35px' />
																</button>

																<button
																	className='login-btn font-size--lg text--uppercase text--white border-radius--default no--border no--bg'
																	type='button'
																	onClick={() => {
																		arrayHelper.insert(index + 1, {
																			time: '',
																			project:
																				projectNames.length === 1
																					? projectNames[0]
																					: values.array[index].project,
																			task: ''
																		});
																	}}
																	disabled={values.array.some(
																		(item: any) =>
																			!item.project.value ||
																			!item.task.trim() ||
																			item.task.startsWith(' ')
																	)}
																>
																	<PlusIcon width='35px' height='35px' />
																</button>
															</div>
														)}
													</div>
												))
											) : (
												<div className='flex justify-content--end'>
													<button
														className='login-btn font-size--lg text--uppercase text--white border-radius--default no--border no--bg'
														type='button'
														onClick={() => {
															arrayHelper.push({
																time: '',
																project:
																	projectNames.length === 1
																		? projectNames[0]
																		: initOpt,
																task: ''
															});
														}}
													>
														<PlusIcon width='35px' height='35px' />
													</button>
												</div>
											);
										}}
									/>
								</div>
								<div className='display-flex-center mt--20'>
									<button
										className='submit-btn font-size--lg text--uppercase text--white border-radius--default no--border'
										type='submit'
									>
										submit
									</button>
								</div>
							</Form>
						);
					}}
				</Formik>
			)}
		</>
	);
};

export default CheckIn;
