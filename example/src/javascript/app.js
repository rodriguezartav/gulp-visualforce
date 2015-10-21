var React         = require("react");
var ReactDOM      = require("react-dom");
window._sf.ajax   = require("clay-model-salesforce-api");

if (window._sf.ajax.registerToken) {
  window._sf.ajax.registerToken({
    access_token: window._sf.api,
    instance_url: window._sf.host
  });
} else { window._sf.ajax.namespace = "cbit.cbt_"; }

var Intro = require("./intro");
ReactDOM.render(<Intro /> , document.querySelector(".slds"));
