var Marionette = require("backbone.marionette"),
    NsecScoreboard = require("../nsecScoreboard.js"),
    // Views
    SidebarView = require("../views/sidebar"),
    VisualisationLayout = require("../layouts/visualisation"),
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

    showScoreboard: function(options) {
        NsecScoreboard.contents.show(new VisualisationLayout(options));
    },

    showFlags: function() {
        NsecScoreboard.contents.show(new FlagsView());
    },

    showTeam: function() {
        NsecScoreboard.contents.show(new TeamView());
    },

    showPlain: function() {
        this.clearPage();
        this.showScoreboard({
            noClipLegend: true,
            autoUpdate: true
        });
    },

    clearPage: function() {
        $(".sidebar-bg").remove();
        $(".sidebar").remove();
        $(".top").remove();
        $(".sponsors").remove();
        $(".contents-and-controls").css("margin-left", 0);
    }
});

module.exports = NsecScoreboardController;
