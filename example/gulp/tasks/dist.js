var gulp = require('gulp');
var notify = require("gulp-notify");


var handleErrors = require('../util/handleErrors');

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var jsonminify = require('gulp-jsonminify');
var revall = require('gulp-rev-all');
var clean = require('gulp-clean');
var p = require('../../package.json');


var Visualforce = require("gulp-visualforce").Visualforce;
var StaticResourcePack = require("gulp-visualforce").StaticResourcePack;



gulp.task('clean', ['build'], function() {
    return gulp.src('./dist', {read: false})
    .pipe(clean());
});

gulp.task('copy', ['clean'], function() {
    return gulp.src('./build/**')
//    .pipe(revall({
  //      ignore: [/^\/favicon.ico$/g, /^\/index.html/g, /^\/captions/g, /^\/images\/static/g, /^\/sounds/g, /^\/images\/social/g, /^\/images\/map\/dist/g]//,
        //prefix: global.previewUrl || p.previewUrl
//    }))
    .pipe(gulp.dest('dist'));
});

gulp.task( 'staticresource', ['setVarsProduction', 'copy'], function () {
  return gulp.src( "dist/**" )
    .pipe( StaticResourcePack({ namespace: "" , name: process.env.NAME  }) )
    .on('error', handleErrors)
});

gulp.task( 'dist', ['staticresource'], function () {
  return gulp.src('./src/htdocs/'+process.env.NAME+'.html')
  .pipe( Visualforce({ name: process.env.NAME, open:true }) )
  .pipe(gulp.dest("./dist"))
  .on('error', handleErrors);

});