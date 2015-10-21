var React       = require("react");
var Icon        = require("../components/icons").Icon;
var ButtonIcon  = require("../components/icons").ButtonIcon;


var Header = React.createClass({

	render: function(){
 
		return <div className="myapp">    
	   	<div className="slds-page-header" role="banner">
			  <div className="slds-grid">
			    
			    <div className="slds-col slds-has-flexi-truncate">
			      <div className="slds-media">
			        <div className="slds-media__figure">
			          <img src="https://logo.clearbit.com/clearbit.com?size=50" /> 
			        </div>
			        <div className="slds-media__body">
			          <p className="slds-text-heading--label">Gulp Visulforce</p>
			          <div className="slds-grid">
			            <h1 className="slds-text-heading--medium slds-m-right--small slds-truncate slds-align-middle" title="Record Title">Introduction</h1>
			            <div className="slds-col slds-shrink-none"></div>
			          </div>
			        </div>
			      </div>
			    </div>
			    
			   	<div className="slds-col slds-no-flex slds-align-middle">
			      <div className="slds-button-group" role="group">
			        <div className="slds-dropdown-trigger">
				        <button className="slds-button  slds-button--brand ">
				        	<ButtonIcon category="utility" style={{fill: "#fff"}} name="like" size="large"/>
				        	<span className="slds-m-left--x-small slds-m-right--small">Github</span>
				        	<ButtonIcon style={{fill: "#fff"}} category="utility" name="down" size="small"/>
				        </button>

								<div className="slds-dropdown slds-dropdown--right slds-dropdown--small slds-dropdown--menu">
									<div className="slds-dropdown__header">
									<span className="slds-text-heading--label">Gulp Plugins</span>
								</div>

								<div className="slds-text-body--small slds-m-horizontal--medium">
									Checkout this repo on Github
								</div>
							
								<a href="https://github.com/rodriguezartav/gulp-visualforce" target="_blank" className="slds-button slds-button--brand slds-m-left--large slds-m-top--medium">Let's go</a>
							</div>
						</div>
				  </div>
				</div>
			</div>
		</div>
	</div>
	}

})

module.exports = Header;