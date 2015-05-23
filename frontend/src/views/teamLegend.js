var _ = require("underscore"),
    d3 = require("d3"),
    LegendView = require("./legend");

var TeamLegendView = LegendView.extend({
    initialize: function(options) {
        LegendView.prototype.initialize.call(this, options);

        _.bindAll(this, "getLegendText");
    },

    onShow: function() {
        this.drawLegend();
    },

    getLegendText: function(d) {
        var teamData = this.options.data[d];
        var score = teamData[teamData.length - 1].value;
        return this.options.teamsData[d].name + " - " + score + " pts";
    },
});

module.exports = TeamLegendView;
