import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, FormikValues, Field, ErrorMessage, Form, FieldArray } from 'formik';

import Select from 'react-select';

import { DeleteIcon, PlusIcon } from 'shared/components/icons/icons';
import { checkInValidationSchema } from 'shared/constants/validation-schema';
import httpService from 'shared/services/http.service';
import { API_CONFIG } from 'shared/constants/api';
import { CUSTOM_STYLE } from 'shared/constants/constants';
import { notify } from 'shared/components/notification/notification';

import loading from '../../../assets/images/loding.gif';

import '../style/checkIn.scss';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import UserDetail from './userDetail';

const CheckIn: React.FC = () => {
	const navigate = useNavigate();

	const [projectNames, setProjectNames] = useState<any>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isCheckInLoading, setIsCheckInLoading] = useState(false);
	const [userDetail, setUserDetail] = useState<any>([]);

	const { token } = useParams();

	const handleSubmit = async (values: FormikValues) => {
		try {
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
			setIsCheckInLoading(true);

			await httpService.post(`${API_CONFIG.path.checkIn}?token=${token}`, payload);

			notify('You have successfully checked in', 'success');
			navigate(`/${token}`);
			setIsCheckInLoading(false);
		} catch (err) {
			setIsCheckInLoading(false);
			console.error(err);
		}
	};

	const getUserDetails = () => {
		httpService
			.get(`${API_CONFIG.path.getUserDetails}?token=${token}`)

			.then((res) => {
				console.log('res:', res.findUser);
				const projectNames = res.projects.map((data: any) => {
					return {
						label: data.projectName,
						value: data.id
					};
				});

				setUserDetail(res.findUser[0]);

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

	return (
		<>
			<UserDetail userDetail={userDetail} isLoading={isLoading} />

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
							<Form className='check-in__form flex flex--column mt--25' onSubmit={handleSubmit}>
								<h4 className='text--primary no--margin mb--20 text--center'>Check In</h4>
								<div className='mb--25'>
									<p className='text--black font--medium mb--10 font-size--browser-default'>
										Time (24 hour)
									</p>
									<div className='form-item flex flex--column justify-content--between mb--20'>
										<Field
											values={values}
											name={'time'}
											type='text'
											className='input-field new-time__input font--regular border-radius--sm text--black'
											autoComplete='off'
											placeholder='00:00'
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
												let formattedTime = e.target.value.replace(/\D/g, '');

												if (formattedTime.length > 2) {
													formattedTime = `${formattedTime.slice(0, 2)}:${formattedTime.slice(
														2
													)}`;
												}
												if (formattedTime.length > 5) {
													return;
												}
												setFieldValue('time', formattedTime);
											}}
										/>
										<ErrorMessage
											name={'time'}
											component='p'
											className='text--red-400 font-size--xxs  error-message mt--10'
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
												<div className='flex justify-content--end align-items--center'>
													<h6 className='text--black no--margin mr--15'>Add task here...</h6>
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
										{isCheckInLoading ? (
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
			)}
		</>
	);
};

const initialValues = {
	time: '',
	array: [] as any
};

const initOpt = { label: 'project names...', value: '' };

export default CheckIn;
