var _ = require("underscore"),
    d3 = require("d3"),
    AskgodUrl = require("../config/askgodUrl"),
    ChartView = require("./chart");

var ScoreboardView = ChartView.extend({
    maxScore: 50,

    initialize: function(options) {
        options.margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 65
        };

        this.startDate = new Date('05/15/2015');
        this.endDate = new Date('05/17/2015');

        ChartView.prototype.initialize.call(this, options);

        _.bindAll(this, "getStroke", "getPath", "getX", "getY",
                  "handleScoresSucccess", "handleScoresError", "resizeGraph");

        d3.select(window).on("resize", this.resizeGraph);
        xmlrpc({
            url: AskgodUrl,
	    methodName: 'scores_timeline',
	    success: this.handleScoresSucccess,
	    error: this.handleScoresError
        });
    },

    handleScoresSucccess: function(response, status, jqXHR) {
        this.data = {};

        for(var i = 0; i < response[0].length; ++i) {
            entry = response[0][i];
            if(!this.data[entry.teamid]) {
                this.data[entry.teamid] = [];
            } else {
                // Keep running total for team, not only the points delta
                var teamArray = this.data[entry.teamid];
                entry.value += teamArray[teamArray.length - 1].value;
            }

            this.data[entry.teamid].push(entry);
        }

        console.log(this.data);

        this.handleSync();
    },

    handleScoresError: function(jqXHR, status, error) {
        var msg = error.msg;
        msg = msg.slice(msg.indexOf(":") + 1);
        console.warn(msg);
    },

    handleSync: function() {
        if(!this.graphInitialized) {
            this.initGraph();
        }
    },

    initializeVisualisation: function() {
        this.initializeScales();
        this.initializeAxes();
        this.graphInitialized = true;
    },

    initializeScales: function() {
        this.x = d3.time.scale()
            .domain([this.startDate, this.endDate])
            .range([0, this.width]);

        this.y = d3.scale.linear()
            .domain([0, this.maxScore])
            .range([this.height, 0]);

        this.line = d3.svg.line()
            .interpolate("step")
            .x(this.getX)
            .y(this.getY);
    },

    initializeAxes: function() {
        // One tick every 50 or 100px, but at least 2 ticks
        var xTicksCount = Math.max(this.svgWidth / 100, 2);
        var yTicksCount = Math.max(this.svgHeight / 50, 2);

        this.xAxis = d3.svg.axis()
            .scale(this.x)
            .orient("bottom")
            .ticks(xTicksCount);

        this.yAxis = d3.svg.axis()
            .scale(this.y)
            .orient("left")
            .ticks(yTicksCount);

        this.xLabel = "Time";
        this.yLabel = "Points";
    },

    redrawGraph: function() {
        if(!this.graphInitialized) {
            this.initializeVisualisation();
        } else {
            this.bins.data([]).exit().remove();
        }

        this.drawGraph();
    },

    resizeGraph: function() {
        if(!this.svgWidth) return;
        if(!this.data) return;

        this.setDimensions();

        this.$el.attr("width", this.svgWidth);
        this.$el.attr("height", this.svgHeight);
        d3.select(this.selector).style("height", this.svgHeight);

        this.drawBackground();
        this.initializeVisualisation();
        if(this.bins) {
            this.bins.data([]).exit().remove();
        }
        this.setBinSize();
        this.z.domain([0, this.data.maxCount]);
        this.drawGraph();
    },

    drawData: function() {
        this.team = this.svg.selectAll(".team")
            .data(Object.keys(this.data))
            .enter().append("g")
            .attr("class", "team");

        this.team.append("path")
            .attr("class", "line")
            .attr("d", this.getPath)
            .style("stroke", this.getStroke);
    },

    getStroke: function(d) {
        return "chartreuse";
    },

    getPath: function(d) {
        var teamData = this.data[d];
        var values = teamData.map(function(d) {
            return {
                time: d.submit_time,
                score: d.value
            };
        });

        return this.line(values);
    },

    getX: function(d) {
        return this.x(d.time);
    },

    getY: function(d) {
        return this.y(d.score);
    }
});

module.exports = ScoreboardView;
