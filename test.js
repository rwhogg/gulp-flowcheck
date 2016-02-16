import test from "ava";

var fs = require("fs");
var File = require("vinyl");
var GulpFlow = require("./GulpFlow.js");

test.serial("buffer mode", function(t)
{
    var contents = new Buffer(fs.readFileSync("test/buffer.js", "utf-8").split(/\w/));
    console.log(contents);
    var fakeFile = new File({
        contents: contents
    });
    var gulpFlow = new GulpFlow();
    var checker = gulpFlow.check();
    //console.log(checker.write);
    checker.write(fakeFile);
    /*checker.once("data", function(file)
    {
        t["true"](file.isBuffer());
        t.is(file.contents, contents);
        done();
    });*/
});
