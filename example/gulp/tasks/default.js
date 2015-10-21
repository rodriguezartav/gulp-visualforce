var gulp = require('gulp');
var gutil       = require('gulp-util');
var PluginError = gutil.PluginError;
var runSequence = require('run-sequence');


gulp.task('default', function(callback){
	runSequence('setVarsLocal', 'watch', callback);
});
