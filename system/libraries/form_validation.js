var util = require('util');
var xss = require('xss');

var form_validation = function(data, errorMessages){
	this.data = data;

	this.fields = {};
	this.errors = {};
	this.numberOfValidationTasks = 0;

	this.errorMessages = errorMessages || require('../language/errorMessages');
};

/**
	required
	validates that value is not undefined, null, NaN, empty string or digit zero
 **/
form_validation.prototype.required = function(value, options, callback){
	callback(Boolean(value && value.toString().length > 0), options);
};

/**
	execute a validation code if value has a value, 
	otherwise call the callback with true
 **/
form_validation.prototype._validate = function(fn, value, options, callback){
	value? this[fn](value.toString(), options, callback): callback(true, options); 
};

/**
	minLength
	options[0] == min length
	validates that value.length is greater than or equal to min length
 **/
form_validation.prototype.minLength = function(value, options, callback){
	callback(Boolean(value.length >= options[0]), options);
};

/**
	maxLength
	options[0] == max length
	validates that value.length is less than or equal to max length
 **/
form_validation.prototype.maxLength = function(value, options, callback){
	callback(Boolean(value.length <= options[0]), options);
};

/**
	exactLength
	options[0] == exact length
	validates that value.length is equal to exact length
 **/
form_validation.prototype.exactLength = function(value, options, callback){
	callback(Boolean(value.length == options[0]), options);
};

/**
	greaterThan
	options[0] == camprable
	validates that value is greater than comparable
 **/
form_validation.prototype.greaterThan = function(value, options, callback){
	callback(Boolean(parseInt(value) > parseInt(options[0])), options);
};

/**
	lessThan
	options[0] == camprable
	validates that value is less than comparable
 **/
form_validation.prototype.lessThan = function(value, options, callback){
	callback(Boolean(parseInt(value) < parseInt(options[0])), options);
};

/**
	alpha
	validates that value contains only alphabet characters
 **/
form_validation.prototype.alpha = function(value, options, callback){
	callback(Boolean(value.match(/^[a-z]+$/gi)), options);
};

/**
	alphaNumeric
	validates that value contains only alphabet and/or numbers characters
 **/
form_validation.prototype.alphaNumeric = function(value, options, callback){
	callback(Boolean(value.match(/^[a-z0-9]+$/gi)), options);
};

/**
	alphaNumericDash
	validates that value contains only alphabet, numbers and/or dash characters
 **/
form_validation.prototype.alphaNumericDash = function(value, options, callback){
	callback(Boolean(value.match(/^[a-z0-9\-]+$/gi)), options);
};

/**
	numeric
	validates that value contains only numbers
 **/
form_validation.prototype.numeric = function(value, options, callback){
	callback(Boolean(value.match(/^[0-9]+$/gi)), options);
};

/**
	integer
	validates that value is integer
 **/
form_validation.prototype.integer = function(value, options, callback){
	callback(Boolean(value.match(/^[\-\+]?[0-9]+$/gi)), options);
};

/**
	decimal
	validates that value is decimal number
 **/
form_validation.prototype.decimal = function(value, options, callback){
	callback(Boolean(value.match(/^[\-\+]?[0-9]+(\.[0-9]+)?$/gi)), options);
};

/**
	natural
	validates that value is natural number
 **/
form_validation.prototype.natural = function(value, options, callback){
	callback(Boolean(value.match(/^[\+]?[0-9]+?$/gi)), options);
};

/**
	naturalNoZero
	validates that value is a natural number and not zero
 **/
form_validation.prototype.naturalNoZero = function(value, options, callback){
	callback(Boolean(value.match(/^[\+]?[0-9]+?$/gi) && parseInt(value) > 0), options);
};

/**
	email
	validates that value looks like an email
 **/
form_validation.prototype.email = function(value, options, callback){
	callback(Boolean(value.match(/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/gi)), options);
};

/**
	regex
	options[0] == comparable pattern
	validates that value matches a given pattern
 **/
form_validation.prototype.regex = function(value, options, callback){
	var regularExpression = new RegExp(options.shift(), 'gi');
	callback(Boolean(value.match(regularExpression)), options);
};

/**
	matches
	options[0] == comparable value
	validates that value matches a given value
 **/
form_validation.prototype.matches = function(value, options, callback){
	callback(Boolean(value == options[0]), options);
};

/**
	sanitize
	returns the value after sanitized
 **/
