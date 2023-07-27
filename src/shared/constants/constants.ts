const FIRST_LEVEL_BREADCRUMBS = [{ name: 'home', link: '/' }];

const NUMBER_REGEX = /[0-9]*\.?[0-9]*$/;
const PASSWORD_VALIDATOR_REGEX = /^(?=.{8,})(?!.*[\s])(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+*!=]).*$/;
const EMAIL_VALIDATOR_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const DATE_AND_TIME_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])*$/;

enum HASHTAG {
	'hashtag' = 'Hashtag Name',
	'slug' = 'Slug',
	'is_active' = 'Status',
	'is_sponsored_by' = 'Sponsored by',
	'priority' = 'Priority',
	'meta_title' = 'Meta Title',
	'meta_description' = 'Meta Description'
}

export {
	FIRST_LEVEL_BREADCRUMBS,
	NUMBER_REGEX,
	PASSWORD_VALIDATOR_REGEX,
	EMAIL_VALIDATOR_REGEX,
	DATE_AND_TIME_REGEX,
	HASHTAG
};
