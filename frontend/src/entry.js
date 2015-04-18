var Backbone = require("backbone"),
    NsecScoreboard = require("./nsecScoreboard"),
    // Controllers
    NsecScoreboardController = require("./controllers/nsecScoreboardController");

NsecScoreboard.addInitializer(function () {
    window.NsecScoreboard = this;
});

// Controllers initializers
NsecScoreboard.addInitializer(function() {
    var nsecScoreboardController = new NsecScoreboardController();
    NsecScoreboard.nsecScoreboardController = nsecScoreboardController;
    NsecScoreboard.nsecScoreboardController.start();
});

NsecScoreboard.start();
