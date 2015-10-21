var React         = require("react");

var Account = require("../models/account");

var Icon        = require("../components/icons").Icon;
var ButtonIcon  = require("../components/icons").ButtonIcon;


var Panels = React.createClass({

	getInitialState: function(){
		return { accounts: [] }
	},

	componentDidMount: function(){
		var _this = this;
		Account.query("select id,Name from Account")
			.then( function(){
				_this.setState( { accounts: Account.all() } )
			})
	},
  
  render: function(){
  	var _this = this;
    return <div className="slds-size--12-of-12 slds-small-size--3-of-3 slds-medium-size--4-of-4 slds-large-size--4-of-12 slds-box slds-m-around--small slds-theme--shade ">
           <div className="slds-text-heading--small">
        <Icon theme="none" classes="slds-icon-standard-account" category="standard" name="account" size="medium"/> 
        <span className="slds-m-left--x-small">Panels</span>
      </div>

        <ul className="slds-list--vertical slds-has-cards slds-m-top--small">
  


        {
    		this.state.accounts.map( function(account){
    			return <li key={account.id} className="slds-list__item"><a href="#">{ account.Name }</a></li>
    		} )

    	}
</ul>

      </div>



  },

   

});

module.exports = Panels;
