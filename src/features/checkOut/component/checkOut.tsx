import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, FormikValues, Field, ErrorMessage, Form, FieldArray } from 'formik';

import Select from 'react-select';
import TimePicker from 'react-time-picker';

import { DeleteIcon, PlusIcon } from 'shared/components/icons/icons';
import {
	checkOutValidationSchema,
	checkOutValidationWithOptSchema,
	checkOutwithNoTaskValidationSchema,
	hoursValidationSchema
} from 'shared/constants/validation-schema';
import { CUSTOM_STYLE } from 'shared/constants/constants';
import httpService from 'shared/services/http.service';
import { API_CONFIG } from 'shared/constants/api';
import CustomModal from 'shared/modal/modal';
import { getCurrentTimeString, getTodayDate } from 'shared/util/utility';

import loading from '../../../assets/images/loding.gif';

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

let initialValuesForHours: any = { hourArr: [] };

const CheckOut: React.FC = () => {
	const navigate = useNavigate();

	const [userTask, setUserTasks] = useState<any>([]);
	const [projectNames, setProjectNames] = useState<any>([]);
	const [pId, setPId] = useState<any>([]);
	const [isShowExtraField, setIsShowExtraField] = useState(false);
	const [userName, setUserName] = useState('');
	const [timeSheet, setTimeSheet] = useState<any>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isShowPopUp, setIsShowPopUp] = useState(false);
	const [uniqueProjectNames, setUniqueProjectNames] = useState<any>([]);
	const [firstPayload, setFirstPayload] = useState<any>({});
	const [isCheckOutLoading, setIsCheckOutLoading] = useState(false);
	// const [initialValuesForHours, setInitialValuesForHours] = useState<any>({ hourArr: [] });

	const { token } = useParams();

	const handleSubmit = (values: FormikValues) => {
		setIsShowPopUp(true);

		const projects: any = {};

		userTask.forEach((item: any) => {
			projects[item.projectdeatils.projectName] = item.projectId;
		});

		values.array.forEach((item: any) => {
			projects[item.project.label] = item.project.value;
		});

		const resultArray = Object.entries(projects).map(([projectName, projectId]) => ({
			projectName,
			projectId,
			hour: undefined
		}));

		setUniqueProjectNames(resultArray);
		initialValuesForHours = {
			hourArr: resultArray
		};
		// setInitialValuesForHours({
		// 	hourArr: resultArray
		// });

		const data = { ...values };
		const taskArray = data.tasks.map((item: any, index: number) => {
			return {
				...item,
				status: item.status.value,
				projectId: pId[index]
			};
		});

		const isAnyValueEmpty = () => {
			return data.array.some((item: any) => {
				return item.project.value === '' || item.status.value === '' || item.task === '';
			});
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
			if (userTask.length > 0) {
				tasks = [...taskArray, ...array];
			} else {
				tasks = [...array];
			}
		}

		const payload = {
			token: token,
			tasks: tasks,
			OutTime: values.time
		};
		setFirstPayload(payload);
	};

	const handleOnHours = (values: FormikValues) => {
		const uniqueTasks = new Set();
		const uniqueIdsAndHours: any = [];

		values.hourArr.forEach((item: any) => {
			const taskName = item.task;
			uniqueTasks.add(taskName);
			uniqueIdsAndHours.push({
				projectId: '',
				hours: item.hour || 0
			});
		});
		const finalUniqueIdsAndHours = uniqueIdsAndHours.map((item: any, index: number) => {
			return {
				...item,
				projectId: uniqueProjectNames[index].projectId
			};
		});
		const payload = {
			token: firstPayload.token,
			tasks: firstPayload.tasks,
			OutTime: firstPayload.OutTime,
			projectHours: finalUniqueIdsAndHours
		};
		setIsCheckOutLoading(true);

		httpService
			.post(`${API_CONFIG.path.checkOut}?token=${token}`, payload)
			.then(() => {
				navigate(`/${token}`);
				setIsCheckOutLoading(false);
			})
			.catch((err) => {
				setIsCheckOutLoading(false);
				console.error(err);
			});
	};

	const getUserDetails = () => {
		setIsLoading(true);
		httpService
			.get(`${API_CONFIG.path.getUserDetails}?token=${token}`)

			.then((res) => {
				setIsLoading(false);
				setUserTasks(res.findUser[0].usertasks);

				res?.findUser && setUserName(res.findUser[0].realName);
				res?.findUser && setTimeSheet(res.findUser[0]?.timesheet[0]);

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
				setIsLoading(false);
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
				array: [] as any,
				tasks: tasksArray
			};
		} else {
			return {
				time: currentTime,
				array: [] as any,
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
		(!isLoading && (
			<>
				<Formik
					initialValues={formatValues(userTask)}
					onSubmit={handleSubmit}
					validationSchema={
						isShowExtraField
							? userTask.length > 0
								? checkOutValidationWithOptSchema
								: checkOutwithNoTaskValidationSchema
							: userTask.length > 0
							? checkOutValidationSchema
							: ''
					}
					validateOnChange
					validateOnBlur
					validateOnMount
					// enableReinitialize
				>
					{({ setFieldValue, values, handleSubmit }) => {
						return (
							<>
								{userName && (
									<h3 className='text--primary mb--20 mt--60 mb--60 text--center'>
										Hello, {userName}
									</h3>
								)}
								<Form className='check-in__form check-out flex flex--column' onSubmit={handleSubmit}>
									<h4 className='text--primary no--margin mb--20 text--center'>Check Out</h4>
									<p className='text--black text--center no--margin mb--10 font-size--md font--semi-bold mr--15'>
										Date:
										<span className='font--regular ml--5 font-size--browser-default'>
											{timeSheet.date}
										</span>
									</p>
									<h6 className='text--black text--center no--margin mb--25 font-size--md font--semi-bold mr--15'>
										Check-In:
										<span className='font--regular ml--5 font-size--browser-default'>
											{timeSheet.inTime.slice(0, -3)}
										</span>
									</h6>

									<>
										<div className='mb--25'>
											<div className='form-item position--relative'>
												<p className='text--black font--medium mb--10 font-size--browser-default'>
													Enter time in 24 hour format.
												</p>
												<div className='flex align-items--baseline'>
													<TimePicker
														value={values.time}
														maxTime={
															timeSheet.date === getTodayDate()
																? getCurrentTimeString()
																: undefined
														}
														className='time-input font--regular border-radius--sm text--black'
														name='time'
														onChange={(time: any) => {
															setFieldValue('time', time);
														}}
														format='HH:mm'
														clockIcon={null}
													/>
												</div>

												<ErrorMessage
													name={'time'}
													component='p'
													className='text--red-400 font-size--xxs pl--10 error-message mt--10'
												/>
											</div>

											<div className='task-status mt--20 mb--20'>
												{userTask.length === 0 && (
													<h6 className='text--black no--margin text--center'>
														No task added
													</h6>
												)}
												{userTask.map((data: any, index: number) => {
													return (
														<div
															className='user-task flex align-items--center justify-content--around mb--20'
															key={index}
														>
															<h6 className='text--black no--margin width--150px'>
																{data.projectdeatils.projectName
																	.charAt(0)
																	.toUpperCase() +
																	data.projectdeatils.projectName.slice(1)}
															</h6>

															<p className='task-name text--black width--150px'>
																{data.task.charAt(0).toUpperCase() + data.task.slice(1)}
															</p>
															<div className='form-item position--relative'>
																<div className='input-select'>
																	<Select
																		value={values.tasks[index].status}
																		onChange={(value: any) => {
																			setFieldValue(
																				`tasks[${index}].status`,
																				value
																			);
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

											<FieldArray
												name='array'
												render={(arrayHelper) => {
													return values.array && values.array.length > 0 ? (
														values.array.map((item: any, index: number) => (
															<div
																key={index}
																className='extra-task flex justify-content--between mb--15'
															>
																<div className='form-item position--relative'>
																	<div className='input-select'>
																		<Select
																			value={values.array[index].project as any}
																			onChange={(value: any) => {
																				setFieldValue(
																					`array[${index}].project`,
																					value
																				);
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
																		onChange={(
																			e: React.ChangeEvent<HTMLInputElement>
																		) =>
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
																				setFieldValue(
																					`array[${index}].status`,
																					value
																				);
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
																					project:
																						projectNames.length === 1
																							? projectNames[0]
																							: values.array[index]
																									.project,
																					task: '',
																					status: {
																						label: 'status...',
																						value: ''
																					}
																				});
																			}}
																			disabled={values.array.some(
																				(item: any) =>
																					!item.project.value ||
																					!item.task ||
																					!item.status.value
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
																onClick={(e: any) => {
																	e.preventDefault();
																	e.stopPropagation();
																	setIsShowExtraField(!isShowExtraField);
																	arrayHelper.push({
																		project:
																			projectNames.length === 1
																				? projectNames[0]
																				: initOpt,
																		status: {
																			label: 'Status...',
																			value: ''
																		},
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
									</>
									<div className='display-flex-center mt--20'>
										<button
											className='submit-btn font-size--lg text--uppercase text--white border-radius--default no--border'
											type='button'
											onClick={() => handleSubmit()}
											disabled={
												values.array.length === 0 &&
												values.tasks.length === 1 &&
												Object.values(values.tasks[0]).every((value) => value === '')
											}
										>
											Continue
										</button>
									</div>
								</Form>
							</>
						);
					}}
				</Formik>
				{isShowPopUp && initialValuesForHours.hourArr.length >= 0 && (
					<CustomModal show handleClose={() => setIsShowPopUp(false)} className='hours-popup'>
						<Formik
							initialValues={initialValuesForHours}
							validationSchema={hoursValidationSchema}
							validateOnChange
							validateOnBlur
							enableReinitialize
							onSubmit={handleOnHours}
						>
							{({ setFieldValue, values, handleSubmit }) => {
								return (
									<Form onSubmit={handleSubmit}>
										<h4 className='text--primary font-size--22 font--semi-bold no--margin mb--35 text--center'>
											Please enter project spend hours
										</h4>

										<div className='flex flex flex--column justify-content--around'>
											<FieldArray
												name='hourArr'
												render={() => {
													return values.hourArr.map((item: any, index: number) => (
														<div
															key={item.projectName}
															className='flex justify-content--around align-items--center mb--25'
														>
															<h6 className='font--medium text--black no--margin width--150px'>
																{item.projectName.charAt(0).toUpperCase() +
																	item.projectName.slice(1)}
															</h6>
															<div className='form-item position--relative'>
																<div className='text-input text--black'>
																	<Field
																		name={`hourArr[${index}].hour`}
																		type='number'
																		className='input-field hour-input font--regular  border-radius--sm text--black'
																		autoComplete='off'
																		placeholder='Enter hours'
																		onChange={(
																			e: React.ChangeEvent<HTMLInputElement>
																		) =>
																			setFieldValue(
																				`hourArr[${index}].hour`,
																				e.target.value
																			)
																		}
																	/>
																</div>
																<ErrorMessage
																	name={`hourArr[${index}].hour`}
																	component='p'
																	className='position--absolute text--red-400 font-size--xxs pl--10 error-message mt--5 mb--10'
																/>
															</div>
														</div>
													));
												}}
											/>
										</div>
										<div className='display-flex-center mt--20'>
											<button
												className='submit-btn font-size--lg text--uppercase text--white border-radius--default no--border'
												type='submit'
											>
												{isCheckOutLoading ? (
													<img src={loading} alt='loader' className='loading-img' />
												) : (
													'submit'
												)}
											</button>
										</div>
									</Form>
								);
							}}
						</Formik>
					</CustomModal>
				)}
			</>
		)) || <></>
	);
};

export default CheckOut;
