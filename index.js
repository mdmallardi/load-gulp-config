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

// CoffeeScript-Object-Notation Parser. Same as JSON but for CoffeeScript objects.
// @see https://www.npmjs.com/package/cson
var CSON = require('cson');

// YAML 1.2 parser and serializer.
// @see https://www.npmjs.com/package/js-yaml
var YAML = require('js-yaml');

function isFunction(value){
	return typeof value === 'function';
}

function isString(value){
	return typeof value === 'string';
}

function isObject(value){
	return Object.prototype.toString.call(value) === '[object Object]';
}

function isLikeObject(value){
	return value === Object(value);
}

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
	}catch(error){}
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
	Object.keys(hash).forEach(function(dirname){
		hash[dirname] = rgdir(hash[dirname]);
	});
	return hash;
}

// Define a task using [Orchestrator](https://github.com/robrich/orchestrator).
// @see https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulptaskname--deps--fn
function createTask(gulp, options, taskFile){
	var defaultFn, alias, cmds = [];
	var extension = path.extname(taskFile);
	var filename = path.basename(taskFile, extension);
	var task = require(taskFile)(gulp, options.data, loadGulpConfig.util, filename);
	if(Array.isArray(task)){
		gulp.task(filename, task);
	}else if(isString(task)){
		gulp.task(filename, [task]);
	}else if(isFunction(task)){
		gulp.task(filename, task);
	}else if(isLikeObject(task)){
		Object.keys(task).forEach(function(cmd){
			if(isFunction(task[cmd])){
				if('default' === cmd){
					defaultFn = task[cmd];
				}else{
					alias = [filename, ':', cmd].join('');
					gulp.task(alias, task[cmd]);
					cmds.push(alias);
				}
			}
		});
		gulp.task(filename, cmds, defaultFn);
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
	}else if(/\.(cson)$/i.test(ext)){
		createMultitasks(gulp, CSON.parseCSONFile(taskFile));
	}
}

// Load multiple gulp tasks using globbing patterns.
function loadGulpConfig(gulp, options){
	options = Object.assign({ data:{} }, options);
	options.dirs = isObject(options.dirs)? options.dirs : {};
	options.configPath = isString(options.configPath)? options.configPath : 'tasks';
	glob.sync(options.configPath, { realpath:true }).forEach(filterFiles.bind(this, gulp, options));
	loadGulpConfig.util.dir = rgdirs(options.dirs);
}

// Externalize dependencies.
loadGulpConfig.util = {
	fs:fs,
	path:path,
	glob:glob,
	cson:CSON,
	yaml:YAML,
	readJSON:readJSON,
	readYAML:readYAML
};

// Externalize `load-gulp-config` module.
module.exports = loadGulpConfig;
