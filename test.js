import test from "ava";

var _ = require("underscore");
var fs = require("fs");
var File = require("vinyl");
var GulpFlow = require("./GulpFlow.js");

test.serial("buffer mode", function(t)
{
    var stringContents = fs.readFileSync("test/buffer.js", "utf-8");
    var contents = new Buffer(stringContents);

    var fakeFilePath = "test/buffer.js";
    var fakeFile = new File({
        contents: contents,
        path: fakeFilePath
    });
    var gulpFlow = new GulpFlow();
    var checker = gulpFlow.check();
    checker.write(fakeFile);
    checker.once("data", function(file)
    {
        // check that the file itself did not change
        t["true"](file.isBuffer());
        t.is(file.contents.toString("utf-8"), stringContents);
        
        // check that the results are correct
        console.dir(gulpFlow.results);
        _.forEach(gulpFlow.results, function(resultJSON, index)
        {
            // check that the path is correct
            t.is(index, fakeFilePath);
            
            // check that we failed
            var result = JSON.parse(resultJSON);
            t["false"](result.passed);
        });
    });
});
