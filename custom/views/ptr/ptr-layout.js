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

        //CleanUp The UI
        $("#startFauxSiri").hide();
        $("#stopFauxSiri").hide();

        app.alert.dismiss('siri_listening');

        app.alert.show('siri_processing', {
            messages: ['Processing....'],
            closeable: true,
            autoClose: true,
            level: 'info',
        });

        //Make the request to wit and then create a new account.
        var that = this;
        this.sendRequestToWit(null,function(witResponse){

            var accountName = witResponse.entities.noun[0].value;
            that.createAccount(accountName);
        })

    },

  /**
   * Send a request to the wit api
   *
   * @param err
   * @param callback
   */
    sendRequestToWit: function(err, callback) {

        $.ajax({
            url: 'https://api.wit.ai/message?v=20160928&q=create%20account%20salesforce',
            headers: {
                Authorization: 'Bearer X46FYEZ5LOGGH73ZLDC7EV3IYJEGPSY7'
            },
            success: function(resp) {

                callback(resp);
            },
            error: function() {
                err();
            },
        });
    },

  /**
   *  Create an account and navigate to the detail view when done.
   * @param accountName
   */
  createAccount: function(accountName){

        var postModel = app.data.createBean('Accounts');

        postModel.set({
            name: accountName
        });

        postModel.save(null, {
            fields: ['name'],

            params: {
                skipOfflineRead: true,
            },
            success: function(model) {
                // Do any additional setup after checkin activity is saved
                app.controller.navigate('Accounts/'+model.get('id'));
            },

            error: function(err) {
                alert('bad');
                // Add error handling.
            },
        });

    },

    /**
     *
     *
     */
    startSiriListening: function() {

        $("#startFauxSiri").hide();
        $("#stopFauxSiri").show();
        $("#spinnerVoice").show();


        app.alert.show('siri_listening', {
            messages: ['Listening....'],
            closeable: true,
            autoClose: false,
            level: 'load',
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
