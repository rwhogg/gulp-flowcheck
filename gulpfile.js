var gulp = require("gulp");
var ava = require("gulp-ava");
var jscs = require("gulp-jscs");
var yuidoc = require("gulp-yuidoc");

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

gulp.task("doc", function()
{
    return gulp.src("GulpFlow.js")
        .pipe(yuidoc.parser())
        .pipe(yuidoc.generator())
        .pipe(gulp.dest("docs"));
});
