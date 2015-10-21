var React = require("react");


var ButtonIcon = React.createClass({

    render: function(){
        var useTag = '<use xlink:href="'+window._sf.staticResource +'/assets/icons/utility-sprite/svg/symbols.svg#' + this.props.name + '" />';
        var className  = "slds-button__icon";
        if (this.props.stateful) {
            className += "--stateful";
        }
        if (this.props.position) {
            className = className + " slds-button__icon--" + this.props.position;
        }
        if (this.props.size) {
            className = className + " slds-button__icon--" + this.props.size;
        }
        if (this.props.hint) {
            className = className + " slds-button__icon--hint";
        }
        if (this.props.inverse) {
            className = className + " slds-button__icon--inverse";
        }
        if( this.props.classes ) className += " " + this.props.classes

        return <svg style={this.props.style} aria-hidden="true" className={className} dangerouslySetInnerHTML={{__html: useTag }} />;
    }

});


var Icon = React.createClass({

    getDefaultProps: function(){
        return {
            category: "standard"
        }
    },

    render: function(){
        var useTag = '<use xlink:href="'+window._sf.staticResource+'/assets/icons/' + this.props.category + '-sprite/svg/symbols.svg#' + this.props.name + '" />';
        var className  = "slds-icon";

        var theme = this.props.theme === undefined ? this.props.name : this.props.theme;
        if (this.props.stateful) {
            className += "--stateful";
        }
        if (this.props.size) {
            className = className + " slds-icon--" + this.props.size;
        }
        if (this.props.position) {
            className = className + " slds-icon--" + this.props.position;
        }
        if (theme && theme != "ignore") {
            className = className + " slds-icon-" + this.props.category + "-" + theme;
        }
        if( this.props.classes ) className += " " + this.props.classes
        return <svg style={ this.props.style }  aria-hidden="true" className={className} dangerouslySetInnerHTML={{__html: useTag }} />;
    }

});

var InputIcon = React.createClass({

    render: function(){
        var useTag = '<use xlink:href="'+window._sf.staticResource +'/assets/icons/utility-sprite/svg/symbols.svg#' + this.props.name + '" />';
        var className  = "slds-input__icon slds-icon-text-default";
        return <svg  aria-hidden="true" className={className} dangerouslySetInnerHTML={{__html: useTag }} />;
    }

});


module.exports = {
	InputIcon: InputIcon,
	Icon: Icon,
	ButtonIcon: ButtonIcon
}