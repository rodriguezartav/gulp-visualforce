'use strict';

var chalk = require('chalk');
var JSZip = require('jszip');

var fs          = require('fs');
var path        = require('path');
var through     = require('through2');
var gutil       = require('gulp-util');
var PluginError = gutil.PluginError;
var Q       = require("q");

var login = require("./login");

var jsforce = require("jsforce")


function StaticResource( opts) {
  var _this;

  opts = opts || {};
  opts.compress = true;

  var firstFile;
  var zip = new JSZip();

  return through.obj(function (file, enc, cb) {
    _this =this;

    if (file.isNull()) {
      cb();
      return;
    }

    if (file.isStream()) {
      cb(new gutil.PluginError('gulp-visualforce', 'Streaming not supported'));
      return;
    }

    if (!firstFile) {
      firstFile = file;
    }

    // because Windows...
    var pathname = file.relative.replace(/\\/g, '/');

    zip.file(pathname, file.contents, {
      date: file.stat ? file.stat.mtime : new Date(),
      createFolders: true
    });

    cb();
  }, function (cb) {
    if (!firstFile) {
      cb();
      return;
    }


    var zipFile = new gutil.File({
      cwd: firstFile.cwd,
      base: firstFile.base,
      contents: zip.generate({
        type: 'nodebuffer',
        compression: opts.compress ? 'DEFLATE' : 'STORE',
        comment: opts.comment
      })
    });

    //this.push( zipFile );
    upload.call(_this, zipFile, opts, cb)
    
  });
};

function upload(  file , opts, cb ){
  var _this = this;
  var zip64 = file.contents.toString('base64');
  var name  = opts.name

  if( !opts.namespace ) opts.namespace = ""

  var fullNames = [{
    fullName:     opts.namespace + opts.name,
    content:      zip64,
    contentType: "application/zip", 
    cacheControl: "Public"  ,
  }];

  login( process.env.SF_USERNAME,process.env.SF_PASSWORD + process.env.SF_TOKEN , process.env.SF_HOST )
  .then( function(){
    var conn  = new jsforce.Connection({
      accessToken: process.env.ACCESS_TOKEN,
      instanceUrl: process.env.INSTANCE_URL
    });
    
    gutil.log('Starting', gutil.colors.cyan( 'Static Resource Upload' ));
    conn.metadata.upsert( 'StaticResource', fullNames, function( err, results ) {
      if( err ) cb( err );
      console.log( JSON.stringify(results) );
      gutil.log("Finished", gutil.colors.cyan( 'Static Resource Upload' ));
      _this.emit("end")
      return cb();
    });
  }).fail( cb )
}


module.exports = StaticResource;