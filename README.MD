# Gulp Visualforce

Gulp Visualforce is a set of plugins that will help you develop modern javascript applications that run on top of Visualforce.

The goal and motivation of this plugin is to "make development right", the way it should be - so that it's posible to build apps with a resonable amount of time/effort.


This plugin help operate the livecycle of the application - the related modules help exchange data in a managable way.

# Overview

The plugins enable development mode on localhost, something unheard of in the Salesforce Community that we take for granted on the open source world.

They open up the use of all of the gulp eco-system for application development, which means opening up the the door for Less, Sass, transformations. In short, your unique development automations.

They simplify, up to the point where it's finally posible to build apps. The developer does not have to do anything in order to publish a Visualforce Page and their Static Resources.

# Workflow

You can work in 3 modes

## Local
You'll be able to run from localhost, use hot-reload and all that. 

`#gulp --local --env d`

Advanced use cases may use the `--env d` and load your enviroment vars from `.envd` , any entry with an `HTML_` suffix will be replaced on the visualforce page. This can be used to mock apex parameters from a Controller while on localhost. For more info on this please add an issue.

## Semi-Local
All your files will be loaded from localhost, but the visualforce page will be uploaded and will run from within salesforce. This is very usefull for "staging?".

Note that because of iframe and security some SVG assets and/or images may not be display.

`#gulp` 

## Deploy
Deploy all files as a Static Resource and the Visualforce Page is upload.

`gulp dist`

## Note
* All path transformations between local, semi-local and deploy are handled automatically.
* When templates, Angular or React is used (paths in javascript ) you need to adjust the url. For this we include the `window._sf.staticResource` which is a variable with the Static Resource URL. This is injected in deploy, points to localhost otherwise.

# Lightning Design System
This examples include the Lightning Design System ready to use.

# Running the Example

`git clone https://github.com/rodriguezartav/gulp-visualforce`

`npm install .`

`gulp --local` - work in localhost

`gulp` - work in localhost within Salesforce

`gulp dist` - deploy as static resource


# Data ( Extra Points )

One thing is to be able to to push html,css and images; but another is to be able to also work with saleforce data. For this take a look at the example folder and use (clay-model)[https://github.com/3vot/clay-model] (clay-model-vfr)[https://github.com/3vot/clay-model-vfr] and (clay-model-salesforce-api)[https://github.com/3vot/clay-model-salesforce-api]

You'll communicate with Salesforce via the API when in Localhost and via Visualforce Remoting when you are inside Visualforce ( semi-local or deploy mode ). For this to work you must use the Clay Model Suite. Which are an interchangable API Wrappers between a standalone app and a visualforce app.

There is only one caveat I have not been able to solve yet. You must change `require("clay-model-vfr")` for `require("clay-model-salesforce-api")` between local and semilocal or deploy. This is something I'll solve any day.

Another feature is that you can develop apps that are interchagable between Visualforce and Standalone. Lighning calls this lightning out.

## Notes
* Make sure you add CORS to your Salesforce Org
* Follow the gulp setup on the example folder

# Development Org ( .env credentials )

In order to help you get started, I have provided an Dev Org with the classes already provisioned. I also took the bold move to include the .env files with the credentials to this ORG. I don't really see anything wrong with this. Feel free to propose a better way.

In order to use the plugin with Data for development from another org, you need to add the files under the `/salesforce` folder to your production org and use the Clay Model Suite.

If you want to develop on you own org, simple deploy them to your Org.

# Using in a project

Use the plugins as I use them on gulp but using you own gulp tasks.

# Clay4Salesforce

The tecnology to transfer data between Salesforce and Javascript is a suit called Clay made up of several components including models, salesforce classes and this plugin.



