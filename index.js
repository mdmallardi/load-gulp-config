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

// Define a task using [Orchestrator](https://github.com/robrich/orchestrator).
// @see https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulptaskname--deps--fn
function createTask(gulp, options, taskFile){
  var cmds = [];
  var extension = path.extname(taskFile);
  var filename = path.basename(taskFile, extension);
  var task = require(taskFile)(gulp, options.data, loadGulpConfig.util, filename);
  if(typeof task === 'function'){
    gulp.task(filename, task.bind(gulp, filename));
  }else if(task === Object(task)){
    Object.keys(task).forEach(function(cmd){
      if(typeof task[cmd] === 'function'){
        var alias = [filename, ':', cmd].join('');
        gulp.task(alias, task[cmd].bind(gulp.task, cmd));
        cmds.push(alias);
      }
    });
    gulp.task(filename, cmds);
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
  options.configPath = typeof options.configPath === 'string'? options.configPath : 'tasks';
  glob.sync(options.configPath, { realpath:true }).forEach(filterFiles.bind(this, gulp, options));
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
