var gulp = require("gulp");
var ava = require("gulp-ava");
var GulpFlow = require("./GulpFlow.js");
var gulpFlow = new GulpFlow();
var jscs = require("gulp-jscs");

gulp.task("lint", function()
{
    gulp.src("GulpFlow.js")
        .pipe(jscs())
        .pipe(jscs.reporter());
});

gulp.task("test", function()
{
    return gulp.src("test.js")
        .pipe(ava());
});

gulp.task("manual-test", function()
{
    return gulp.src("test/buffer.js")
        .pipe(gulpFlow.check())
        .pipe(gulpFlow.reporter());
});
