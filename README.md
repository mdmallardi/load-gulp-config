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
var loadGulpConfig = require('load-gulp-config');

// Specifics of npm's package.json handling
// @see https://docs.npmjs.com/files/package.json
var pack = loadGulpConfig.readJSON('package.json');

loadGulpConfig(gulp, {
  configPath: loadGulpConfig.path.join(__dirname, 'tasks', '*.js'),
  data:Object.assign({ someCfg:{}, anyValue:1, anyParams:[] }, pack)
});
```
