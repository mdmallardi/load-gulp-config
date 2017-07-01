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

	// Parse build blocks in HTML files to replace references to non-optimized scripts or stylesheets.
	// @see https://www.npmjs.com/package/gulp-useref
	var useref = require('gulp-useref');

	// Gulp plugin to preprocess HTML, JavaScript, and other files
	// based on custom context or environment configuration.
	// @see https://www.npmjs.com/package/gulp-preprocess
	var preprocess = require('gulp-preprocess');

	// Source map support for Gulp.js.
	// @see https://www.npmjs.com/package/gulp-sourcemaps
	var sourcemaps = require('gulp-sourcemaps');

	// Minify files with UglifyJS.
	// @see https://www.npmjs.com/package/gulp-uglify
	var uglify = require('gulp-uglify');

	// Minify CSS with CSSO.
	// @see https://www.npmjs.com/package/gulp-csso
	var csso = require('gulp-csso');

	// A string replace plugin for gulp.
	// @see https://www.npmjs.com/package/gulp-replace
	var replace = require('gulp-replace');

	return({
		default:['vendors', 'styles', filename + ':views', function(){
			var baseTag = /(\<base\s+href\=\")([0-9a-z\-_/.]+)(\"(\s{0,})(\/?)\>)/g;
			var baseHref = './' + util.dir.assets();

			return gulp.src(util.dir.source('*.html'))
			// Startup userref to concat and replace url's from index.html.
			.pipe(useref())

			// Change the base href to released assets directory e.g. `/Content`.
			.pipe(gulpif('*.html', replace(baseTag, '$1' + baseHref + '$3')))

			// Change the VERSION of the files based on package.version to debug deploy's.
			.pipe(gulpif('*.js', preprocess({ context:{ VERSION:data.version } })))

			// Generate a source map to each JS.
			.pipe(gulpif(data.argv.release && '*.js', sourcemaps.init()))
			.pipe(gulpif(data.argv.release && '*.js', uglify()))
			.pipe(gulpif(data.argv.release && '*.js', sourcemaps.write('.', { addComment:false })))

			// Generate a CSS source map.
			.pipe(gulpif(data.argv.release && '*.css', sourcemaps.init()))
			.pipe(gulpif(data.argv.release && '*.css', csso({ debug:true })))
			.pipe(gulpif(data.argv.release && '*.css', sourcemaps.write('.')))

			// index.html sends to root dir.
			.pipe(gulpif('*.html', gulp.dest(util.dir.index())))

			// views sends to assets dir.
			.pipe(gulpif('!*.html', gulp.dest(util.dir.assets())))
			.on('end', function(){
				data.argv.release && notify({
					title:filename,
					message:'<%= options.date %> ✓ <%= file.relative %>',
					templateOptions:{ date:new Date() }
				});
			});
		}],
		views:function(){
			// Copy the templates views to released assets directory.
			return gulp.src(util.dir.views('**/*.html'))
			.pipe(useref())
			.pipe(gulp.dest(util.dir.assets('views')))
			.on('end', function(){
				data.argv.release && notify({
					title:filename +':views',
					message:'<%= options.date %> ✓ <%= file.relative %>',
					templateOptions:{ date:new Date() }
				});
			});
		}
	});
};
