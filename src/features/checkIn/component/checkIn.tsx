import React, { useEffect, useState } from 'react';
import { Formik, FormikValues, Field, ErrorMessage, Form, FieldArray } from 'formik';

import Select from 'react-select';

import { DeleteIcon, PlusIcon } from 'shared/components/icons/icons';
import { checkInValidationSchema } from 'shared/constants/validation-schema';

import '../style/checkIn.scss';
import { CUSTOM_STYLE } from 'shared/constants/constants';

import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import httpService from 'shared/services/http.service';
import { API_CONFIG } from 'shared/constants/api';

const CheckIn: React.FC = () => {
	const [maxTime, setMaxTime] = useState('23:59');
	const [checkInRes, setCheckInRes] = useState<any>([]);

	const options = [
		{ value: 'fanblast', label: 'Fanblast' },
		{ value: 'soundmind', label: 'Soundmind' },
		{ value: 'scaletrack', label: 'Scaletrack' }
	];

	const handleSubmit = (values: FormikValues) => {
		console.log(values.array, 'values');

		const uniqueTasks = new Set();
		const uniqueIdsAndTasks: any = [];

		values.array.forEach((item: any, index: number) => {
			const uniqueId = index;

			const taskName = item.task;

			uniqueTasks.add(taskName);

			uniqueIdsAndTasks.push({
				projectId: uniqueId,
				taskName: taskName
			});
		});

		const payload = {
			token: 'U0311LTNK42',
			InTime: values.time,
			tasks: uniqueIdsAndTasks
		};
		httpService
			.post(`${API_CONFIG.path.checkIn}?token=b2fac31298d5f9c57cb3cc455d14ae0f`, payload)

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
				setCheckInRes(res);
				console.log(res, 'res');

				const opt = res.projects.map((data: any, index: number) => {
					return {
						label: data.projectDetails.projectName,
						value: data.projectDetails.id
					};
				});
				console.log('opt:', opt);
			})
			.catch((err) => {
				console.error(err);
			});
	};

	useEffect(() => {
		getUserDetails();
	}, []);

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={handleSubmit}
			validationSchema={checkInValidationSchema}
			validateOnChange
			validateOnBlur
			validateOnMount
		>
			{({ setFieldValue, values, handleSubmit, isValid, errors }) => {
				return (
					<Form className='check-in__form flex flex--column mt--100' onSubmit={handleSubmit}>
						<div className=' mb--25'>
							<div className='form-item position--relative mb--20'>
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
							{
								<FieldArray
									name='array'
									render={(arrayHelper) => {
										return values.array.map((item, index) => {
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
																setFieldValue(`array[${index}].task`, e.target.value)
															}
														/>

														<ErrorMessage
															name={`array[${index}].task`}
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
															type='button'
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
	);
};

const initialValues = {
	time: '',
	array: [
		{
			project: {
				label: 'project names...',
				value: ''
			},
			task: ''
		}
	]
};

export default CheckIn;
