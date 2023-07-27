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

export {
	loginFormValidationSchema,
	forgotPasswordFormValidationSchema,
	resetPasswordValidationSchema,
	changePasswordValidationSchema,
	resetPasswordFormValidationSchema
};
