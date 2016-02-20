/**
 * GulpFlow provides a [gulp](https://gulpjs.com) plugin for [Flow](http://flowtype.org).
 *
 * @module GulpFlow
 * @main GulpFlow
 */

var _ = require("underscore");
var Class = require("yajscf");
var through = require("through2");
var gutil = require("gulp-util");
var PluginError = gutil.PluginError;
var execFile = require("child_process").execFileSync;
var fs = require("fs");
var flow = require("flow-bin");
var fileUrl = require("file-url");
var Handlebars = require("hogan.js");

module.exports = Class.extend(
{
    /**
     * GulpFlow is a Gulp plugin for type-checking code with `flow`.
     *
     * @class GulpFlow
     * @constructor
     */
    init: function()
    {
        /**
         * Options to pass to the `flow` binary.
         *
         * @property options
         * @type string[]
         * @private
         */
        this.options = [
            "--json"
        ];

        /**
         * Name of this plugin.
         *
         * @property PLUGIN_NAME
         * @type string
         */
        this.PLUGIN_NAME = "gulp-flowcheck";
    },

    /**
     * Check for type errors and store them in `this.results`.
     * Only compatible with buffers at the moment.
     *
     * @method check
     * @return {Function} A gulp-compatible stream.
     */
    check: function()
    {
        var me = this;
        return through.obj(function(file, encoding, callback)
        {
            if(file.isNull())
            {
                callback();
                return;
            }

            if(file.isStream())
            {
                this.emit("error", new PluginError(me.PLUGIN_NAME, "streams are not supported (yet?)"));
            }

            var output;
            try
            {
                output = execFile(flow, _.union(["check-contents"], me.options), {
                    stdio: ["pipe", "pipe", "ignore"],
                    input: file.contents.toString(encoding)
                });
            }
            catch(e)
            {
                // flow normally exits with a non-zero status if errors are found
                output = e.stdout;
            }
            file.contents = output; // FIXME: you should parse, correct the paths, and then restringify!
            callback(null, file);
        });
    },

    /**
     * Dump the results of the type check to the command line.
     *
     * @method reporter
     * @return {Function} A gulp-compatible stream.
     */
    reporter: function()
    {
        return through.obj(function(file, encoding, callback)
        {
            if(file.isNull())
            {
                callback();
                return;
            }

            if(file.isStream())
            {
                this.emit("error", new PluginError(me.PLUGIN_NAME, "streams are not supported (yet?)"));
            }

            var contents = file.contents.toString(encoding);
            var errors = JSON.parse(contents).errors;
            gutil.log("\n" + file.path + ":");
            _.forEach(errors, gutil.log);
            callback(null, file);
        });
    },

    /**
     * Dump the results to the console in a custom Markdown format.
     *
     * @method markdownReporter
     * @return {Function} A gulp-compatible stream.
     */
    markdownReporter: function()
    {
        return through.obj(function(file, encoding, callback)
        {
            if(file.isNull())
            {
                callback();
                return;
            }

            if(file.isStream())
            {
                this.emit("error", new PluginError(me.PLUGIN_NAME, "streams are not supported (yet?)"));
            }

            var contents = file.contents.toString(encoding);
            var errors = JSON.parse(contents).errors;
            var messages = _.pluck(errors, "message");
            var url = fileUrl(file.path);
            var template = fs.readFileSync("mdReporter.hbs", "utf-8");
            var mdTemplate = Handlebars.compile(template);
            var md = mdTemplate.render({
                messages: messages,
                url: url,
                path: file.path
            });
            // FIXME: we should store these and log it as a flush instead.
            gutil.log("\n" + md);
            callback(null, file);
        });
    }
});
