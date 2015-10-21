var React       = require("react");
var Switch      = require('rc-switch');
var Icon        = require("../components/icons").Icon;
var ButtonIcon  = require("../components/icons").ButtonIcon;

var Panels = React.createClass({
  
  render: function(){

    return <div className="slds-size--12-of-12 slds-small-size--3-of-3 slds-medium-size--4-of-4 slds-large-size--4-of-12 slds-box slds-m-around--small slds-theme--shade ">
         { this.renderConfiguration() }
      </div>

  },

  renderConfiguration: function(){
    return  <div className="">

      <div className="slds-text-heading--small">
        <Icon theme="none" classes="slds-icon-standard-apps" category="standard" name="calibration" size="medium"/> 
        <span className="slds-m-left--x-small">Panels</span>
      </div>

      <div className="slds-text-body--small slds-m-vertical--medium">
        Thanks for trying out Gulp Visualforce Plugin
      </div>

      <label className="slds-text-body--regular" >Sample Text</label>

      <input className="slds-input" type="text" placeholder="" />

      <div className="slds-text-body--regular slds-m-top--medium">Sample Switch</div>

      <div className="slds-grid slds-m-top--x-small slds-wrap">

        
        <div className="slds-size-4-of-12 slds-small-size--1-of-6 slds-medium-size--1-of-6 slds-large-size--4-of-12">
          <Switch checkedChildren={'On'} unCheckedChildren={'Off'} />
        </div>

   
      </div>
      
      
      
    </div>
    
  },


 

});

module.exports = Panels;
