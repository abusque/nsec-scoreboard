var Backbone = require("backbone"),
    Marionette = require("backbone.marionette"),
    NsecScoreboard = ("../nsecScoreboard"),
    template = require("../../dist/templates").sidebar;

var SidebarView = Marionette.ItemView.extend({
    template: template,
    tagName: "ul"
});

module.exports = SidebarView;
