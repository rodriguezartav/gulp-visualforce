var fs           =  require('fs');
var path         =  require('path');
var through      =  require('through2');
var request      =  require("superagent");
var cheerio      =  require("cheerio");
var gutil        =  require('gulp-util');
var util = require("util");
var PluginError  =  gutil.PluginError;
var Q            =  require("q");
var jsforce      = require("jsforce");
var open = require('open');

var login = require("./login");


function gulpVisualforceHtml(opts){

  function plugin(file, enc, callback){

    // Pass file through if:
    // - file has no contents
    // - file is a directory
    if (file.isNull() || file.isDirectory()) {
        this.push(file);
        return callback();
    }
    
    // User's should be using a compatible glob with plugin.
    // Example: gulp.src('images/**/*.{jpg,png}').pipe(watermark())
    if (['.js'].indexOf(path.extname(file.path)) === -1) {
      return callback();
    }

    var _this = this;

    transform.call(_this, file, opts);
        
    callback(null, file);
    

  }

  var stream =  through.obj( plugin );
  stream.resume();
  return stream;
}

function transform(file, opts){

  if( opts.local ){
    file.contents = new Buffer(stripLines(file.contents, ["//remote"]));
  }
  else{
    file.contents = new Buffer(stripLines(file.contents, ["//local"]));
  }

}

function stripLines(content, matchers) {
    if (!content) { return ''; }

    var output = content.toString();
    matchers.forEach(function (match) {
        var current = match.toString();
        if (util.isRegExp(match)) {
            current = current.toString().replace(/^\/|\/$/g, '');
        }

        if (current.indexOf('^') === -1) { current = '^.*' + current; }
        if (current.indexOf('$') === -1) { current += '.*$'; }
        current = new RegExp(current.toString(), 'gm');

        output = output.replace(current, '');
    });

    return output;
}


module.exports = gulpVisualforceHtml;