import React, { useCallback, useEffect, useState } from 'react';
import { Formik, FormikValues, Field, ErrorMessage, Form, FieldArray } from 'formik';

import Select from 'react-select';
import TimePicker from 'react-time-picker';

import { DeleteIcon, PlusIcon } from 'shared/components/icons/icons';
import { checkInValidationSchema } from 'shared/constants/validation-schema';
import { CUSTOM_STYLE } from 'shared/constants/constants';

import '../../checkIn/style/checkIn.scss';
import '../style/checkOut.scss';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import httpService from 'shared/services/http.service';
import { API_CONFIG } from 'shared/constants/api';

const options = [
	{ value: 'fanblast', label: 'Fanblast' },
	{ value: 'soundmind', label: 'Soundmind' },
	{ value: 'scaletrack', label: 'Scaletrack' }
];

const status = [
	{ value: 'pending', label: 'Pending' },
	{ value: 'complete', label: 'Complete' },
	{ value: 'continue', label: 'Continue' },
	{ value: 'hold', label: 'Hold' }
];

const CheckOut: React.FC = () => {
	const [maxTime, setMaxTime] = useState('23:59');
	const [userTask, setUserTasks] = useState<any>([]);
	const [taskStatus, setTaskStatus] = useState<any>();

	const handleSubmit = (values: FormikValues) => {
		console.log(values, 'values');

		const uniqueTasks = new Set();
		const uniqueIdsAndTasks: any = [];

		values.array.forEach((item: any, index: number) => {
			console.log('item:', item);
			const uniqueId = index;

			const taskName = item.task;

			uniqueTasks.add(taskName);

			uniqueIdsAndTasks.push({
				taskId: '',
				projectId: uniqueId,
				taskName: taskName,
				status: ''
			});
		});

		const payload = {
			token: 'U0311LTNK42',
			OutTime: values.time,
			tasks: uniqueIdsAndTasks
		};
		console.log('payload:', payload);

		httpService
			.post(`${API_CONFIG.path.checkOut}?token=b2fac31298d5f9c57cb3cc455d14ae0f`, payload)

			.then((res) => {
				console.log('res:', res);
			})
			.catch((err) => {
				console.error(err);
			});
	};

	useEffect(() => {
		const currentTime = new Date();
		const hours = currentTime.getHours().toString().padStart(2, '0');
		const minutes = currentTime.getMinutes().toString().padStart(2, '0');
		const currentTimeString = `${hours}:${minutes}`;
		setMaxTime(currentTimeString);
	}, []);

	const getUserDetails = () => {
		httpService
			.get(`${API_CONFIG.path.getUserDetails}?token=b2fac31298d5f9c57cb3cc455d14ae0f`)

			.then((res) => {
				setUserTasks(res.findUser[0].usertasks);
				res &&
					res.findUser[0].usertasks.map((data: any, index: number) => {
						console.log(data.id, 'data');
					});
			})
			.catch((err) => {
				console.error(err);
			});
	};

	useEffect(() => {
		getUserDetails();
	}, []);

	return (
		(userTask.length > 0 && (
			<Formik
				initialValues={formatValues(userTask)}
				onSubmit={handleSubmit}
				// validationSchema={checkInValidationSchema}
				validateOnChange
				validateOnBlur
				validateOnMount
				enableReinitialize
			>
				{({ setFieldValue, values, handleSubmit, isValid }) => {
					console.log('values:', values);
					return (
						<Form className='check-in__form check-out flex flex--column mt--100' onSubmit={handleSubmit}>
							<div className=' mb--25'>
								<div className='form-item position--relative'>
									<TimePicker
										value={values.time}
										maxTime={maxTime}
										className='time-input font--regular border-radius--sm text--black'
										name='time'
										onChange={(time: any) => {
											setFieldValue('time', time);
										}}
									/>

									<ErrorMessage
										name={'time'}
										component='p'
										className='text--red-400 font-size--xxs pl--10 error-message mt--10'
									/>
								</div>

								<div className='task-status mt--20 mb--20'>
									{userTask.map((data: any, index: number) => {
										return (
											<div
												className='flex align-items--center justify-content--around mb--20'
												key={index}
											>
												<p className='text--black'>{data.task}</p>
												<div className='form-item position--relative'>
													<div className='input-select'>
														<Select
															// value={values.array[index].status as any}
															onChange={(value: any) => {
																// setFieldValue();
																setTaskStatus(value.value);
																// console.log('value:', value.value);
															}}
															options={status}
															styles={CUSTOM_STYLE}
															placeholder='status...'
															name='taskStat'
														/>
													</div>
													<ErrorMessage
														name={'taskStat'}
														component='p'
														className='text--red-400 font-size--xxs pl--10 error-message mt--10'
													/>
												</div>
											</div>
										);
									})}
								</div>
								{
									<FieldArray
										name='array'
										render={(arrayHelper) => {
											return values.array.map((item: any, index: number) => {
												return (
													<div key={index} className='flex justify-content--between'>
														<div className='form-item position--relative'>
															<div className='input-select'>
																<Select
																	value={values.array[index].project as any}
																	onChange={(value: any) => {
																		setFieldValue(`array[${index}].project`, value);
																	}}
																	options={options}
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
																onChange={(e: any) =>
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

														<div className='form-item position--relative'>
															<div className='input-select'>
																<Select
																	value={values.array[index].status as any}
																	onChange={(value: any) => {
																		setFieldValue(`array[${index}].status`, value);
																	}}
																	options={status}
																	styles={CUSTOM_STYLE}
																	placeholder='status...'
																/>
															</div>
															<ErrorMessage
																name={`array[${index}].status.value`}
																component='p'
																className='text--red-400 font-size--xxs pl--10 error-message mt--10'
															/>
														</div>

														{index !== values.array.length - 1 ? (
															<button
																className='login-btn  font-size--lg text--uppercase text--white border-radius--default no--border no--bg'
																type='button'
																onClick={() => {
																	arrayHelper.remove(index);
																}}
															>
																<DeleteIcon width='35px' height='35px' />
															</button>
														) : (
															<button
																className='login-btn  font-size--lg text--uppercase text--white border-radius--default no--border no--bg'
																type='submit'
																onClick={() => {
																	isValid &&
																		arrayHelper.push({
																			time: '',
																			project: {
																				label: 'project names...',
																				value: ''
																			},
																			task: ''
																		});
																}}
															>
																<PlusIcon width='35px' height='35px' />
															</button>
														)}
													</div>
												);
											});
										}}
									/>
								}
							</div>
							<div className='display-flex-center mt--20'>
								<button
									className='submit-btn font-size--lg text--uppercase text--white border-radius--default no--border'
									type='button'
								>
									submit
								</button>
							</div>
						</Form>
					);
				}}
			</Formik>
		)) || <></>
	);
};

// const initialValues = {
// 	time: '',
// 	array: [
// 		{
// 			project: {
// 				label: 'project names...',
// 				value: ''
// 			},
// 			status: {
// 				label: 'status...',
// 				value: ''
// 			},
// 			task: ''
// 		}
// 	]
// };

const formatValues = (userTask: any) => {
	if (userTask.lenght > 0) {
		const tasksArray = userTask.map((task: any, index: number) => {
			return {
				taskId: task.id,
				projectId: index,
				taskName: task.task,
				status: task.status
			};
		});
		return {
			time: '',
			array: [
				{
					project: {
						label: 'project names...',
						value: ''
					},
					status: {
						label: 'status...',
						value: ''
					},
					task: '',
					taskStat: {
						label: 'status...',
						value: ''
					}
				}
			],
			tasks: tasksArray
		};
	} else {
		return {
			time: '',
			array: [
				{
					project: {
						label: 'project names...',
						value: ''
					},
					status: {
						label: 'status...',
						value: ''
					},
					task: '',
					taskStat: {
						label: 'status...',
						value: ''
					}
				}
			],
			tasks: [
				{
					taskId: '',
					projectId: '',
					taskName: '',
					status: ''
				}
			]
		};
	}
};

export default CheckOut;
