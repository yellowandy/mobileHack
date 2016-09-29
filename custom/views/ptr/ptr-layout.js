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

    audioContext: undefined,
    recorder: undefined,
    _moduleMap: {
        account: 'Accounts',
        contact: 'Contacts'
    },
    initialize: function(options) {
        this._super(options);

        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
        this.audioContext = new AudioContext;


        console.log('this.audioContext: ', this.audioContext);

        // Add ptr to current view and attach handler.
        ptr({
            view: this,
            ptrAction: _.bind(this.ptrRefresh, this),
        });
    },

    _render: function() {
        this._super('_render');

        this.$('#startFauxSiri').off('click', null, this);
        this.$('#stopFauxSiri').off('click', null, this);

        this.$('#startFauxSiri').on('click', _.bind(this.startSiriListening, this));
        this.$('#stopFauxSiri').on('click', _.bind(this.stopSiri, this));
    },

    /**
     *
     *
     */
    startSiriListening: function() {
        this.$("#startFauxSiri").hide();
        this.$("#stopFauxSiri").show();
        this.$("#spinnerVoice").show();

        app.alert.show('siri_listening', {
            messages: ['Listening....'],
            closeable: true,
            autoClose: false,
            level: 'load',
        });

        navigator.getUserMedia({audio: true}, _.bind(this.startRecording, this), function(e) {
            console.log('No live audio input: ' + e);
        });
    },

    /**
     *
     */
    stopSiri: function() {
        console.log("Stopping siri.....");

        //CleanUp The UI
        this.$("#startFauxSiri").show();
        this.$("#stopFauxSiri").hide();
        this.$("#spinnerVoice").hide();

        app.alert.dismiss('siri_listening');

        app.alert.show('siri_processing', {
            messages: ['Processing....'],
            closeable: true,
            autoClose: true,
            level: 'info'
        });

        this.stopRecording();
    },

  /**
   * Send a request to the wit api
   *
   * @param err
   * @param callback
   */
    sendRequestToWit: function(err, callback, data) {
        $.ajax({
            url: 'https://api.wit.ai/speech?v=20160928',
            type: 'POST',
            processData: false,
            data: data,
            headers: {
                Authorization: 'Bearer X46FYEZ5LOGGH73ZLDC7EV3IYJEGPSY7',
                'Content-type': 'audio/wav'
            },
            success: function(resp) {
                console.log('resp: ', resp);
                callback(resp);
            },
            error: function() {
                err();
            }
        });
    },

    startRecording: function(stream) {
        var input = this.audioContext.createMediaStreamSource(stream);

        this.recorder = new Recorder(input, {
            numChannels: 1
        });
        console.log('Recorder initialised.');
        this.recorder && this.recorder.record();
    },

    stopRecording: function() {
        this.recorder.stop();

        this.recorder.exportWAV(_.bind(function(blob) {
            var url = URL.createObjectURL(blob);
            var li = document.createElement('li');
            var au = document.createElement('audio');
            var hf = document.createElement('a');

            au.controls = true;
            au.src = url;
            hf.href = url;
            hf.download = new Date().toISOString() + '.wav';
            hf.innerHTML = hf.download;
            li.appendChild(au);
            li.appendChild(hf);
            this.$('#recordingslist').append(li);

            console.log('currentMp3Blob: ', blob);

            this.sendRequestToWit(null, _.bind(this.parseResponse, this), blob);
        }, this));
        //this.recorder.getBuffer(_.bind(this.getBufferCb, this));

        this.recorder.clear();
    },

    ptrRefresh: function() {
        dialog.showAlert('event has been triggered');

        // Hide loading animation (spinner).
        this.hidePtrSpinner();
    },

    loadData: function() {
        // custom data loading method.
    },

    parseResponse: function(response) {
        var msgId = response.msg_id;
        var text = response._text;
        var entities = response.entities;
        var intent = entities && entities.intent && entities.intent[0].value;
        var moduleName = entities && entities.module && entities.module[0].value;
        var value = entities && entities.noun && entities.noun[0].value;

        console.log('response: ', response);
        console.log('text: ', text);
        console.log('intent: ', intent);
        console.log('moduleName: ', moduleName);
        console.log('value: ', value);

        if (intent && moduleName && value) {
            switch(intent) {
                case 'create':
                    this._processCreate(intent, moduleName, value);
                    break;
                case 'find':
                    this._processFind(intent, moduleName, value);
                    break;
                case 'get directions':
                    this._processGetDirections(intent, moduleName, value);
                    break;
                case 'call':
                    this._processCall(intent, moduleName, value);
                    break;
            }
        } else {
            app.alert.show('mobilehack_error_recording', {
                messages: ['ERROR - Text was parsed as: Action: ' + intent + ' | Module: ' + moduleName + ' | Value: ' + value],
                closeable: true,
                autoClose: true,
                level: 'error'
            });
        }
    },



    _processCreate: function(intent, moduleName, value) {
        debugger;
        var beanModuleName = this._moduleMap[moduleName];
        var bean = app.data.createBean(beanModuleName, {
            name: value,
            assigned_user_id: app.user.get('id'),
            assigned_user_name: app.user.get('full_name')
        });

        app.alert.show('mobilehack_save_start', {
            messages: ['Saving ' + beanModuleName + ' record: ' + value],
            closeable: true,
            autoClose: true,
            level: 'info'
        });

        app.api.records('create', beanModuleName, bean.toJSON(), null, {
            success: _.bind(this._onCreateSuccess, this)
        });
    },

    _onCreateSuccess: function(record) {
        app.alert.dismiss('mobilehack_save_start');

        app.alert.show('mobilehack_save_success', {
            messages: ['Saved ' + record._module + ' record: ' + record.name],
            closeable: true,
            autoClose: true,
            level: 'success'
        });
        app.controller.navigate('#' + record._module + '/' + record.id)
    },

    _processFind: function(intent, moduleName, value) {
        var beanModuleName = this._moduleMap[moduleName];

        app.alert.show('mobilehack_fetch_start', {
            messages: ['Getting ' + beanModuleName + ' record: ' + value],
            closeable: true,
            autoClose: true,
            level: 'success'
        });

        app.api.records('read', beanModuleName, {
            filters: [
                {
                    name: {
                        $starts: value
                    }
                }
            ]
        }, {
            skipOfflineRead: false
        }, {
            success: _.bind(this._onFetchSuccess, this)
        });
    },

    _onFetchSuccess: function(data) {
        var record;
        app.alert.dismiss('mobilehack_fetch_start');
        if (data.records.length) {
            record = data.records[0];
            if (data.records.length === 1) {
                app.alert.show('mobilehack_fetch_success', {
                    messages: ['Success! Found ' + record._module + ' record: ' + record.name],
                    closeable: true,
                    autoClose: true,
                    level: 'success'
                });
            } else {
                app.alert.show('mobilehack_fetch_success2', {
                    messages: ['Success! Found ' + data.records.length + ' records matching --' +
                        ' figure out how to handle that!!!!!'],
                    closeable: true,
                    autoClose: true,
                    level: 'success'
                });
            }

            app.controller.navigate('#' + record._module + '/' + record.id)
        }
    },

    _processGetDirections: function(intent, moduleName, value) {

    },

    _processCall: function(intent, moduleName, value) {

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

var mobileHackUtils = _.bind(function() {
    var _entitiesList = [
        'create',
        'find',
        'get directions',
        'call'
    ];



    var testResponse = {
        "msg_id" : "c41c3ba1-7979-4ae5-9a28-15739090c067",
        "_text" : "create account salesforcesucks",
        "entities" : {
            "intent" : [ {
                "confidence" : 1,
                "type" : "value",
                "value" : "create"
            } ],
            "module" : [ {
                "confidence" : 0.824023863512044,
                "type" : "value",
                "value" : "account"
            } ],
            "noun" : [ {
                "confidence" : 0.8923294686073935,
                "type" : "value",
                "value" : "salesforcesucks",
                "suggested" : true
            } ]
        }
    };

    return {
        setEntitiesList: function(entities) {
            _entitiesList = entities;
        },

        getEntitiesList: function() {
            return _entitiesList;
        },

        parseResponse: function(response) {
            var msgId = response.msg_id;
            var text = response._text;
            var entities = response.entities;
            var intent = entities && entities.intent && entities.intent[0].value;
            var moduleName = entities && entities.module && entities.module[0].value;
            var value = entities && entities.noun && entities.noun[0].value;

            console.log('intent: ', intent);
            console.log('moduleName: ', moduleName);
            console.log('value: ', value);

            if (intent && moduleName && value) {
                switch(intent) {
                    case 'create':
                        this._processCreate(intent, moduleName, value);
                        break;
                    case 'find':
                        this._processFind(intent, moduleName, value);
                        break;
                    case 'get directions':
                        this._processGetDirections(intent, moduleName, value);
                        break;
                    case 'call':
                        this._processCall(intent, moduleName, value);
                        break;
                }
            }
        },

        _processCreate: function(intent, moduleName, value) {
            var beanModuleName = this._moduleMap[moduleName];
            var bean = app.data.createBean(beanModuleName, {
                name: value,
                assigned_user_id: app.user.get('id'),
                assigned_user_name: app.user.get('full_name')
            });

            app.alert.show('mobilehack_save_start', {
                messages: ['Saving ' + beanModuleName + ' record: ' + value],
                closeable: true,
                autoClose: true,
                level: 'info'
            });

            app.api.records('create', beanModuleName, bean.toJSON(), null, {
                success: _.bind(this._onCreateSuccess, this)
            });
        },

        _onCreateSuccess: function(record) {
            app.alert.dismiss('mobilehack_save_start');

            app.alert.show('mobilehack_save_success', {
                messages: ['Saved ' + record._module + ' record: ' + record.name],
                closeable: true,
                autoClose: true,
                level: 'success'
            });
            app.controller.navigate('#' + record._module + '/' + record.id)
        },



        _DEV_parseResponseTest: function(response) {
            response = response || testResponse;

            this.parseResponse(response);
        }
    };
}, this);


app.mobileHack = new mobileHackUtils();
