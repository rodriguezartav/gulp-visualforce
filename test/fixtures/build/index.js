(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var sectionsDiv = document.querySelector(".sections");


var sections = ({"sections":({"2_about":require("/Users/roberto/proyectos/3vot-core/3vot-builder/test/fixtures/clay_sf/src/sections/2_about.html"),"3_before":require("/Users/roberto/proyectos/3vot-core/3vot-builder/test/fixtures/clay_sf/src/sections/3_before.html"),"4_tutorial1":require("/Users/roberto/proyectos/3vot-core/3vot-builder/test/fixtures/clay_sf/src/sections/4_tutorial1.html")}),"snippets":({"p2-1":require("/Users/roberto/proyectos/3vot-core/3vot-builder/test/fixtures/clay_sf/src/snippets/p2-1.html")})});

for( sectionKey in sections.sections ){
	sectionsDiv.innerHTML += sections.sections[sectionKey];
}

var snippets = document.querySelectorAll("pre");
for (var i = snippets.length - 1; i >= 0; i--) {
	var snippet = snippets[i];
	
	snippet.classList.add("prettyify");
	snippet.classList.add("lang-js");
	snippet.classList.add("linenums");

	var html = sections.snippets[ snippet.dataset.id ];
	if(html){
		var p = document.createTextNode(html); 
  	snippet.appendChild(p);
  }
};
},{"/Users/roberto/proyectos/3vot-core/3vot-builder/test/fixtures/clay_sf/src/sections/2_about.html":2,"/Users/roberto/proyectos/3vot-core/3vot-builder/test/fixtures/clay_sf/src/sections/3_before.html":3,"/Users/roberto/proyectos/3vot-core/3vot-builder/test/fixtures/clay_sf/src/sections/4_tutorial1.html":4,"/Users/roberto/proyectos/3vot-core/3vot-builder/test/fixtures/clay_sf/src/snippets/p2-1.html":5}],2:[function(require,module,exports){
module.exports = '<section >\n' +
    '\n' +
    '	<div class="header" >\n' +
    '		Javascript workbook\n' +
    '	</div>\n' +
    '\n' +
    '\n' +
    '	<p>One of the most frequent questions Force.com developers ask is how to build Salesforce web & mobile apps\n' +
    '	with HTML and JavaScript and how to choose the appropiate frameworks and patterns.</p>\n' +
    '\n' +
    '	<p>The Javascript Workbook is intended to be the companion to the Force.com Developer jumping into JavaScript.\n' +
    '	The series of tutorials provided here</p>\n' +
    '\n' +
    '	<img height="300px"/>\n' +
    '\n' +
    '\n' +
    '	<h1>Intended Audience</h1>\n' +
    '	<p>This workbook is intended for developers that come from the Force.com or the Javascript Developers wanting to build\n' +
    '	Enterise Apps.</p>\n' +
    '\n' +
    '	<h2>Tell Me More....</h2>\n' +
    '	<p>This workbook is designed so that you can go through the steps as quickly as possible. At the end of some steps, there is an optional</p>\n' +
    '\n' +
    '	<ul> \n' +
    '		<li>You can find the latest version of clay: <a>http://npmjs.org/clay-cli</a></li>\n' +
    '		<li> To learn more about Force.com and to access a rich set of resources, visit Clay at: <a>http://npmjs.org/clay-cli</a></li>\n' +
    '	</ul>\n' +
    '\n' +
    '</section>';
},{}],3:[function(require,module,exports){
module.exports = '<section >\n' +
    '\n' +
    '	<div class="header" >\n' +
    '		Before you begin\n' +
    '	</div>\n' +
    '\n' +
    '	<p>\n' +
    '		Before you begin the tutorials, you’ll need to obtain a Trial Organization from AppExchange, create a Clay\n' +
    'developer account, and install the Clay Toolbelt software on your local workstation.\n' +
    '	</p>\n' +
    '\n' +
    '	<h1 class="step">\n' +
    '		Step 1: Obtain a Trial Organization\n' +
    '	</h1>\n' +
    '\n' +
    '	<p>This workbook uses a package from AppExchange called Light. To save you time and start developing at the\n' +
    'speed of light, we have set up a Trial Organization ready to use.</p>\n' +
    '\n' +
    '	<ol>\n' +
    '		<li>Navigate to <a>http://3vot.com/trial</a> and request a Free Trial Organization</li>\n' +
    '		<li>Complete registration and wait a minute for a Welcome Email from Salesforce</li>\n' +
    '		<li>Log in using your Trial Edition organization username and password.</li>\n' +
    '		<li>Click on Setup on the Top Right Header</li>\n' +
    '		<li>On the Search Bar in the Setup Menu type Token, and reset your security token. You\'ll get it by email.</li>\n' +
    '	</ol>\n' +
    '\n' +
    '<h1>Step 2: Install the Clay Command Lines Tools</h1>\n' +
    '<p>The Heroku Toolbelt is a free set of software tools that you’ll need to work with Heroku. To install the Heroku Toolbelt:</p>\n' +
    '<ol>\n' +
    '	<li>Navigate to <a>https://nodejs.com</a></li>\n' +
    '	<li>Select your development platform (Mac OS X, Windows, Debian/Ubuntu).</li>\n' +
    '	<li>Click the download button.</li>\n' +
    '	<li>After the download finishes, install the package in your computer</li>\n' +
    '	<li>Open a command line terminal. For Mac OS X users use the Terminal program, under App/Utilities. PC users, go to the Start Menu, and type cmd in the Run dialog.</li>\n' +
    '	<li>On the Command line type: npm install clay-cli -g </li>\n' +
    '	</ol>\n' +
    '\n' +
    '	<div class="msg msg__info">\n' +
    '		<span class=""></span>\n' +
    '		<p><strong class="blue">Note: </strong> You may need to run this command with sudo or administrator preferences</p>	\n' +
    '	</div>\n' +
    '	\n' +
    '	<h1>Step 3: Create a Clay Account</h1>\n' +
    '	<p>Clay is a cloud development platform. It provides powerful tools for building in Javascript. It also enables you to easily deploy your applications in an automated fashion.</p>\n' +
    '	<ol>\n' +
    '		<li>Navigate to <a>http://clayforsalesforce.com/register</a></li>\n' +
    '		<li>Enter your email address and name</li>\n' +
    '		<li>You\'ll get a Clay Secret Token</li>\n' +
    '		<li>Open Command LineTerminal and Type clay users --add</li>\n' +
    '		<li>The prompt will ask you for Clay Token and Trial Org Credentials including the Salesforce Secret Token</li>\n' +
    '	</ol>\n' +
    '</section>\n' +
    '\n' +
    '\n' +
    '';
},{}],4:[function(require,module,exports){
module.exports = '<section>\n' +
    '\n' +
    '	<div class="header" >\n' +
    '		Tutorial 1: Download and Run the App\n' +
    '	</div>\n' +
    '\n' +
    '	<p>Clay provides a powerful Platform as a Service for building web & mobile applications in a Javascript. In this\n' +
    '	tutorial, you create a Web application using pure Javascript we don\'t need any special frameworks.</p>\n' +
    '\n' +
    '\n' +
    '\n' +
    '\n' +
    '\n' +
    '	<p>Familiarity with Javascript is helpful, but not required for this exercise. The tutorial starts with an application\n' +
    '	template to get you up and running. You then walk through the steps to securely run the application within the\n' +
    '	Force.com platform.</p>\n' +
    '\n' +
    '	<h1>Step 1: Download the App with Clay</h1>\n' +
    '	<p>You start with a pre-existing Clay MVC-based application stored on Clay App Store. Then, as you make changes,\n' +
    '	all you need to do is refresh the browser, not waiting!</p>\n' +
    '	<ol>\n' +
    '		\n' +
    '		<li>Open a command line terminal. For Mac OS X users, this can be done by going to the Terminal program, under\n' +
    '	Applications/Utilities. For PC users, this can be done by going to the Start Menu, and typing cmd into the Run dialog.</li>\n' +
    '		\n' +
    '		<li>Once in the command line terminal, change to a directory where you want to download the example app. For example,\n' +
    '	if your directory is “development,” type cd development.</li>\n' +
    '		\n' +
    '		<li>In the command line type: clay download</li>\n' +
    '	</ol>\n' +
    '\n' +
    '	<h1>Step 2: Install Javascript Dependencies</h1>\n' +
    '	<p>Now that you have the project locally, you need download the javascript dependencies, this is done\n' +
    '	automatically using NPM, a tool from NODEJS.</p>\n' +
    '	<ol>\n' +
    '	<li>In the command line terminal, change directory to the clay-page-demo folder you created in the last step:\n' +
    '	cd page</li>\n' +
    '	<li>Execute the following command to download project dependencies: npm install .</li>\n' +
    '\n' +
    '	<li>Clay uses NPM to download dependencies, this technology is used in NodeJS. It had over100,000 libraries,\n' +
    '	all versioned. It\'s the profesional way to manage javascript dependencies. http://npmjs.org\n' +
    '	3</li>\n' +
    '\n' +
    '	<pre data-id="p2-1"></pre>\n' +
    '\n' +
    '	<div class="msg msg__info">\n' +
    '		<span class=""></span>\n' +
    '		<p>NPM downloads all libraries specified in a file called package.json, check the dependencies section to better understand how it works. It\'s really simple.\n' +
    '		</p>	\n' +
    '	</div>\n' +
    '\n' +
    '</section>\n' +
    '\n' +
    '<section class="cont">\n' +
    '	\n' +
    '\n' +
    '	<h1>Step 3: Run the Application</h1>\n' +
    '\n' +
    '	<p>This step shows how to develop HTML5 and Javascript Apps in Salesforce. Clay ships with a JavaScript development server that automates over 10 integration tasks, sit back and relax.</p>\n' +
    '\n' +
    '	<ol>\n' +
    '		<li>Go to the command line, make sure the current folder is clay-page-demo and run: </li>\n' +
    '	\n' +
    '		<pre>clay server</pre>\n' +
    '\n' +
    '		<li>Clay will prompt you to enter the Salesforce Organization, select the one you registered before</li>\n' +
    '\n' +
    '		<li>The browser will launch automatically and open the Visualforce Page but first:</li>\n' +
    '\n' +
    '	<div class="msg msg__alert">\n' +
    '		<span class=""></span>\n' +
    '		<p>To develop in Salesforce our local server must run in HTTPS, clay ships with unsigned SSL Certificates for localhost, your browser will alert your the first time. You must accept the Certificate, on Google Chrome click on advances and accept.</p>\n' +
    '	</div>\n' +
    '\n' +
    '	<li>Load the project in you favorite text editor, and open the file css/style.css.</li>\n' +
    '\n' +
    '	<li>Change the display in .startup from "block" to "none" and refresh your browser to see the changes.</li>\n' +
    '\n' +
    '	<pre>\n' +
    '  .startup{\n' +
    '    display: block;\n' +
    '  }\n' +
    '\n' +
    '  .startup {\n' +
    '     display: none;\n' +
    '  }\n' +
    '	</pre>\n' +
    '	</ol>\n' +
    '\n' +
    '	<h3>Tell me more</h3>\n' +
    '		<p>Clay Toolbelt\'s development server automatically created a VisualForce and transformed all files to point to the ones in you computer, then uploaded the VisualForce page. The uses Salesforce Front door to Log In and open the VisualForce Page. Since the VF Page is using assets in your computer, all it takes is a screen refresh after a change.</p>\n' +
    '\n' +
    '		<p>You can have several Salesforce Orgs and Clay Accounts registered at the same time. Control accounts with:\n' +
    '			<ol><pre>\n' +
    '  clay users --add \n' +
    '  clay users --remove</pre>\n' +
    '		</ol>\n' +
    '	\n' +
    '\n' +
    '\n' +
    '\n' +
    '</section>';
},{}],5:[function(require,module,exports){
module.exports = '<script> var test = "ok"; </script>\n' +
    '\n' +
    'function ok(){\n' +
    '  var a = "ok";\n' +
    '}\n' +
    '\n' +
    '<h2>ok ok ok </h2>\n' +
    '\n' +
    '';
},{}]},{},[1]);
