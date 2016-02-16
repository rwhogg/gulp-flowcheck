import test from "ava";

var es = require("event-stream");
var fs = require("fs");
var File = require("vinyl");
var GulpFlow = require("./GulpFlow.js");

test.serial("buffer mode", function(t)
{
    var contents = es.readArray(fs.readFileSync("test/buffer.js", "utf-8").split(/\w/));
    var fakeFile = new File({
        contents: contents
    });
    var gulpFlow = new GulpFlow();
    var checker = gulpFlow.check();
    checker.write(fakeFile);
    checker.once("data", function(file)
    {
        t["true"](file.isBuffer());
        t.is(file.contents, contents);
    });
});
