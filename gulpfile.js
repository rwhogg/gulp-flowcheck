var gulp = require("gulp");
var jscs = require("gulp-jscs");

gulp.task("lint", function()
{
    gulp.src("GulpFlow.js")
        .pipe(jscs())
        .pipe(jscs.reporter());
});
