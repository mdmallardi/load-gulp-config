module.exports = function(gulp, data, util){
	'use strict';

	// Run Mocha tests.
	// @see https://www.npmjs.com/package/gulp-mocha
	var mocha = require('gulp-mocha');

	return ['lint', function(){
		return gulp.src([
			util.dir.tests('**/*.test.js')
		], { read: false }).pipe(mocha({ reporter: 'nyan' }));
	}];
};
