var gulp = require("gulp");
var GulpFlow = require("./GulpFlow.js");
var gulpFlow = new GulpFlow(["--old-output-format"]);
var jscs = require("gulp-jscs");

gulp.task("lint", function()
{
    gulp.src("GulpFlow.js")
        .pipe(jscs())
        .pipe(jscs.reporter());
});

gulp.task("manual-test", function()
{
    return gulp.src("test/buffer.js")
        .pipe(gulpFlow.check())
        .pipe(gulpFlow.reporter());
});
