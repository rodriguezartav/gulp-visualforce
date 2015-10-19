var fs = require("fs");


function wrap(original, sourceFolder, localDevelopment ){
	if(!sourceFolder) sourceFolder = "build"
	if(localDevelopment) return original

	original.https=  true

	if(!original.server) original.server = {};

	original.server.https= true,
	  
	original.server.middleware= function (req, res, next) {	    
    


    if(req.url.indexOf("/load.html") == 0 ){
      var script = '<script>window.location ="' + process.env.INSTANCE_URL + "/apex/" + process.env.NAME + '";</script>';
      fs.writeFileSync( process.cwd() + "/"+ sourceFolder +"/load.html", script  );
     
    }
    next();
  }
	
	original.startPath= "/load.html";

	return original;

	}

	module.exports = wrap;
