var argscheck = require('cordova/argscheck'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec');

/**
 * Constructor
 */
function NomadSpeechPlugin() {
}

NomadSpeechPlugin.prototype.enableAssistant = function(){
    cordova.exec(null, null, "NomadSpeechPlugin", "enableAssistant", []);
};

cordova.addConstructor(function() {
    if (!window.plugins) window.plugins = {};
    window.plugins.NomadSpeechPlugin = new NomadSpeechPlugin();
});

