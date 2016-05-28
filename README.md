# load-gulp-config
> Allows you to break up your Gulpfile config by task

[![dependencies status][david_dependencies_status_image]][david_dependencies_status_url] 
[![devDependency status][david_devdependencies_status_image]][david_devdependencies_status_url]

<!-- david dependencies -->
[david_dependencies_status_image]: https://david-dm.org/adriancmiranda/load-gulp-config.png?theme=shields.io
[david_dependencies_status_url]: https://david-dm.org/adriancmiranda/load-gulp-config "dependencies status"

<!-- david devDependencies -->
[david_devdependencies_status_image]: https://david-dm.org/adriancmiranda/load-gulp-config/dev-status.png?theme=shields.io
[david_devdependencies_status_url]: https://david-dm.org/adriancmiranda/load-gulp-config#info=devDependencies "devDependencies status"

<!-- sourcegraph - views -->
[sourcegraph_views_image]: https://sourcegraph.com/api/repos/github.com/adriancmiranda/load-gulp-config/counters/views.png
[sourcegraph_views_url]: https://sourcegraph.com/github.com/adriancmiranda/load-gulp-config "views"


## Features
- Each task has its own config file e.g. `tasks/git.js`, `tasks/styles.js`, `tasks/scripts.js`, ...
- Easily register task aliases with aliases `YAML` or `CSON` files.
- Support for `CoffeeScript` files.


## Installation

```terminal
npm i -D adriancmiranda/load-gulp-config
````

## Usage

```javascript
// Load multiple gulp tasks using globbing patterns.
// @see https://github.com/adriancmiranda/load-gulp-config
var config = require('load-gulp-config');

// Specifics of npm's package.json handling.
// @see https://docs.npmjs.com/files/package.json
var pack = config.util.readJSON('package.json');

config(gulp, {
  // path to task's files, defaults to gulp dir
  configPath: config.util.path.join('tasks', '*.{js,json,coffee,cson,yml,yaml}'),
  
  // data passed into config task.
  data:Object.assign({ someCfg:{}, anyValue:1, anyParams:[] }, pack)
});
```

### Task file examples

Creating tasks internally:

```javascript
module.exports = function(gulp, data, util, taskName){
	'use strict';

	gulp.task(taskName, ['anotherTask:method'], function(callback){
		// return gulp.src(...);
	});
	
	gulp.task(taskName +':method', function(callback){
		// return gulp.src(...);
	});
};
```

Returning a function:

```javascript
module.exports = function(gulp, data){
	'use strict';
	
	console.log([
		'\t- someCfg:'+ data.someCfg,
		'\t- anyValue:'+ data.anyValue,
		'\t- anyParams:'+ data.anyParams,
		'\t- package.version:'+ data.version
	].join('\n'));
	
	return function(methodName, callback){
		// return gulp.src(...);
	};
};
```


Returning a object:

```javascript
module.exports = function(gulp, data, util, taskName){
	'use strict';
  
	return {
		cmd1:function(methodName, callback){
			// return gulp.src(...);
		},
		cmd2:function(methodName, callback){
			// ...
		}
	};
};
```

### Aliases files (optional)

If your gulp/ folder contains an `.json`, `.cson`, `.yml` or `.yaml` file `load-gulp-config` will use that to define your tasks aliases (like `gulp.task('default', ['task1', 'task2']);`).

The following examples show the same aliases definition written in various formats

#### Examples

YAML file:

```yaml
--- 
default: 
  - 'build'
  - 'task2'

build: 
  - 'task1:method'
  - 'task2'
  - 'task3'
```


JSON file:

```json
{
  "default": ["build", "task2"],
  "build": ["task1:method", "task2", "task3"]
}
```

Thank's to the [`load-grunt-config`](https://www.npmjs.com/package/load-grunt-config) module idea, that make this one possible.
