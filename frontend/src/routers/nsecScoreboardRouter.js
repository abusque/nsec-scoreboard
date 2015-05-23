var Marionette = require("backbone.marionette");

var NsecScoreboardRouter = Marionette.AppRouter.extend({
    appRoutes: {
        "": "showDefault",
        "scores/": "showScoreboard",
        "flags/": "showFlags",
        "team/": "showTeam",
        "plain/": "showPlain"
    }
});

module.exports = NsecScoreboardRouter;
