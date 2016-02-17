# Gulp-Flowcheck
A [gulp](https://gulpjs.com) plugin for [Flow](http://flowtype.org).
[![Build Status](https://travis-ci.org/rwhogg/gulp-flowcheck.svg?branch=master)](https://travis-ci.org/rwhogg/gulp-flowcheck)
[![Code Climate](https://codeclimate.com/github/rwhogg/gulp-flowcheck/badges/gpa.svg)](https://codeclimate.com/github/rwhogg/gulp-flowcheck)

## Installation
```bash
$ npm install --save-dev gulp-flowcheck;
```

## Usage
```js
var GulpFlow = require("gulp-flowcheck");
var gulpFlow = new GulpFlow();

gulp.task("flow", function()
{
    gulp.src("*.js")
        .pipe(gulpFlow.check())
        .pipe(gulpFlow.reporter());
});
```

