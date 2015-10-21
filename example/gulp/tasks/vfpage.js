var gulp = require('gulp');
var notify = require("gulp-notify");

var Visualforce = require("gulp-visualforce").Visualforce;
var handleErrors = require('../util/handleErrors');

var minimist = require("minimist");
var args = minimist(process.argv);


gulp.task('vfpage', ['markup'], function() {
  return gulp.src('./src/htdocs/'+process.env.NAME+'.html')
	.pipe( Visualforce({ name: process.env.NAME, host: "https://localhost:3000", local: args.local, open: false }) )
  .pipe(gulp.dest("./build"))
  .on('error', handleErrors)
});


