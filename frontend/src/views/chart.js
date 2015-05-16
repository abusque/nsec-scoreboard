var _ = require("underscore"),
    Marionette = require("backbone.marionette"),
    d3 = require("d3");

var ChartView = Marionette.ItemView.extend({
    template: false,
    tagName: "svg",

    margin: {
        top: 20,
        right: 20,
        bottom: 30,
        left: 45
    },

    aspectRatio: 1.778, // 16:9

    initialize: function(options) {
        if(options.margin) this.margin = options.margin;
        this.selector = options.selector || ".contents";
        this.setDimensions();

        this.setElement(d3.select(this.selector)
                        .append("svg")
                        .attr("width", this.svgWidth)
                        .attr("height", this.svgHeight)
                        [0]);
    },

    onRender: function() {
        this.svg = d3.select(this.el)
            .append("g")
            .attr("transform", "translate(" + this.margin.left +
                  "," + this.margin.top + ")");
    },

    initGraph: function() {
        this.drawBackground();
        if(this.data) {
            this.initializeVisualisation();
            this.drawGraph();
        }
    },

    drawGraph: function() {
        if(this.zoomable && !this.initedZoom) {
            this.initZoom();
        }

        this.drawData();
        this.drawAxes();
    },

    drawBackground: function() {
        this.svg.select("#bg-rect").remove();
        this.svg.append("rect")
            .attr("id", "bg-rect")
            .attr("width", this.width)
            .attr("height", this.height);

        // Clipping zone
        this.svg.select("defs").remove();
        this.svg.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("id", "clip-rect")
            .attr("width", this.width)
            .attr("height", this.height);

        // Data container
        this.svg.select("#data-group").remove();
        this.dataGroup = this.svg.append("g")
            .attr("id", "data-group")
            .attr("clip-path", "url(#clip)");
    },

    drawAxes: function() {
        if(this.options.noAxes) return;

        this.svg.select(".x.axis").remove();
        this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this.height + ")")
            .call(this.xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", this.width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text(this.xLabel);

        this.svg.select(".y.axis").remove();
        this.svg.append("g")
            .attr("class", "y axis")
            .call(this.yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(this.yLabel);
    },

    zoomed: function() {
        this.svg.select(".x.axis").call(this.xAxis);
        this.svg.select(".y.axis").call(this.yAxis);
    },

    setDimensions: function() {
        this.svgWidth = this.getWidth();
        this.svgHeight = this.getHeight();

        this.width = this.svgWidth - this.margin.left - this.margin.right;
        this.height = this.svgHeight - this.margin.top - this.margin.bottom;
    },

    getWidth: function() {
        return parseInt(d3.select(this.selector).style("width"));
    },

    getHeight: function() {
        return this.svgWidth / this.aspectRatio;
    },

    // Remove resize listener
    onBeforeDestroy: function() {
        if(this.options.ventPrefix) {
            d3.select(window).on("resize."  + this.options.ventPrefix, null);
        } else {
            d3.select(window).on("resize", null);
        }
    }
});

module.exports = ChartView;
