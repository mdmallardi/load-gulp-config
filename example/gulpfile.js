// The streaming build system
// @see https://www.npmjs.com/package/gulp
var gulp = require('gulp');

// Allows you to break up your Gulpfile config by task
// @see https://github.com/adriancmiranda/load-gulp-config
var config = require('load-gulp-config');

// Specifics of npm's package.json handling
// @see https://docs.npmjs.com/files/package.json
var pack = config.util.readJSON('package.json');

// The name caught from the root directory.
// @see https://nodejs.org/api/path.html#path_path_dirname_path
var basename = config.util.path.basename(process.cwd()).replace(/[^\w\s]+?/g, ' ');

// Yargs the modern, pirate-themed, successor to optimist.
// @see https://www.npmjs.com/package/yargs
var argv = require('yargs')
	.default('release', 0).alias('r', 'release')
	.default('arguments', undefined).alias('args', 'arguments').alias('a', 'arguments')
	.default('message', '').alias('msg', 'message').alias('m', 'message')
	.default('tag', pack.version).alias('t', 'tag')
	.default('semver', 'patch').alias('s', 'semver')
	.default('commit', 'SHA').alias('c', 'commit')
	.default('branch', '').alias('b', 'branch')
	.default('files', '').alias('f', 'files')
	.default('port', 3000)
	.default('server', '')
	.default('remote', '')
	.default('path', '')
	.default('url', '')
	.argv
;

config(gulp, {
  configPath: config.util.path.join(pack.appDirs.tasks, '*.{js,yml}'),
  data: Object.assign({ basename:basename, argv:argv }, pack),
  dirs: pack.appDirs
});
