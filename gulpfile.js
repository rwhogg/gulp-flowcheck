var gulp = require("gulp");
var GulpFlow = require("./GulpFlow.js");
var gulpFlow = new GulpFlow();
var jscs = require("gulp-jscs");

gulp.task("lint", function()
{
    gulp.src(["*.js", "test/test.js"])
        .pipe(jscs())
        .pipe(jscs.reporter());
});

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
