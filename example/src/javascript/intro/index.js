var React = require("react");



var Header = require("./header");

var Accounts = require("./accounts");

var Panels = require("./panels");

var App   =  React.createClass({

	render: function(){ return <div>

		<Header/>

		<div className="slds-grid slds-wrap">    

		<Panels/>


		<Accounts/>

		</div>
		

	</div>
	}
})
	

module.exports = App;