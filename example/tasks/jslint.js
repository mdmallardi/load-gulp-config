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

	// The classic and strict javascript lint-tool for gulp.js.
	// @see https://www.npmjs.com/package/gulp-jslint
	var jslint = require('gulp-jslint');

	return function(){
		return gulp.src([
			util.dir.scripts('**/*.js'),
			'!'+ util.dir.vendors(),
		]).pipe(jslint());
	};
};
