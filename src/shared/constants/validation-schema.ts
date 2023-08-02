import * as Yup from 'yup';
import { PASSWORD_VALIDATOR_REGEX } from './constants';

const loginFormValidationSchema = Yup.object().shape({
	email: Yup.string().email('Please Enter Valid Email').required('Please Enter Email').strict(true),
	password: Yup.string()
		.required('Please Enter Password')
		.matches(PASSWORD_VALIDATOR_REGEX, 'Must Contain 8 Characters, One Number and One Special Case Character ')
		.strict(true)
});

const forgotPasswordFormValidationSchema = Yup.object().shape({
	email: Yup.string().email('Please Enter Valid Email').required('Please Enter Email').strict(true)
});

const resetPasswordValidationSchema = Yup.object().shape({
	password: Yup.string()
		.min(8, 'Password must be 8 characters long')
		.required('Password')
		.strict(true)
		.matches(
			/(?=.*\d)(?!.*[\s])(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/,
			'Password must contain 1 Small Character, 1 Upper character, 1 special character and min length should be 8'
		),
	password_confirmation: Yup.string()
		.min(8, 'Password Confirmation')
		.required('Password Confirmation')
		.strict(true)
		.test('match', 'Password does not match', function (password) {
			return password === this.parent.password;
		})
});

const changePasswordValidationSchema = Yup.object().shape({
	old_password: Yup.string().required('Old Password').strict(true),
	new_password: Yup.string()
		.required('New Password')
		.strict(true)
		.matches(
			/(?=.*\d)(?!.*[\s])(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/,
			'Password must contain 1 Small Character, 1 Upper character, 1 special character and min length should be 8'
		),
	new_password_confirmation: Yup.string()
		.required('Password Confirmation')
		.strict(true)
		.test('match', 'Password does not match', function (password) {
			return password === this.parent.new_password;
		})
});

const resetPasswordFormValidationSchema = Yup.object().shape({
	password: Yup.string()
		.required('Please Enter Password')
		.matches(PASSWORD_VALIDATOR_REGEX, 'Must Contain 8 Characters, One Number and One Special Case Character ')
		.strict(true),
	confirmPassword: Yup.string()
		.required('Please enter confirm password')
		.oneOf([Yup.ref('password'), null], 'Passwords must match')
		.strict(true)
});

const checkInValidationSchema = Yup.object().shape({
	time: Yup.string().required('Please enter time in valid format').strict(true),
	array: Yup.array().of(
		Yup.object().shape({
			project: Yup.object().shape({
				value: Yup.string().required('Please select project name').strict(true).nullable(true)
			}),
			task: Yup.string().required('Please add a task you have to perform today').strict(true)
		})
	)
});

const checkOutValidationWithOptSchema = Yup.object().shape({
	time: Yup.string().required('Please enter time in valid format').strict(true),
	tasks: Yup.array().of(
		Yup.object().shape({
			status: Yup.object().shape({
				value: Yup.string().required('Please select project status').strict(true).nullable(true)
			})
		})
	),
	array: Yup.array().of(
		Yup.object().shape({
			project: Yup.object().shape({
				value: Yup.string().required('Please select project name').strict(true).nullable(true)
			}),
			task: Yup.string().required('Please add a task you have to perform today').strict(true),
			status: Yup.object().shape({
				value: Yup.string().required('Please select task status').strict(true).nullable(true)
			})
		})
	)
});

const checkOutValidationSchema = Yup.object().shape({
	time: Yup.string().required('Please enter time in valid format').strict(true),
	tasks: Yup.array().of(
		Yup.object().shape({
			status: Yup.object().shape({
				value: Yup.string().required('Please select task status').strict(true).nullable(true)
			})
		})
	)
});

const checkOutwithNoTaskValidationSchema = Yup.object().shape({
	time: Yup.string().required('Please enter time in valid format').strict(true),
	array: Yup.array().of(
		Yup.object().shape({
			project: Yup.object().shape({
				value: Yup.string().required('Please select project name').strict(true).nullable(true)
			}),
			task: Yup.string().required('Please add a task you have to perform today').strict(true),
			status: Yup.object().shape({
				value: Yup.string().required('Please select task status').strict(true).nullable(true)
			})
		})
	)
});

export {
	loginFormValidationSchema,
	forgotPasswordFormValidationSchema,
	resetPasswordValidationSchema,
	changePasswordValidationSchema,
	resetPasswordFormValidationSchema,
	checkInValidationSchema,
	checkOutValidationSchema,
	checkOutValidationWithOptSchema,
	checkOutwithNoTaskValidationSchema
};
