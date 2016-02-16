import test from "ava";

var fs = require("fs");
var File = require("vinyl");
var GulpFlow = require("./GulpFlow.js");

test.serial("buffer mode", function(t)
{
    var stringContents = fs.readFileSync("test/buffer.js", "utf-8");
    var contents = new Buffer(stringContents);

    var fakeFile = new File({
        contents: contents
    });
    var gulpFlow = new GulpFlow();
    var checker = gulpFlow.check();
    checker.write(fakeFile);
    checker.once("data", function(file)
    {
        t["true"](file.isBuffer());
        t.is(file.contents.toString("utf-8"), stringContents);
        console.log("done!");


    });
});
