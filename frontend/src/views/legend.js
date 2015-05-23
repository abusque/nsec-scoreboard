var _ = require("underscore"),
    $ = require("jquery"),
    d3 = require("d3"),
    Marionette = require("backbone.marionette");

var LegendView = Marionette.ItemView.extend({
    template: false,
    tagName: "svg",

    margin: {
        top: 0,
        right: 20,
        bottom: 0,
        left: 0
    },

    // Toggle between small/medium when width crosses this value
    sizeThreshold: 250,

    itemHeight: {
        small: 15,
        medium: 20
    },

    squareSize: {
        small: 9,
        medium: 18
    },

    textSize: {
        small: ".17em",
        medium: ".35em"
    },

    textXPos: {
        small: 12,
        medium: 25
    },

    initialize: function(options) {
        this.width = parseInt(d3.select(".legend").style("width"));

        // Hackish way to set the svg element, otherwise improper
        // namespacing prevents it from being displayed
        this.setElement(d3.select(".legend").append("svg")
                        .attr("width", this.width)
                        [0]);

        this.domain = d3.keys(this.options.data);
        this.color = d3.scale.category20();
        this.color.domain(this.domain);
        this.stroke = this.options.stroke || "none";

        var data = this.options.data;
        this.domain.sort(function(d) {
            var teamData = data[d];
            return teamData[teamData.length - 1].value;
        });

        _.bindAll(this, "fill", "getRectX", "getTextX", "resize",
                  "drawLegend");

        d3.select(window).on("resize.legend", this.resize);
    },

    drawLegend: function() {
        var sizeKey = this.getSizeKey();
        var height = 0,
            itemHeight = this.itemHeight[sizeKey];

        this.legend = d3.select(this.el)
            .selectAll(".legend-item")
            .data(this.domain)
            .enter()
            .append("g")
            .classed("legend-item", true)
            .attr("transform", function (d, i) {
                var transform = "translate(0," + height + ")";
                height += itemHeight;
                return transform;
            });

        this.legend.append("rect")
            .attr("x", this.getRectX)
            .attr("width", this.squareSize[sizeKey])
            .attr("height", this.squareSize[sizeKey])
            .style("fill", this.fill)
            .style("stroke", this.stroke);

        labels = this.legend.append("text")
            .attr("x", this.getTextX)
            .attr("y", 9)
            .attr("dy", this.textSize[sizeKey])
            .style("text-anchor", "start")
            .text(this.getLegendText);

        var boundGetTextX = _.bind(this.getTextX, this);
        var maxWidthLabel = _.max(labels[0], function(e) {
            return e.getComputedTextLength() + boundGetTextX(e);
        });
        var maxWidth = maxWidthLabel.getComputedTextLength() +
            this.getTextX(maxWidthLabel) + 30;

        var divWidth = parseInt(d3.select(".legend").style("width"));
        if(maxWidth < divWidth) {
            maxWidth = divWidth - this.margin.right;
        }

        this.$el.attr("width", maxWidth);
        this.$el.attr("height", height);
        this.setDivSize();
    },

    resize: function() {
        d3.selectAll(".legend-item").remove();
        this.drawLegend();
    },

    setDivSize: function() {
        var chartHeight = d3.select(".chart").style("height");
        d3.select(".legend").style("height", chartHeight);
    },

    fill: function(d) {
        if (_.isString(this.color)) {
            return this.color;
        } else {
            return this.color(d);
        }
    },

    getRectX: function(d) {
        return 0;
    },

    getTextX: function(d) {
        return this.textXPos[this.getSizeKey()];
    },

    getSizeKey: function() {
        return parseInt(d3.select(".legend").style("width")) <
            this.sizeThreshold ? "small" : "medium";
    }
});

module.exports = LegendView;
