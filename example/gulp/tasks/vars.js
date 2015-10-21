var gulp = require('gulp');

var minimist = require("minimist")
var args = minimist( process.argv );

var envSuffix = "";
if( args.env ){ 
	console.log("using env " + args.env)
	envSuffix = args.env
}

require('dotenv').config({path: './.env' + envSuffix});   


gulp.task('setVarsLocal', function() {
	process.env.isWatching = true;
  process.env.env = "local"
  process.env.host = "https://localhost:3000"
});

gulp.task('setVarsProduction', function() {
  process.env.isWatching = false;
});