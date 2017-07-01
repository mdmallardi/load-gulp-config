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

	// Live CSS Reload & Browser Syncing.
	// @see https://www.npmjs.com/package/browser-sync
	var browserSync = require('browser-sync').create();

	return function(){
		browserSync.init({ server:data.argv.server || util.dir.source(), port:data.argv.port });
		gulp.watch(util.dir.styles('**/*.scss'), ['styles']);
		gulp.watch(util.dir.styles('**/*.css')).on('change', browserSync.reload);
		gulp.watch(util.dir.source('*.html')).on('change', browserSync.reload);
		gulp.watch(util.dir.views('**/*.html')).on('change', browserSync.reload);
		gulp.watch(util.dir.scripts('**/*.js')).on('change', browserSync.reload);
		gulp.watch(util.dir.fonts('**/*.{eot,svg,ttf,woff,woff2}')).on('change', browserSync.reload);
		gulp.watch(util.dir.images('**/*.{jpg,png,gif,svg}')).on('change', browserSync.reload);
		gulp.watch(util.dir.videos('**/*.{webm,ogv,mp4}')).on('change', browserSync.reload);
		gulp.watch(util.dir.sounds('**/*.{mp3,ogg}')).on('change', browserSync.reload);
	};
};
