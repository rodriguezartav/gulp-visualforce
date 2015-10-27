var gulp = require('gulp');
var notify = require("gulp-notify");
var minimist = require("minimist")
var args = minimist( process.argv );
var handleErrors = require('../util/handleErrors');

var dest = './build';

gulp.task('markup', function() {

  return gulp.src(['src/htdocs/**','!src/htdocs/*.html'])	
   .pipe(gulp.dest(dest));
});
