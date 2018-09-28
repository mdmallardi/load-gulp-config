'use strict';

// File I/O is provided by simple wrappers around standard POSIX functions.
// @see https://nodejs.org/api/fs.html
var fs = require('fs');

// This module contains utilities for handling and transforming file paths.
// @see https://nodejs.org/api/path.html
var path = require('path');

// A little globber
// @see https://www.npmjs.com/package/glob
var glob = require('glob');

// YAML 1.2 parser and serializer.
// @see https://www.npmjs.com/package/js-yaml
var YAML = require('js-yaml');

// https://tc39.github.io/ecma262/#sec-terms-and-definitions-function
// @see https://www.npmjs.com/package/describe-type
var isFunction = require('describe-type/is/callable');

// https://tc39.github.io/ecma262/#sec-terms-and-definitions-string-type
// @see https://www.npmjs.com/package/describe-type
var isString = require('describe-type/is/string');

// https://tc39.github.io/ecma262/#sec-terms-and-definitions-object
// @see https://www.npmjs.com/package/describe-type
var isObject = require('describe-type/is/object');

// https://tc39.github.io/ecma262/#sec-exotic-object
// @see https://www.npmjs.com/package/describe-type
var isExotic = require('describe-type/is/exotic');

// The reduce() method applies a function against an accumulator and each
// element in the array (from left to right) to reduce it to a single value.
// @see https://www.npmjs.com/package/describe-type
var reduce = require('describe-type/ponyfill/Array.prototype.reduce');

// The reduce() method applies a function against an accumulator and each
// element in the array (from left to right) to reduce it to a single value.
// @see https://www.npmjs.com/package/describe-type
var keys = require('describe-type/ponyfill/Object.keys');

// Synchronous version of `fs.readFile`. Returns the contents of the file and parse to JSON.
// @see https://nodejs.org/api/fs.html#fs_fs_readfilesync_file_options
function readJSON(filepath){
	var buffer = {};
	try{
		buffer = JSON.parse(fs.readFileSync(filepath, { encoding:'utf8' }));
	} catch(error){}
	return buffer;
}

// Synchronous version of `fs.readFile`. Returns the contents of the file and parse to YAML.
// @see https://nodejs.org/api/fs.html#fs_fs_readfilesync_file_options
function readYAML(filepath){
	var buffer = {};
	try{
		buffer = YAML.safeLoad(fs.readFileSync(filepath, { schema:YAML.DEFAULT_FULL_SCHEMA }));
	}catch(error){
		console.error(error);
	}
	return buffer;
}

// Join all arguments together and normalize the resulting path.
function rgdir(dirname){
	return function(){
		var args = Array.prototype.slice.call(arguments);
		if(args.length){
			return path.join.apply(path.join, [dirname].concat(args));
		}
		return dirname;
	};
}

function rgdirs(hash){
	keys(hash).forEach(function(dirname){
		hash[dirname] = rgdir(hash[dirname]);
	});
	return hash;
}

function mapTaskObject(filename, task, cmd){
	var fn, isDefault = /^default$/i.test(cmd);
	filename = isDefault ? filename : [filename, ':', cmd].join('');
	cmd = task[cmd];
	if(isFunction(cmd)){
		return { name:filename, isDefault:isDefault, fn:cmd };
	}else if(Array.isArray(cmd)){
		return reduce(cmd, function (acc, item, index) {
			if(isFunction(item)){
				acc.fn = item;
			}else if(isString(item) && acc.fn){
				acc.sequence.push(item);
			}else if(isString(item)){
				acc.cmds.push(item);
			}else if(array.of(String, item)) {
				acc.sequence.push(item);
			}
			return acc;
		}, { name:filename, isDefault:isDefault, fn:null, cmds:[], sequence:[] });
	}
}

// Define a task using [Orchestrator](https://github.com/robrich/orchestrator).
// @see https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulptaskname--deps--fn
function createTask(gulp, options, taskFile){
	var fn;
	var extension = path.extname(taskFile);
	var filename = path.basename(taskFile, extension);
	var task = require(taskFile)(gulp, options.data, loadGulpConfig.util, filename);
	if(Array.isArray(task)){
		fn = isFunction(task[task.length - 1]) ? task.pop() : void(0);
		gulp.task(filename, task, fn);
	}else if(isString(task)){
		gulp.task(filename, [task]);
	}else if(isFunction(task)){
		gulp.task(filename, task);
	}else if(isExotic(task)){
		keys(task).map(mapTaskObject.bind(this, filename, task)).forEach(function(task){
			if(task.cmds){
				if(isFunction(task.fn)){
					gulp.task(task.name, task.cmds, task.fn);
				}else{
					gulp.task(task.name, task.cmds);
				}
			}else{
				gulp.task(task.name, task.fn);
			}
		});
	}
}

// Configure multitasks from aliases.yml
function createMultitasks(gulp, aliases){
	for(var task in aliases){
		if(aliases.hasOwnProperty(task)){
			var cmds = [];
			aliases[task].forEach(function(cmd){
				cmds.push(cmd);
			});
			gulp.task(task, cmds);
		}
	}
	return aliases;
}

// Filter files by extension.
function filterFiles(gulp, options, taskFile){
	var ext = path.extname(taskFile);
	if(/\.(js|coffee)$/i.test(ext)){
		createTask(gulp, options, taskFile);
	}else if(/\.(json)$/i.test(ext)){
		createMultitasks(gulp, require(taskFile));
	}else if(/\.(ya?ml)$/i.test(ext)){
		createMultitasks(gulp, readYAML(taskFile));
	}
}

// Load multiple gulp tasks using globbing patterns.
function loadGulpConfig(gulp, options){
	options = Object.assign({ data:{} }, options);
	options.dirs = isObject(options.dirs) ? options.dirs : {};
	options.configPath = isString(options.configPath) ? options.configPath : 'tasks';
	glob.sync(options.configPath, { realpath:true }).forEach(filterFiles.bind(this, gulp, options));
	loadGulpConfig.util.dir = rgdirs(options.dirs);
}

// Externalize dependencies.
loadGulpConfig.util = {
	fs:fs,
	path:path,
	glob:glob,
	yaml:YAML,
	readJSON:readJSON,
	readYAML:readYAML
};

// Externalize `load-gulp-config` module.
module.exports = loadGulpConfig;
