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
var flow = require("flow-bin");

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
        this.PLUGIN_NAME = "gulp-flow";
    },

    /**
     * Check for type errors and store them in `this.results`.
     * Only compatible with buffers at the moment.
     *
     * @method check
     * @return {Object} A gulp-compatible stream.
     */
    check: function()
    {
        var me = this;
        this.results = {};
        return through.obj(function(file, encoding, callback)
        {
            if(file.isNull())
            {
                callback();
                return;
            }
            else if(file.isStream())
            {
                this.emit("error", new PluginError(me.PLUGIN_NAME, "streams are not supported (yet?)"));
            }
            try
            {
                var output = execFile(flow, _.union(["check-contents"], me.options), {
                    input: file.contents.toString("utf-8")
                }).toString("utf-8");
            }
            catch(e)
            {
                // flow normally exits with a non-zero status if errors are found
                output = e.stdout.toString("utf-8");
            }
            
            /**
             * Results of the type check.
             *
             * @property results
             * @type String
             * @private
             */
            me.results[file.path] = output;

            this.push(file);
            callback();
        });
    },

    /**
     * Dump the results of the type check to the command line.
     *
     * @method reporter
     * @return {Object} A gulp-compatible stream.
     */
    reporter: function()
    {
        var me = this;
        return through.obj(function(file, encoding, callback)
        {
            _.forEach(me.results, gutil.log);
            // FIXME: I forgot to pass the files along!
        });
    }
});
