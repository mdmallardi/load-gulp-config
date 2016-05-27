# load-gulp-config
> Allows you to break up your Gulpfile config by task

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
  // path to task.js files, defaults to grunt dir
  configPath: config.utils.path.join('tasks', '*.js'),
  
  // data passed into config task.
  data:Object.assign({ someCfg:{}, anyValue:1, anyParams:[] }, pack)
});
```


#### Example js file creating a task

```javascript
module.exports = function(gulp, data, util, filename){
	'use strict';

	gulp.task(filename, ['styles:main'], function(callback){
		gulp.watch(util.path.join('styles', '**/*.scss'), ['styles:main']);
	});
};
```

#### Example js file returning a function

```javascript
module.exports = function(){
	'use strict';

	return function(taskName, callback){
		// return gulp.src(...);
	};
};
```


#### Example js file returning a object

```javascript
module.exports = function(gulp, data, util, filename){
	'use strict';
  
	return {
		cmd1:function(taskName, callback){
			// return gulp.src(...);
		},
		cmd2:function(taskName, callback){
			// ...
		}
	};
};
```
