var Marionette = require("backbone.marionette"),
    NsecScoreboard = require("../nsecScoreboard.js"),
    // Views
    SidebarView = require("../views/sidebar"),
    ScoreboardView = require("../views/scoreboard"),
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
        NsecScoreboard.contents.show(new ScoreboardView());
    },

    showFlags: function() {
        NsecScoreboard.contents.show(new FlagsView());
    },

    showTeam: function() {
        NsecScoreboard.contents.show(new TeamView());
    }
});

module.exports = NsecScoreboardController;
