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

### Automatically adding `@flow` headers
You can use [gulp-header](https://github.com/godaddy/gulp-header) to add the `@flow` headers to your source code
automatically:

```js
var header = require("gulp-header");

gulp.src("*.js")
	.pipe(header("/* @flow */"))
	.pipe(gulpFlow.check())
	...
```
