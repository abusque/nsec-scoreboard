var _ = require("underscore"),
    Marionette = require("backbone.marionette"),
    // Views
    ScoreboardView = require("../views/scoreboard.js"),
    TeamLegendView = require("../views/teamLegend.js"),
    // Templates
    template = require("../../dist/templates").visualisation,
    NsecScoreboard = require("../nsecScoreboard");

var VisualisationLayout = Marionette.LayoutView.extend({
    template: template,

    regions: {
        chart: ".chart",
        legend: ".legend",
    },

    initialize: function() {
        this.listenTo(NsecScoreboard.vent, "showLegend", this.showLegend);
    },

    onShow: function() {
        this.chart.show(new ScoreboardView());
    },

    showLegend: function(options) {
        this.legend.show(new TeamLegendView(options));
    }
});

module.exports = VisualisationLayout;
