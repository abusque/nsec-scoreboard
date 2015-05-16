var Marionette = require("backbone.marionette"),
    template = require("../../dist/templates").flag;

var FlagView = Marionette.ItemView.extend({
    template: template,
    tagName: "tr",

    serializeData: function() {
        var date = new Date(this.model.get("submit_time"));

        return {
            points: this.model.get("value"),
            date: date.toLocaleTimeString(),
            description: this.model.get("description")
        };
    }
});

module.exports = FlagView;
