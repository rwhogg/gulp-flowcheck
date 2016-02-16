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
        this.options =
        [
            "--old-output-format",
            "--one-line"
        ];
    },

    doc: function()
    {
        var me = this;
        return through.obj(function(file, encoding, callback)
        {
            if(file.isStream())
            {
                throw new PluginError("streams are not supported (yet?)");
            }
            try
            {
                var output = execFileSync(flow, me.options, {
                    input: file.contents
                });
            }
            catch(e)
            {
                throw new PluginError(e.toString());
            }
            gutil.log(output);

            this.push(file);
            callback();
        });
    }
});
