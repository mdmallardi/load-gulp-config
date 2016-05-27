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
