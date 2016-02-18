var _ = require("underscore");
var assert = require("assert");
var fs = require("fs");
var File = require("vinyl");
var GulpFlow = require("../GulpFlow.js");

describe("buffer mode", function()
{
    it("should work", function(done)
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
            assert(file.isBuffer());
            var contents = file.contents.toString("utf-8");
            var results = JSON.parse(contents);
            console.dir(results);
            
            // check that we failed
            assert.ok(!results.passed);
                
            // check that the results are correct
            var errors = results.errors;
            assert.equal(errors.length, 2);
            _.forEach(errors, function(result, index)
            {
                // check that we got the errors we expected
                var expected = [
                    "object literal This type is incompatible with string",
                    "number This type is incompatible with string"
                ];
                var i = -1;
                _.forEach(errors, function(error)
                {
                    i++;
                    var text = _.pluck(error.message, "descr").join(" ");
                    assert.equal(text, expected[i]);
                });
                console.log("we did get this far, right?");
            });
            done();
        });
    });
});
