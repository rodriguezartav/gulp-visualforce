var gulp = require('gulp');
var browserSync = require('browser-sync');
var fs = require("fs");
var autoprefixer = require('gulp-autoprefixer');
var handleErrors = require('../util/handleErrors');
var concat = require('gulp-concat');
var source = require('vinyl-source-stream');
var rename = require('gulp-rename');

var importCss = require('gulp-import-css');

var sass = require('gulp-sass');

gulp.task('css', ['images'], function () {
  return gulp.src( 'src/css/index.scss')
    //.pipe(concat('app.css'))
    //.on('error', handleErrors)
    //.pipe(importCss())
    //.pipe(autoprefixer({browsers: ['last 2 version']}))
     .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build/'))
    .pipe(browserSync.reload({stream: true}));
});
