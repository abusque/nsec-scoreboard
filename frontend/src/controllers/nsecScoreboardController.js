var Marionette = require("backbone.marionette"),
    NsecScoreboard = require("../nsecScoreboard.js"),
    SidebarView = require("../views/sidebar");

var NsecScoreboardController = Marionette.Controller.extend({
    start: function() {
        this.showLayout();
    },

    showLayout: function() {
        NsecScoreboard.sidebar.show(new SidebarView());
    }
});

module.exports = NsecScoreboardController;
