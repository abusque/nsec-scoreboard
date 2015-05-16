var _ = require("underscore"),
    Marionette = require("backbone.marionette"),
    NsecScoreboard = require("../nsecScoreboard"),
    ModalView = require("./modal"),
    template = require("../../dist/templates").team;

var TeamView = Marionette.ItemView.extend({
    template: template,

    ui: {
        nameField: "#team-name-input",
        countryField: "#team-country-input",
        websiteField: "#team-website-input",
        submitBtn: "#submit-btn"
    },

    initialize: function(options) {
        _.bindAll(this, "handleGetSuccess", "handleGetError");
        xmlrpc({
	    url: AskgodUrl,
	    methodName: 'teams_getdetails',
	    success: this.handleGetSuccess,
	    error: this.handleGetError
	});
    },

    onRender: function() {
        this.delegateEvents({
            "click @ui.submitBtn": this.handleSubmit
        });

        if(this.team) {
            if(!this.team.name) {
                this.ui.nameField.prop("disabled", false);
                this.ui.submitBtn.prop("disabled", false);
            } else {
                this.ui.nameField.val(this.team.name);
            }

            if(!this.team.country) {
                this.ui.countryField.prop("disabled", false);
                this.ui.submitBtn.prop("disabled", false);
            } else {
                this.ui.countryField.val(this.team.country);
            }

            if(!this.team.website) {
                this.ui.websiteField.prop("disabled", false);
                this.ui.submitBtn.prop("disabled", false);
            } else {
                this.ui.websiteField.val(this.team.website);
            }
        }
    },

    handleSubmit: function() {
        params = {};

        if(!this.team.name) {
            this.team.name = this.ui.nameField.val();
            params["name"] = this.team.name;
        }

        if(!this.team.country) {
            this.team.country = this.ui.countryField.val();
            params["country"] = this.team.country;
        }

        if(!this.team.website) {
            this.team.website = this.ui.websiteField.val();
            params["website"] = this.ui.websiteField.val();
        }

        xmlrpc({
	    url: AskgodUrl,
	    methodName: 'teams_setdetails',
            params: [params],
	    success: this.handleSetSuccess,
	    error: this.handleSetError
	});

        this.render();
    },

    handleGetSuccess: function(response, status, jqXHR) {
        this.team = response[0];
        this.render();
    },

    handleGetError: function(jqXHR, status, error) {
	var msg = error.msg;
        msg = msg.slice(msg.indexOf(":") + 1);
        console.warn(msg);
    },

    handleSetSuccess: function(response, status, jqXHR) {
        var options = {
            title: "Team Info Updated",
            message: "Team information set. Welcome to NSEC 2015"
        }

        NsecScoreboard.modalContainer.show(new ModalView(options));
    },

    handleSetError: function(jqXHR, status, error) {
        var options = {
            title: "Error",
            message: "Team information already set."
        }

        NsecScoreboard.modalContainer.show(new ModalView(options));
    }
});

module.exports = TeamView;
