import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, FormikValues, Field, ErrorMessage, Form, FieldArray } from 'formik';

import Select from 'react-select';
import TimePicker from 'react-time-picker';

import { DeleteIcon, PlusIcon } from 'shared/components/icons/icons';
import { checkOutValidationSchema } from 'shared/constants/validation-schema';
import { CUSTOM_STYLE } from 'shared/constants/constants';
import httpService from 'shared/services/http.service';
import { API_CONFIG } from 'shared/constants/api';

import '../../checkIn/style/checkIn.scss';
import '../style/checkOut.scss';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';

const status = [
	{ value: 'pending', label: 'Pending' },
	{ value: 'complete', label: 'Complete' },
	{ value: 'continue', label: 'Continue' },
	{ value: 'hold', label: 'Hold' }
];

const CheckOut: React.FC = () => {
	const navigate = useNavigate();

	const [maxTime, setMaxTime] = useState('23:59');
	const [userTask, setUserTasks] = useState<any>([]);
	const [projectNames, setProjectNames] = useState<any>([]);
	const [pId, setPId] = useState<any>([]);

	const { token } = useParams();

	const handleSubmit = (values: FormikValues) => {
		const data = { ...values };
		const taskArray = data.tasks.map((item: any, index: number) => {
			return {
				...item,
				status: item.status.value,
				projectId: pId[index]
			};
		});

		const isAnyValueEmpty = () => {
			return data.array.some(
				(item: any) => item.project.value === '' || item.status.value === '' || item.status === ''
			);
		};

		const array = data.array.map((item: any) => {
			return {
				projectId: item.project.value,
				status: item.status.value,
				taskId: '',
				taskName: item.task
			};
		});

		let tasks;
		if (isAnyValueEmpty()) {
			tasks = taskArray;
		} else {
			tasks = [...taskArray, ...array];
		}

		const payload = {
			token: token,
			tasks: tasks,
			OutTime: values.time
		};

		httpService
			.post(`${API_CONFIG.path.checkOut}?token=${token}`, payload)

			.then(() => {
				navigate(`/${token}`);
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
			.get(`${API_CONFIG.path.getUserDetails}?token=${token}`)

			.then((res) => {
				setUserTasks(res.findUser[0].usertasks);

				const projectNames = res.projects.map((data: any) => {
					return {
						label: data.projectName,
						value: data.id
					};
				});
				setProjectNames(projectNames);

				const projectId = res.findUser[0].usertasks.map((id: any) => {
					return id.projectId;
				});

				setPId(projectId);
			})
			.catch((err) => {
				console.error(err);
			});
	};

	useEffect(() => {
		getUserDetails();
	}, []);

	const initOpt = { label: 'project names...', value: '' };

	const formatValues = (userTask: any) => {
		const currentTime = new Date().toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit'
		});

		if (userTask.length > 0) {
			const tasksArray = userTask.map((task: any) => {
				return {
					taskId: task.id,
					taskName: task.task,
					status: { value: task.status, label: 'Status' }
				};
			});

			return {
				time: currentTime,
				array: [
					{
						project: projectNames.length === 1 ? projectNames[0] : initOpt,
						status: {
							label: 'status...',
							value: ''
						},
						task: ''
					}
				],
				tasks: tasksArray
			};
		} else {
			return {
				time: currentTime,
				array: [
					{
						project: projectNames.length === 1 ? projectNames[0] : initOpt,
						status: {
							label: 'status...',
							value: ''
						},
						task: ''
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

	return (
		(userTask.length > 0 && (
			<Formik
				initialValues={formatValues(userTask)}
				onSubmit={handleSubmit}
				validationSchema={checkOutValidationSchema}
				validateOnChange
				validateOnBlur
				validateOnMount
				enableReinitialize
			>
				{({ setFieldValue, values, handleSubmit, isValid }) => {
					return (
						<Form className='check-in__form check-out flex flex--column mt--100' onSubmit={handleSubmit}>
							<h4 className='text--primary no--margin mb--20 text--center'>Check Out</h4>
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
										format='HH:mm'
										clockIcon={null}
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
												<h6 className='text--black no--margin'>
													{data.projectdeatils.projectName}
												</h6>

												<p className='task-name text--black'>{data.task}</p>
												<div className='form-item position--relative'>
													<div className='input-select'>
														<Select
															value={values.tasks[index].status}
															onChange={(value: any) => {
																setFieldValue(`tasks[${index}].status`, value);
															}}
															options={status}
															styles={CUSTOM_STYLE}
															placeholder='status...'
															name={`tasks[${index}].status`}
														/>
													</div>
													<ErrorMessage
														name={`tasks[${index}].status.value`}
														component='p'
														key={index}
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
									type='submit'
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

export default CheckOut;
