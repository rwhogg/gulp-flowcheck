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
            // check that the file itself did not change
            assert(file.isBuffer());
            assert.equal(file.contents.toString("utf-8"), stringContents);

            // check that the results are correct
            _.forEach(gulpFlow.results, function(resultJSON, index)
            {
                // check that the path is correct
                assert.equal(index, fakeFilePath);

                // check that we failed
                var result = JSON.parse(resultJSON);
                assert.ok(!result.passed);

                // check that we got the errors we expected
                var errors = result.errors;
                assert.equal(errors.length, 2);
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
                done();
            });
        });
    });
});
