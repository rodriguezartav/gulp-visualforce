var Path    = require("path")
var fs      = require("fs");
var Q       = require("q");
var jsforce = require("jsforce");
var gutil       = require('gulp-util');
var PluginError = gutil.PluginError;

function Login( username, password, host ){

   var deferred = Q.defer();

  if ( process.env.INSTANCE_URL ) process.nextTick( function(){ deferred.resolve() } );
  else
  

  gutil.log( gutil.colors.cyan( 'Login to Salesforce' ));

    var username = username;
    var password = password;
    var host = host || "login.salesforce.com"

    var conn = new jsforce.Connection({
      loginUrl : 'https://' + host
    });

    if( process.env.ACCESS_TOKEN ){

      process.nextTick( function(){
        gutil.log( gutil.colors.cyan( 'Salesforce Login Bypassed'));
        deferred.resolve();
      })

    }
    else{ 
      conn.login( username, password, function( err, userinfo ){
        if(err){
          gutil.log( gutil.colors.cyan( 'Salesforce Login Error' + err.toString() ));

          return deferred.reject(err)
        }
        else{
          gutil.log( gutil.colors.cyan( 'Salesforce Login Complete'));

          process.env.INSTANCE_URL = conn.instanceUrl;
          process.env.ACCESS_TOKEN = conn.accessToken;
          deferred.resolve();
        }
      });
    }

  return deferred.promise; 

}

module.exports = Login;