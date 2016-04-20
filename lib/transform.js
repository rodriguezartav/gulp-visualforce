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

  return through.obj(function(file, enc, callback){

    // Pass file through if:
    // - file has no contents
    // - file is a directory
    if (file.isNull() || file.isDirectory()) {
        this.push(file);
        return callback();
    }
    
    // User's should be using a compatible glob with plugin.
    // Example: gulp.src('images/**/*.{jpg,png}').pipe(watermark())
    if (['.html'].indexOf(path.extname(file.path)) === -1) {
      return callback();
    }

    // No support for streams
    if (file.isStream()) {
      throw new PluginError({
        plugin: 'gulp-visualforce',
        message: 'Streams are not supported.'
      });
      return callback();
    }

    if (file.isBuffer()) {

        var _this = this;

        if( opts.offline ){
          transform.call(_this, file, opts);
          return callback(null, file);
        }
        
        login( process.env.SF_USERNAME,process.env.SF_PASSWORD + process.env.SF_TOKEN, process.env.SF_HOST )
        .then( function(){ return transform.call(_this, file, opts); })
        .then( function(){
          
          if(!opts.local) upload( file, opts, callback)
          else{
            
            
            return callback(null, file);
          }

        }).fail( callback ).done()
      
        
    }
   
  });
}

function transform(file, opts){

  var clayprod = '<script>';
  clayprod += '\nif(!window._sf) window._sf = {};';
  clayprod += '\nwindow._sf.staticResource= "{!URLFOR($Resource.'+ opts.name +')}";';
  clayprod += '\n window._sf.staticResource = window._sf.staticResource.split("?")[0];';
  clayprod +='</script>\n</head>';

  var claylocal = '<script>';
  claylocal += '\nif(!window._sf) window._sf = {};';
  claylocal += '\nwindow._sf.staticResource= "'+ opts.host +'";';
  claylocal += '\n window._sf.staticResource = window._sf.staticResource.split("?")[0]';
  claylocal +='</script>\n</head>\n';


  //claylocal += "<script>\n"
  //laylocal += "var script = document.createElement('script');\n" 
  //claylocal += "script.src = '" + opts.host + "/browser-sync/browser-sync-client.2.0.0-rc6.js';\n "
  //claylocal += "document.head.appendChild(script)\n";
  //claylocal += "</script>";

  var contents = file.contents.toString();
  if( opts.local ){

    contents = contents.replace( "{!JSENCODE($Api.Session_ID)}", process.env.ACCESS_TOKEN ) 
    contents = contents.replace( "{!JSENCODE($Api.Partner_Server_URL_340)}", process.env.INSTANCE_URL ) 
    contents = contents.replace( "{!JSENCODE(Host)}", process.env.INSTANCE_URL ) 
    contents = contents.replace( "{!JSENCODE($User.UIThemeDisplayed)}", process.env.UI_THEME ) 

    if(process.env.REPLACE_TAGS){
      var replaceTags = process.env.REPLACE_TAGS.split(",");
      replaceTags.forEach( function(tag){
        contents = contents.replace( "{!JSENCODE("+tag+")}", process.env[tag] ) 
      })
  } 
      

    file.contents = new Buffer(stripLines(contents, ["apex:page"]));
    contents = file.contents.toString()
  }
  else{
    contents = contents.replace( "{!JSENCODE(Host)}", "" ) 
  }
  
  var cheerio = require('cheerio'),
  $ = cheerio.load( contents,  { xmlMode: true });

  if( opts.host ) $("head").append( claylocal );
  else $("head").append( clayprod );

  

    $("link").each(function(i, elem) {

      var el = $(this)

      var url = el.attr("href");
      
      if( opts.host ){
        url = url.replace("{PATH}", opts.host);
        el.attr("href", url);
      }
      else{
        url = url.replace("{PATH}/", "");
        var transformed = "{!URLFOR($Resource." + opts.name + ", '" +url +"')}"
        el.attr("href", transformed);
      }

    });

    $("img").each(function(i, elem) {

      var el = $(this)

      var url = el.attr("src");
      
      if( opts.host ){
        url = url.replace("{PATH}", opts.host);
        el.attr("src", url);
      }
      else{
        url = url.replace("{PATH}/", "");
        var transformed = "{!URLFOR($Resource." + opts.name + ", '" +url +"')}"
        el.attr("src", transformed);
      }

    });

    $("script").each(function(i, elem) {
      var el = $(this)
      var url = el.attr("src");
      
      if(url){
        if( opts.host ){
          url = url.replace("{PATH}", opts.host);
          el.attr("src", url);
        }
        else{
          url = url.replace("{PATH}/", "");
          if(url && url.indexOf("http") !=0  ){
            var transformed = "{!URLFOR($Resource." + opts.name + ", '" +url +"')}"
            el.attr("src", transformed);
          }
          el.html(";");
        }
      }
      else if( opts.local ){
        var html = el.html();
        var regExp = /\(([^)]+)\)/;
        var lines = html.split("\n");
        lines = lines.map( function(line){
            
          if(line.indexOf( "JSENCODE" ) > -1){
            
          var matches = regExp.exec(line);
          var match = matches[1];
          if(match){
            var value = process.env[ "HTML_" + match.toUpperCase() ];
            if(value){
              return line.split("=")[0] + '= "' + value + '"';
            }
          }
        }
        return line;
      })
      $(this).html( lines.join("\n") );  
    }

  });
  this.push(file);
  var page = $.html();

  page = page.replace(/&apos;/g,'"');
  page = page.replace('.js"/>','.js"></script>');
  page = page.replace('index.css"/>','index.css"></link>');

  file.contents = new Buffer( page );


}


function upload(  file , opts, cb ){
  console.log(ops);
  var name = opts.alias || opts.name;
  var url  = process.env.INSTANCE_URL + "/services/data/v30.0/sobjects/ApexPage/Name/" + name; 

  gutil.log( 'Starting', gutil.colors.cyan('Visualforce Page Upload'));

  body = {
    Markup : file.contents.toString(),
    ControllerType : 3,
    MasterLabel: opts.label || name,
    ApiVersion: "30.0"
  }

  var req = request.patch( url )
  .type( "application/json" )
  .set( 'Authorization', 'Bearer ' + process.env.ACCESS_TOKEN )
  .send( body )
  .end( function( err, res ){
    
    if( err ) return cb( new Error("Salesforce.com rejected the upsert of a Visualforce Page with the HTML we send, it's posibly due to unvalid HTML. Please review your template files. ERROR: " + err.response.body[0].message) );
    if( res.body[0] && res.body[0].errorCode ) return cb( new Error("Salesforce.com rejected the upsert of a Visualforce Page with the HTML we send, it's posibly due to unvalid HTML. Please review your template files. ERROR: " + res.body[0].message ) );
    if( res.body.success == false || res.body.errorCode ) cb( new Error( "ERROR: " + JSON.stringify( res.body ) ) );
    
    console.log( JSON.stringify(res) );

    gutil.log( 'Finished', gutil.colors.cyan('Visualforce Page Upload'));
    if(opts.open) open( process.env.INSTANCE_URL + "/apex/" + name  )
    cb();
  })
};

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