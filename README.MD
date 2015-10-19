# Gulp Visualforce

Gulp Visualforce is a set of plugins that will help you develop modern javascript applications that run on top of Visualforce.

This plugins help operate the livecycle of the application. 

They enable development mode on localhost, something unheard of in the Salesforce Community that we take for granted on the open source world.

They open up the use of all of the gulp eco-system for application development, which means opening up the the door for Less, Sass, transformations. In short, your unique development automations.

They simplify, up to the point where it's finally posible to build apps, the deployment process. The developer does not have to do anything order to publish a Visualforce Page and their Static Resources. 

To learn a modern way how to query, CRUD data and Apex Rest into Salesforce. Checkout clay-model, Clay4Salesforce,clay-model-vfr and clay-model-salesforce-api

# Development Setup

Make sure tou add CORS to your Salesforce ORg

## Load you enviroment variables

Add this or any other code you'd prefer to load your Salesforce Credentials into process.env. This is required in order to upload development and production visualforce pages

```

var minimist = require("minimist")
var args = minimist( process.argv );

var env = "";
require('dotenv').config({path: './.env'}); 

```

## Modify browser-sync
We created a wrapper to autome browser-sync configuration. Take a look at the source code if you'd like to do it differently.

```
var VisualForce4BrowserSync = require("gulp-visualforce").BrowserSync;

browserSync( VisualForce4BrowserSync( { regularOptions... } );

```


## Add the Visualforce Development Task

```
var Visualforce = require("gulp-visualforce").Visualforce;
var handleErrors = require('../util/handleErrors');


gulp.task('vfpage', function() {
  return gulp.src('src/htdocs/index.html')
	.pipe( Visualforce({ name: process.env.NAME, host: "https://localhost:3000" }) )
  .pipe(gulp.dest("./build"))
  .on('error', handleErrors)
});
```

## Add the Visualforce Production Task

```

var Visualforce = require("gulp-visualforce").Visualforce;
var StaticResourcePack = require("gulp-visualforce").StaticResourcePack;


gulp.task( 'staticresource', function () {
  return gulp.src( "dist/**" )
    .pipe( StaticResourcePacker({ namespace: "cbit__" , name: process.env.NAME  }) )
    .on('error', handleErrors)
});

gulp.task( 'dist', ['staticresource'], function () {
  gulp.src( "dist/**" )
  .pipe( VisualForce({ name: process.env.NAME, open: true }) )
  .on('error', handleErrors);

});
```

## Usage

Build you apps as you would on develpment. 

The index.html is actually a Visualforce Page, you can use all of Visualforce tags. Simply use the {PATH} placeholder before your assets paths, they will be transformed accordingly.

This will only work in index.html, internally you can just use relative paths. However this may not work in some circumstances like loading SVG's or loading from Javascript. In that case we provide a global path variable that points to localhost or to the Static Resource URL

`window._sf.staticResource` contains the actual path so you can use it on Javascript


## Proposed Workflow

The idea is to be able to work on localhost, and then be able to develop in "staging" still pulling from localhost but running on visualforce. Finally by able to deploy as Visualforce + Static Resource. Everything done without having to modify the code base.

This is how the Salesforce Clearbit Integration was developed, it currently uses this plugin.



