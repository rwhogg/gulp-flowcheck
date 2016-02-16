var _ = require("underscore");
var Class = require("yajscf");
var through = require("through2");
var gutil = require("gulp-util");
var PluginError = gutil.PluginError;
var execFile = require("child_process").execFileSync;
var flow = require("flow-bin");

const PLUGIN_NAME = "gulp-flow";

module.exports = Class.extend(
{
    init: function()
    {
        this.options = [
            "--old-output-format",
            "--one-line"
        ];
    },

    check: function()
    {
        var me = this;
        this.results = [];
        return through.obj(function(file, encoding, callback)
        {
            if(file.isNull())
            {
                callback();
                return;
            }
            else if(file.isStream())
            {
                this.emit("error", new PluginError(PLUGIN_NAME, "streams are not supported (yet?)"));
            }
            try
            {
                var output = execFileSync(flow, _.union(me.options, ["check-contents"]), {
                    input: file.contents
                });
            }
            catch(e)
            {
                this.emit("error", new PluginError(PLUGIN_NAME, e.toString()));
            }
            me.results[file.path] = output;

            this.push(file);
            callback();
        });
    },
    
    reporter: function()
    {
        var me = this;
        return through.obj(function(file, encoding, callback)
        {
            _.forEach(me.results, gutil.log);
        });
    }
});
