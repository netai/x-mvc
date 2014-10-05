var errorMessages = {
	required: '%s field is required.',
	matches: '%s field doesn\'t match %s field.',
	minLength: '%s field must a have a minimum length of %s.',
	maxLength: '%s field mustn\'t exceed a maximum length of %s.',
	exactLength: '%s field must have an exact length of %s.',
	greaterThan: '%s field must be greater than %s.',
	lessThan: '%s field must be less than %s.',
	regex: '%s field isn\'t valid.',
	alpha: '%s field must contain only alphabetical characters.',
	alphaNumeric: '%s field must contain only alphabetical characters and/or numbers.',
	alphaDash: '%s field must contain only alphabetical characters, numbers and/or dashes.',
	numeric: '%s field must contain only numbers.',
	integer: '%s field must contain only integer numbers.',
	decimal: '%s field must contain only decimal numbers.',
	natural: '%s field must contain only integer number that is greater than or equal to 0.',
	naturalNoZero: '%s field must contain only integer number that is greater than 0.',
	email: '%s field must contain a valid email address.'
};

module.exports = errorMessages;