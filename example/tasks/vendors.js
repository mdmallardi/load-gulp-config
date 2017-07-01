module.exports = function(gulp, data, util){
	'use strict';

	// Utility functions for gulp plugins.
	// @see https://www.npmjs.com/package/gulp-util
	var gutil = require('gulp-util');

	// Conditionally run a task
	// @see https://www.npmjs.com/package/gulp-if
	var gulpif = require('gulp-if');

	// gulp plugin to send messages based on Vinyl Files or Errors to Mac OS X, Linux or Windows
	// using the node-notifier module. Fallbacks to Growl or simply logging.
	// @see https://www.npmjs.com/package/gulp-notify
	var notify = require('gulp-notify');

	// Exec plugin for gulp.
	// @see https://www.npmjs.com/package/preen
	var preen = require('preen');

	return function(callback){
		return preen.preen({
			verbose: false,
			preview: false
		}, callback);
	};
};
