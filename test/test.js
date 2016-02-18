var _ = require("underscore");
var assert = require("assert");
var es = require("event-stream");
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

            // check that we failed
            assert.ok(!results.passed);

            // check that the results are correct
            var errors = results.errors;
            assert.equal(errors.length, 2);
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
            done();
        });
    });
});

describe("stream mode", function()
{
    it("should NOT work (for now, anyhow)", function(done)
    {
        console.log("FIXME");
        done();
    });
});

describe("null", function()
{
    it("should not do anything", function(done)
    {
        var gulpFlowCheck = new GulpFlow().check();
        var nullFile = new File();
        gulpFlowCheck.pipe(es.through(function(file)
        {
            assert.equal(file.contents, null);
        }, done));
        gulpFlowCheck.write(nullFile);
        gulpFlowCheck.end();
    });
});

// FIXME: move to a separate file test file for reporters
//describe("reporter stuff");
