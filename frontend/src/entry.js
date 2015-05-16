var Backbone = require("backbone"),
    NsecScoreboard = require("./nsecScoreboard"),
    AskgodUrl = require("./config/askgodUrl"),
    // Controllers
    NsecScoreboardController = require("./controllers/nsecScoreboardController"),
    // Routers
    NsecScoreboardRouter = require("./routers/nsecScoreboardRouter");

NsecScoreboard.addInitializer(function () {
    window.NsecScoreboard = this;
});

NsecScoreboard.addInitializer(function () {
    window.xmlrpc = $.xmlrpc;
});

// Controllers initializers
NsecScoreboard.addInitializer(function() {
    var controller = new NsecScoreboardController();
    NsecScoreboard.controller = controller;
    NsecScoreboard.controller.start();
});

// Router initializers
NsecScoreboard.addInitializer(function() {
    var router = new NsecScoreboardRouter({
        controller: NsecScoreboard.controller
    });

    NsecScoreboard.router = router;
});

// Using on start ensure that history is started only after router and
// controllers are set
NsecScoreboard.on("start", function() {
    if(Backbone.history) {
        Backbone.history.start();
    }
});

NsecScoreboard.start();
