var _ = require("underscore");
var assert = require("assert");
var es = require("event-stream");
var fs = require("fs");
var File = require("vinyl");
var GulpFlow = require("../GulpFlow.js");
var PluginError = require("gulp-util").PluginError;
var sinon = require("sinon");

function testFunction(done, classToCreate) {
    var stringContents = fs.readFileSync("test/f.js", "utf-8");
    var contents = new classToCreate(stringContents);

    var fakeFilePath = "test/f.js";
    var fakeFile = new File({
        contents: contents,
        path: fakeFilePath
    });
    var gulpFlow = new GulpFlow();
    var checker = gulpFlow.check();
    checker.write(fakeFile);
    checker.once("data", function(file) {
        assert(file.isBuffer());
        var contents = file.contents.toString("utf-8");
        var results = JSON.parse(contents);

        // check that we failed
        assert.ok(!results.passed);

        // check that the results are correct
        var errors = results.errors;
        assert.equal(errors.length, 1);
        // check that we got the errors we expected
        var expected = [
            "object literal This type is incompatible with number"
        ];
        var i = -1;
        _.forEach(errors, function(error) {
            i++;
            var text = _.pluck(error.message, "descr").join(" ");
            assert.equal(text, expected[i]);
        });
        done();
    });
}

describe("buffer mode", function() {
    it("should work", function(done) {
        testFunction(done, Buffer);
    });

    it("should fail if .flowconfig is not found", function() {
        var stringContents = fs.readFileSync("test/f.js", "utf-8");
        var contents = new Buffer(stringContents);

        var fakeFilePath = "test/f.js";
        var fakeFile = new File({
            contents: contents,
            path: fakeFilePath
        });
        // simulate the file not being found
        var stub = sinon.stub(fs, "accessSync", function() { throw new Error(); });
        var gulpFlow = new GulpFlow();
        var checker = gulpFlow.check();
        try {
            checker.write(fakeFile);
        }
        catch(e) {
            assert.equal(e.message, "no .flowconfig file was found");
        }
        stub.restore();
    });
});

describe("stream mode", function() {
    it("should NOT work (for now, anyhow)", function(done) {
        console.log("FIXME");
        done();
    });
});

describe("null", function() {
    it("should not do anything", function(done) {
        var gulpFlowCheck = new GulpFlow().check();
        var nullFile = new File();
        gulpFlowCheck.pipe(es.through(function(file) {
            assert.equal(file.contents, null);
        }, done));
        gulpFlowCheck.write(nullFile);
        gulpFlowCheck.end();
    });
});

// FIXME: move to a separate test file for reporters
describe("reporters", function() {
    describe("fail reporter", function() {
        var failReporter;
        beforeEach(function() {
            failReporter = new GulpFlow().failReporter();
        });

        it("should accept empty results", function(done) {
            var nullFile = new File();
            failReporter
                .pipe(es.through(function(file) {
                    assert.equal(file.contents, null);
                }, done))
                .on("error", function(error) {
                    throw error;
                });
            failReporter.write(nullFile);
            failReporter.end();
        });

        describe("json results", function() {
            function check(contents, result, done) {
                var fakeFile = new File({
                    contents: new Buffer(contents)
                });
                failReporter
                    .on("error", function(error) {
                        assert(!result);
                        assert(error instanceof PluginError);
                        done();
                    })
                    .pipe(es.through(function(file) {
                        assert(result);
                    }, done));
                failReporter.write(fakeFile);
                failReporter.end();
            }

            it("should throw if we don't pass", function(done) {
                check("{\"passed\": false}", false, done);
            });

            it("should not throw if we pass", function(done) {
                check("{\"passed\": true}", true, done);
            });
        });
    });
});
