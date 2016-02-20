var gulp = require("gulp");
var GulpFlow = require("./GulpFlow.js");
var gulpFlow = new GulpFlow();
var jscs = require("gulp-jscs");
var jshint = require("gulp-jshint");

var filesToLint = ["*.js", "test/test.js"];

gulp.task("jscs", function()
{
    gulp.src(filesToLint)
        .pipe(jscs())
        .pipe(jscs.reporter())
        .pipe(jscs.reporter("fail"));
});

gulp.task("jshint", function()
{
    gulp.src(filesToLint)
        .pipe(jshint())
        .pipe(jshint.reporter())
        .pipe(jshint.reporter("fail"));
});

gulp.task("lint", ["jscs", "jshint"]);

gulp.task("manual-test", function()
{
    console.log("Markdown format");
    return gulp.src("test/buffer.js")
        .pipe(gulpFlow.check())
        .pipe(gulpFlow.markdownReporter());
});

gulp.task("manual-json-test", function()
{
    console.log("Default format");
    gulp.src("test/buffer.js")
        .pipe(gulpFlow.check())
        .pipe(gulpFlow.reporter());
});
