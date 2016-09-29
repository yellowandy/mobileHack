/**
 * Created by amaiti on 9/26/16.
 */

var app = SUGAR.App;
var nomadVoiceManager = {
    init: function() {
        app.events.on('app:start', this.onAppStart, this);
    },

    onAppStart: function () {
        //window.plugins.NomadSpeechPlugin.enableAssistant();
    }
};

app.augment('nomadVoiceManager', nomadVoiceManager);
module.exports = nomadVoiceManager;
