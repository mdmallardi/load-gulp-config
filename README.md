# load-gulp-config
> Allows you to break up your Gulpfile config by task

## Features
- Each task has its own config file e.g. tasks/git.js, tasks/styles.js, tasks/scripts.js, ...


## Installation

```terminal
npm install --save-dev adriancmiranda/load-gulp-config
````

## Usage

```javascript
// Allows you to break up your Gulpfile config by task
// @see https://github.com/adriancmiranda/load-gulp-config
var config = require('load-gulp-config');

// Specifics of npm's package.json handling
// @see https://docs.npmjs.com/files/package.json
var pack = config.utils.readJSON('package.json');

config(gulp, {
  // path to task's files, defaults to gulp dir
  configPath: config.utils.path.join('tasks', '*.js'),
  
  // data passed into config task.
  data:Object.assign({ someCfg:{}, anyValue:1, anyParams:[] }, pack)
});
```


#### Example task file creating a task

```javascript
module.exports = function(gulp, data, util, taskName){
	'use strict';

	gulp.task(taskName, ['styles:main'], function(callback){
		// return gulp.src(...);
	});
};
```

#### Example task file returning a function

```javascript
module.exports = function(){
	'use strict';

	return function(cmdName, callback){
		// return gulp.src(...);
	};
};
```


#### Example js file returning a object

```javascript
module.exports = function(gulp, data, util, filename){
	'use strict';
  
	return {
		cmd1:function(cmdName, callback){
			// return gulp.src(...);
		},
		cmd2:function(cmdName, callback){
			// ...
		}
	};
};
```
