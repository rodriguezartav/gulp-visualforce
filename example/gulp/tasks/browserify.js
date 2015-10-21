/* browserify task
   ---------------
   Bundle javascripty things with browserify!

   If the watch task is running, this uses watchify instead
   of browserify for faster bundling using caching.
*/

var browserify   = require('browserify');
var watchify     = require('watchify');
var bundleLogger = require('../util/bundleLogger');
var gulp         = require('gulp');
var handleErrors = require('../util/handleErrors');
var source       = require('vinyl-source-stream');
var fs           = require("fs");

gulp.task('browserify', function() {

  var bundler = browserify({
    // Required watchify args
    cache: {}, packageCache: {}, fullPaths: true,

    // Specify the entry point of your app
    entries: ['./src/javascript/app.js'],

    // Add file extentions to make optional in your requires
    extensions: ['.jsx'],

    // Enable source maps!
    debug: false
  })

    

  var bundle = function() {
    // Log when bundling starts
    bundleLogger.start();

    var bundlerResult= bundler
      .bundle()
      // Report compile errors
      .on('error', handleErrors)
      // Use vinyl-source-stream to make the
      // stream gulp compatible. Specifiy the
      // desired output filename here.
      .pipe(source('app.js'))
      // Specify the output destination
      .pipe(gulp.dest('./build/'))
      // Log when bundling completes!
      .on('end', bundleLogger.end);

      return bundlerResult;
  };

  if( process.env.isWatching  ) {
    bundler = watchify(bundler);
    // Rebundle with watchify on changes.
    bundler.on('update', bundle );
  }

  return bundle();
});
