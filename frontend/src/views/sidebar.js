var Backbone = require("backbone"),
    Marionette = require("backbone.marionette"),
    NsecScoreboard = ("../nsecScoreboard"),
    template = require("../../dist/templates").sidebar;

var SidebarView = Marionette.ItemView.extend({
    template: template,
    tagName: "ul",

    ui: {
        links: "a"
    },

    events: {
        "click @ui.links": "handleClick"
    },

    handleClick: function(e) {
        console.log(e);
    }
});

module.exports = SidebarView;
