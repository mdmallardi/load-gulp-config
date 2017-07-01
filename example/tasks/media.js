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

	// Minify PNG, JPEG, GIF and SVG images
	// @see https://www.npmjs.com/package/gulp-imagemin
	var imagemin = require('gulp-imagemin');

	// PNGQuant imagemin plugin.
	// @see https://www.npmjs.com/package/imagemin-pngquant
	var pngquant = require('imagemin-pngquant');

	return {
		// Copy images to assets folder. If '--release used' -> compress images
		default: [filename + ':sounds', function() {
			return gulp.src(util.dir.images('**/*.{jpg,png,gif,svg}'))
			.pipe(gulpif(data.argv.release, imagemin({
				progressive: true,
				svgoPlugins: [{ removeViewBox: false }],
				use: [pngquant()]
			})))
			.pipe(gulp.dest(util.dir.assets('media'))).on('end', function() {
				data.argv.release && notify({
					title: filename,
					message: '<%= options.date %> ✓ <%= file.relative %>',
					templateOptions: { date: new Date() }
				});
			});
		}],
		sounds: function() {
			return gulp.src(util.dir.images('sounds/**/*.{mp3,ogg}'))
			.pipe(gulp.dest(util.dir.assets('media/sounds/')))
			.on('end', function() {
				data.argv.release && notify({
					title: filename + ':sounds',
					message: '<%= options.date %> ✓ <%= file.relative %>',
					templateOptions: { date: new Date() }
				});
			});
		}
	};
};
