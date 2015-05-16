var $ = require("jquery"),
    Backbone = require("backbone");
// Must be set before requiring Marionette
Backbone.$ = $;
var Marionette = require("backbone.marionette");

var NsecScoreboard = new Marionette.Application({
    logEvents: function(log) {
        if(log) {
            if(!this.loggingEvents) {
                NsecScoreboard.vent.on("all", this.logEvent);
                this.loggingEvents = true;
            }
        } else {
            NsecScoreboard.vent.off("all", this.logEvent);
            this.loggingEvents = false;
        }
    },

    logEvent: function(event, payload) {
        console.log(event, payload);
    }
});

NsecScoreboard.addRegions({
    contents: ".contents",
    sidebar: ".sidebar"
});

module.exports = NsecScoreboard;
