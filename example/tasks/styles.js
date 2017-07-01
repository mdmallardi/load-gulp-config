module.exports = function(gulp, data, util, filename){
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

	// Gulp plugin for sass.
	// @see https://www.npmjs.com/package/gulp-sass
	var sass = require('gulp-sass');

	// Prefix CSS.
	// @see https://www.npmjs.com/package/gulp-autoprefixer
	var autoprefixer = require('gulp-autoprefixer');

	// Source map support.
	// @see https://www.npmjs.com/package/sourcemaps
	var sourcemaps = require('gulp-sourcemaps');

	// Minify CSS with CSSO.
	// @see https://www.npmjs.com/package/gulp-csso
	var csso = require('gulp-csso');

	// Css importer for node-sass
	// @see https://www.npmjs.com/package/node-sass-css-importer
	var cssImporter = require('node-sass-css-importer');

	return({
		// Compile SASS to CSS. If '--release used' -> minify css
		default:[filename + ':fonts', filename + ':fonts_vendors', function() {
			return gulp.src(util.dir.styles('**/*.{scss,sass}'))
			.pipe(sourcemaps.init())
			.pipe(sass({ importer: [cssImporter({ import_paths: [util.dir.vendors()] })] }).on('error', sass.logError))
			.pipe(autoprefixer({ browsers:['last 2 versions', '> 1%', 'ios 7.1', 'android 4.1', 'ie 9'] }))
			.pipe(gulpif(data.argv.release, csso()))
			.pipe(sourcemaps.write('.', { addComment: false }))
			.pipe(gulpif(data.argv.release, gulp.dest(util.dir.assets('styles/'))))
			.pipe(gulpif(!data.argv.release, gulp.dest(util.dir.styles())))
			.on('end', function() {
				data.argv.release && notify({
					title: filename,
					message: '<%= options.date %> ✓ <%= file.relative %>',
					templateOptions: { date: new Date() }
				});
			});
		}],
		fonts:function(){
			return gulp.src(util.dir.styles('**/*.{eot,svg,ttf,woff,woff2}'))
			.pipe(gulp.dest(util.dir.assets('styles/')))
			.on('end', function() {
				data.argv.release && notify({
					title: filename + ':fonts',
					message: '<%= options.date %> ✓ <%= file.relative %>',
					templateOptions: { date: new Date() }
				});
			});
		},
		fonts_vendors:function() {
			return gulp.src(util.dir.vendors('**/*.{eot,svg,ttf,woff,woff2}'))
			.pipe(gulp.dest(util.dir.assets('scripts/vendors/')))
			.on('end', function() {
				data.argv.release && notify({
					title: filename + ':fonts_vendors',
					message: '<%= options.date %> ✓ <%= file.relative %>',
					templateOptions: { date: new Date() }
				});
			});
		}
	});
};
