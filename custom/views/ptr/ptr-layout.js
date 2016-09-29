/*
 * Your installation or use of this SugarCRM file is subject to the applicable
 * terms available at
 * http://support.sugarcrm.com/Resources/Master_Subscription_Agreements/.
 * If you do not agree to all of the applicable terms or do not have the
 * authority to bind the entity as an authorized representative, then do not
 * install or use this SugarCRM file.
 *
 * Copyright (C) SugarCRM Inc. All rights reserved.
 */

var app = SUGAR.App;
var customization = require('%app.core%/customization');
var ptr = require('%app.views%/ptr');
var dialog = require('%app.core%/dialog');

var PtrCustomView = customization.declareView({
    register: { type: 'PtrExample' },
}, {
    template: 'ptr-custom-view',
    shouldFetchContext: false,

    initialize: function(options) {
        this._super(options);

        // Add ptr to current view and attach handler.
        ptr({
            view: this,
            ptrAction: _.bind(this.ptrRefresh, this),
        });
    },

    events: {
        "click #startFauxSiri": 'startSiriListening',
        "click #stopFauxSiri": 'stopSiri',

    },

    /**
     *
     */
    stopSiri: function() {

        console.log("Stopping siri.....");
        $("#startFauxSiri").show();
        $("#stopFauxSiri").hide();

        app.alert.dismiss('siri_listening');

        app.alert.show('siri_processing', {
            messages: ['Processing....'],
            closeable: true,
            autoClose: true,
            level: 'info',
        });

    },

    /**
     *
     *
     */
    startSiriListening: function() {

        $("#startFauxSiri").hide();
        $("#stopFauxSiri").show();

        app.alert.show('siri_listening', {
            messages: ['Listening....'],
            closeable: true,
            autoClose: false,
            level: 'success',
        });

        /*
        audioinput.start({
            // Here we've changed the bufferSize from the default to 8192 bytes.
            bufferSize: 8192
        });
        */

    },
    ptrRefresh: function() {
        dialog.showAlert('event has been triggered');

        // Hide loading animation (spinner).
        this.hidePtrSpinner();
    },

    loadData: function() {
        // custom data loading method.
    },
});

var PtrLayout = customization.declareLayout({
    views: [PtrCustomView],
    header: {
        enabled: true,
        title: app.lang.get('Faux Siri'),
        buttons: {
            mainMenu: true,
        },
    },
    register: { type: 'PtrExample' },
});

module.exports = PtrLayout;