form_validation.prototype.sanitize = function(value){
	if(value)
		return xss(value.toString().trim());
	return value;
};

/**
	rules that need options argument
 **/
form_validation.prototype.rulesWithOptions = ['minLength', 'maxLength', 'exactLength', 'greaterThan', 'lessThan', 'regex', 'matches'];

/** 
	addRule  
	args 
		fieldName(property name in data object) 
		friendly name for error messages
		rules spearated by |
 **/
form_validation.prototype.addRule = function (fieldName, friendlyName, rules){	
	
	this.fields[fieldName] = {
		fieldName: fieldName,
		friendlyName: friendlyName,
		rules: []
	};

	var REGULAR_EXPRESSION = '#REGEX' + Math.random() + '#';

	var regex = rules.match(/regex\[.+\]/gi);

	if(regex && regex.length)
	{
		regex = regex[0];
		rules = rules.replace(regex, REGULAR_EXPRESSION);
	}

	rules = rules.split('|');

	if(regex)
	{
		for(var i = 0; i < rules.length; i++)
			rules[i] = rules[i].replace(REGULAR_EXPRESSION, regex);
	}

	for(var i = 0; i < rules.length; i++)
	{
		var options = rules[i].match(/\[.+\]/gi);

		if(options)
			options = options[0].replace('[','').replace(new RegExp(']$'),'').split(',');
		else
			options = [];

		var ruleName = rules[i].replace(/\[.+\]/gi,'');

		if(this[ruleName])
		{
			if(this.rulesWithOptions.indexOf(ruleName) != -1 && !options.length)
				throw new Error(ruleName + ' can\'t operate without options.');

			if(ruleName == 'matches')
				options[0] = this.data[options[0]];

			if(ruleName == 'regex')
			{
				try 
				{
					new RegExp(options[0], 'gi');
				}
				catch(e)
				{
					throw new Error('regex expression is invalid.');
				}
			}

			if(ruleName == 'sanitize')
			{
				if(this.data[fieldName])
					this.data[fieldName] = this.sanitize(this.data[fieldName]);
			}
			else
			{
				this.numberOfValidationTasks++;

				var rule = {
					ruleName: ruleName,
					options: options
				};

				this.fields[fieldName].rules.push(rule);
			}
		}
		else
			throw new Error('rule doesn\'t exist.');
	}
};

/**
	run
	execute the validation rules logic returing error messages when there are validation errors and the new data field in case of success
 **/
form_validation.prototype.run = function(callback){
	
	if(this.numberOfValidationTasks == 0)
		return callback(null, this.data);
	
	var self = this;

	var numberOfCompletedValidationTasks = 0;

	var __callback = function(form_validation, options){
		if(!form_validation)
		{
			var fieldData = options[options.length - 1];

			delete options[options.length - 1];

			var errorMessageParams = [self.errorMessages[fieldData.ruleName], fieldData.friendlyName || fieldData.fieldName];

			for(var i = 0; i < options.length; i++)
			{
				if(options[i])
					errorMessageParams.push(options[i]);
			}

			var errorMessage = util.format.apply(self, errorMessageParams);
			self.errors[fieldData.fieldName].push(errorMessage);
		}

		numberOfCompletedValidationTasks++;

		if(numberOfCompletedValidationTasks === self.numberOfValidationTasks)
		{
			var numberOfErrorsFound = 0;

			for(var fieldName in self.errors)
			{
				if(self.errors[fieldName].length != 0) 
				{
					numberOfErrorsFound++;
					self.errors[fieldName] = (self.errors[fieldName]).join('<br>');
				}
			}

			callback(numberOfErrorsFound? self.errors : null, self.data);
		}
	};

	for(var fieldName in self.fields)
	{
		if(self.fields[fieldName].rules.length)
		{
			self.errors[fieldName] = [];

			for(var i = 0; i < self.fields[fieldName].rules.length; i++)
			{
				var value = self.data[fieldName];
				var options = self.fields[fieldName].rules[i].options;
				var fieldData = self.fields[fieldName];
				fieldData.ruleName = self.fields[fieldName].rules[i].ruleName;
				options.push(fieldData);

				if(self.fields[fieldName].rules[i].ruleName == 'required')
					self[self.fields[fieldName].rules[i].ruleName](value, options, __callback);
				else
					self._validate(self.fields[fieldName].rules[i].ruleName, value, options, __callback);
			}
		}
	}
};

module.exports = form_validation;
