# Gulp-Flowtype
A [gulp](https://gulpjs.com) plugin for [Flow](http://flowtype.org).

## Installation
```bash
$ npm install --save-dev gulp-flowtype;
```

## Usage
```js
var GulpFlow = require("gulp-flowtype");
var gulpFlow = new GulpFlow();

gulp.task("flow", function()
{
    gulp.src("*.js")
        .pipe(gulpFlow.check())
        .pipe(gulpFlow.reporter());
});
```

