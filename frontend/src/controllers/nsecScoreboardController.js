var Marionette = require("backbone.marionette"),
    NsecScoreboard = require("../nsecScoreboard.js"),
    // Views
    SidebarView = require("../views/sidebar"),
    TeamView = require("../views/team"),
    FlagsView = require("../views/flags");

var NsecScoreboardController = Marionette.Controller.extend({
    start: function() {
        this.showLayout();
    },

    showLayout: function() {
        NsecScoreboard.sidebar.show(new SidebarView());
    },

    showDefault: function() {
        this.showScoreboard();
    },

    showScoreboard: function() {
        // meh
    },

    showFlags: function() {
        NsecScoreboard.contents.show(new FlagsView());
    },

    showTeam: function() {
        NsecScoreboard.contents.show(new TeamView());
    }
});

module.exports = NsecScoreboardController;
