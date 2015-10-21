var Model = require("clay-model");
var Ajax = window._sf.ajax;

var Documento = Model.setup("Acount", ["Id", "Name"] );
Documento.ajax = Ajax;


module.exports= Documento;
