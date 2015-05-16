var _ = require("underscore"),
    Backbone = require("backbone"),
    Marionette = require("backbone.marionette"),
    AskgodUrl = require("../config/askgodUrl"),
    FlagView = require("./flag"),
    ModalView = require("./modal"),
    NsecScoreboard = require("../nsecScoreboard"),
    template = require("../../dist/templates").flags;

var FlagsView = Marionette.CompositeView.extend({
    template: template,

    childView: FlagView,
    childViewContainer: "tbody",

    ui: {
        flagField: "#flag-input",
        submitBtn: "#submit-btn"
    },

    initialize: function(options) {
        _.bindAll(this, "handleFlagSuccess", "handleFlagError",
                  "handleListSuccess", "handleListError");
        xmlrpc({
	    url: AskgodUrl,
	    methodName: 'scores_list_submitted',
	    success: this.handleListSuccess,
	    error: this.handleListError
	});
    },

    onRender: function() {
        this.delegateEvents({
            "click @ui.submitBtn": this.handleSubmit
        });
    },

    handleSubmit: function() {
        var flag = this.ui.flagField.val();

        xmlrpc({
	    url: AskgodUrl,
	    methodName: 'scores_submit',
	    params : [flag],
	    success: this.handleFlagSuccess,
	    error: this.handleFlagError
	});
    },

    handleFlagSuccess: function(response, status, jqXHR) {
	var entry = response[0][0];
        var message = "You scored " + entry.value + " points!";
	if (entry.return_string) {
            message += "<br/>" + entry.return_string;
	}

        var options = {
            title: "Flag Submitted",
            message: message
        }

        NsecScoreboard.modalContainer.show(new ModalView(options));

        this.ui.flagField.val("");
    },

    handleFlagError: function(jqXHR, status, error) {
        var message = error.message;
        message = message.slice(message.indexOf(":") + 1);

        var options = {
            title: "Flag Failed",
            message: message
        }

        NsecScoreboard.modalContainer.show(new ModalView(options));

        this.ui.flagField.val("");
    },

    handleListSuccess: function(response, status, jqXHR) {
        this.collection = new Backbone.Collection(response[0]);
        this.render();
    },

    handleListError: function(jqXHR, status, error) {
	var msg = error.msg;
        msg = msg.slice(msg.indexOf(":") + 1);
        console.warn(msg);
    }
});

module.exports = FlagsView;
