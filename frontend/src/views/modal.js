var Backbone = require("backbone"),
    bbm = require("backbone.modal"),
    template = require("../../dist/templates").modal;

var ModalView = Backbone.Modal.extend({
    template: template,
    submitEl: "#confirm-btn",

    initialize: function(options) {
        this.title = options.title;
        this.message = options.message;
    },

    serializeData: function() {
        return {
            title: this.title,
            message: this.message,
        };
    }
});

module.exports = ModalView;
