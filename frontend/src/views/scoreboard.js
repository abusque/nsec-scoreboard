var _ = require("underscore"),
    d3 = require("d3"),
    AskgodUrl = require("../config/askgodUrl"),
    ChartView = require("./chart");

var ScoreboardView = ChartView.extend({
    refreshInterval: 60000,

    initialize: function(options) {
        options.margin = {
            top: 20,
            right: 20,
            bottom: 30,
            left: 65
        };

        this.color = d3.scale.category20();

        ChartView.prototype.initialize.call(this, options);

        _.bindAll(this, "getStroke", "getPath", "getX", "getY",
                  "handleScoresSucccess", "handleScoresError",
                  "handleTeamsSucccess", "handleTeamsError",
                  "resizeGraph", "refreshData");

        d3.select(window).on("resize", this.resizeGraph);
        xmlrpc({
            url: AskgodUrl,
	    methodName: 'scores_timeline',
	    success: this.handleScoresSucccess,
	    error: this.handleScoresError
        });

        xmlrpc({
            url: AskgodUrl,
	    methodName: 'scores_scoreboard',
	    success: this.handleTeamsSucccess,
	    error: this.handleTeamsError
        });

        if(this.options.autoUpdate) {
            window.setInterval(this.refreshData, this.refreshInterval);
        }
    },

    refreshData: function() {
        this.graphInitialized = false;

        xmlrpc({
            url: AskgodUrl,
	    methodName: 'scores_timeline',
	    success: this.handleScoresSucccess,
	    error: this.handleScoresError
        });

        xmlrpc({
            url: AskgodUrl,
	    methodName: 'scores_scoreboard',
	    success: this.handleTeamsSucccess,
	    error: this.handleTeamsError
        });
    },

    handleScoresSucccess: function(response, status, jqXHR) {
        this.data = {};

        // Sort subbed flags chronologically
        response[0] = response[0].sort(function(a, b) {
            return new Date(a.submit_time) - new Date(b.submit_time);
        });

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

        var now = new Date();
        this.startDate = new Date(response[0][0].submit_time);
        this.endDate = now;
        var bestTeam = _.max(this.data, function(d) {
            return d[d.length - 1].value;
        });

        // Multiply by 1.1 to add a 10% margin on y axis
        this.maxScore = bestTeam[bestTeam.length - 1].value * 1.1;

        // Add an entry at current time with current score, otherwise
        // the graph stops at last flag entry. Also add entry with 0
        // score at beginning of array so line doesn't start in midair
        for(teamid in this.data) {
            var teamArray = this.data[teamid];

            var beginEntry = teamArray[0];
            var endEntry = teamArray[teamArray.length - 1];

            teamArray.unshift({
                teamid: teamid,
                submit_time: beginEntry.submit_time,
                value: 0
            });
            teamArray.push({
                teamid: teamid,
                submit_time: now,
                value: endEntry.value
            });
        }

        // Set the domain for the color mapping, from team name to
        // color
        this.color.domain(d3.keys(this.data));

        this.handleSync();
    },

    handleScoresError: function(jqXHR, status, error) {
        var msg = error.msg;
        msg = msg.slice(msg.indexOf(":") + 1);
        console.warn(msg);
    },

    handleTeamsSucccess: function(response, status, jqXHR) {
        this.teamsData = {};

        for(var i = 0; i < response[0].length; ++i) {
            entry = response[0][i];
            this.teamsData[entry.teamid] = {
                name: entry.team_name
            };
        }

        this.handleSync();
    },

    handleTeamsError: function(jqXHR, status, error) {
        var msg = error.msg;
        msg = msg.slice(msg.indexOf(":") + 1);
        console.warn(msg);
    },

    handleSync: function() {
        if(!this.data || !this.teamsData) return;

        if(!this.graphInitialized) {
            this.initGraph();
            var legendOptions = {
                data: this.data,
                teamsData: this.teamsData
            };
            NsecScoreboard.vent.trigger("showLegend", legendOptions);
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
            .interpolate("step-before")
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
            this.svg.selectAll(".team").remove();
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
        this.svg.selectAll(".team").remove();
        this.drawGraph();
    },

    drawData: function() {
        this.team = this.dataGroup.selectAll(".team")
            .data(Object.keys(this.data))
            .enter().append("g")
            .attr("class", "team");

        this.team.append("path")
            .attr("class", "line")
            .attr("d", this.getPath)
            .style("stroke", this.getStroke);
    },

    getStroke: function(d) {
        return this.color(d);
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
