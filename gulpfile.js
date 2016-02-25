var gulp = require("gulp");
var GulpFlow = require("./GulpFlow.js");
var gulpFlow = new GulpFlow();
var jscs = require("gulp-jscs");
var jshint = require("gulp-jshint");

var filesToLint = ["*.js", "test/test.js"];

gulp.task("jscs", function() {
    gulp.src(filesToLint)
        .pipe(jscs())
        .pipe(jscs.reporter())
        .pipe(jscs.reporter("fail"));
});

gulp.task("jshint", function() {
    gulp.src(filesToLint)
        .pipe(jshint())
        .pipe(jshint.reporter())
        .pipe(jshint.reporter("fail"));
});

gulp.task("lint", ["jscs", "jshint"]);

gulp.task("manual-test", function() {
    return gulp.src("test/[fg].js")
        .pipe(gulpFlow.check())
        .pipe(gulpFlow.markdownReporter());
});

gulp.task("manual-json-test", function() {
    gulp.src("test/[fg].js")
        .pipe(gulpFlow.check())
        .pipe(gulpFlow.reporter());
});

gulp.task("manual-fail-test", function() {
    return gulp.src("test/[fg].js")
        .pipe(gulpFlow.check())
        .pipe(gulpFlow.failReporter());
});
