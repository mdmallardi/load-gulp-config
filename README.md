# load-gulp-config
> Allows you to break up your Gulpfile config by task

## Installation

```terminal
npm install --save-dev adriancmiranda/load-gulp-config
````

## Usage

```node
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


#### Example js file creating a task - tasks/watch.js

```javascript
module.exports = function(gulp, data, util, filename){
	'use strict';

	// Live CSS Reload & Browser Syncing.
	// @see https://www.npmjs.com/package/browser-sync
	var browserSync = require('browser-sync').create();

	gulp.task(filename, ['styles:main'], function(callback){
		browserSync.init({ server:'./' });
		gulp.watch(util.path.join(data.appDirs.styles, '**/*.scss'), ['styles:main']);
		gulp.watch(util.path.join(data.appDirs.scripts, '**/*.js')).on('change', browserSync.reload);
		gulp.watch(util.path.join(data.appDirs.images, '**/*.{jpg,png,gif,svg}')).on('change', browserSync.reload);
		gulp.watch(util.path.join(data.appDirs.views, '**/*.html')).on('change', browserSync.reload);
	});
};
```

#### Example js file returning a function - tasks/vendors.js

```javascript
module.exports = function(){
	'use strict';
	
	// Preen unwanted files in packages installed via Bower.
	// @see https://www.npmjs.com/package/gulp-imagemin
	var preen = require('preen');

	return function(taskName, callback){
		return preen.preen({
			verbose:false,
			preview:false
		}, callback);
	};
};
```


#### Example js file returning a object - tasks/styles.js

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
