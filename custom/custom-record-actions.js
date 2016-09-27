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
var nomad = require('%app.core%/nomad');
var dialog = require('%app.core%/dialog');
var deviceFeatures = require('%app.core%/device');
var geolocation = require('%app.core%/geolocation');

var customActions = [
    {
        modules: ['Contacts', 'Leads'],
        name: 'skype',
        types: ['context-menu', 'toolbar'],
        label: 'Skype',
        iconKey: 'actions.skype', // Needs to be defined in config.json
        stateHandlers: {
            isVisible: function isVisible(view, model) {
                // Only available on native app
                return app.isNative;
            },

            isEnabled: function(view, model) {
                return !_.isEmpty(model.get('phone_work'));
            },
        },

        handler: function(view, model) {

            // Opens the deeplink to make selected skype call
            function makeSkypeCall(skypeId) {
                skypeId = skypeId.replace(/-|\s/g, '');
                deviceFeatures.openUrl('skype://' + skypeId + '?call', true);
            }

            // Gets phone number fields from the model
            var phoneFieldDef = [
                {
                    label: 'Home Phone',
                    field: 'phone_home',
                },
                {
                    label: 'Mobile',
                    field: 'phone_mobile',
                },
                {
                    label: 'Office Phone',
                    field: 'phone_work',
                },
                {
                    label: 'Other Phone',
                    field: 'phone_other',
                },
            ];

            var phones = _.map(phoneFieldDef, function(item) {
                var data = model.get(item.field);
                if (!_.isEmpty(data)) {
                    var phone = {};
                    phone[item.label] = data;
                    return phone;
                }
            });

            // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
            var emails = _.map(model.get('email'), function(item) {
                if (!_.isEmpty(item.email_address)) {
                    return { Email: item.email_address };
                }
            });

            // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

            // Displays both phone numbers and emails to make skype call.
            var phonesAndEmails = _.compact(_.union(phones, emails));
            if (phonesAndEmails.length > 1) {
                var items = _.map(phonesAndEmails, function(item) {
                    return _.keys(item)[0] + ' - ' + _.values(item)[0];
                });

                dialog.showActionSheet(items, {
                    title: 'Please select to make Skype call',
                    onSelectCb: function(buttonText, buttonIndex) {
                        makeSkypeCall(_.values(phonesAndEmails[buttonIndex])[0]);
                    },
                });
            } else if (phonesAndEmails.length === 1) {
                makeSkypeCall(_.values(phonesAndEmails[0])[0]);
            }
        },

        rank: 0,
    },

    // Let's create global action by omitting module property
    {
        name: 'record-to-clipboard',
        types: ['context-menu', 'toolbar'],
        label: 'Copy to clipboard',
        iconKey: 'menu.duplicate',
        stateHandlers: {
            isVisible: function isVisible(view, model) {
                // Check if action is available here
                // if no custom logic is required then isVisible may be omitted. As well as stateHandlers property.
                return true;
            },
        },

        handler: function(view, model) {
            // Place action code here
            dialog.showAlert('Record name copied to clipboard...');
        },

        rank: 0,
    },

    // Check in with geolocation data.
    {
        name: 'checkin',
        types: ['toolbar'],
        modules: ['Accounts'],
        label: 'Checkin',
        iconKey: 'sorting.checked',

        handler: function(view, model) {

            var location;

            // Lets stick geolocation data to a new activity record.
            var addToActivityStream = function(placemark) {
                placemark = placemark || {};
                var postModel = app.data.createBean('Activities');
                var atLocation = _.compact([placemark.locality, placemark.adminArea]).join(', ');
                var checkInData = 'Checked in' + (!_.isEmpty(atLocation) ? (' near ' + atLocation) : '');

                postModel.set({
                    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
                    parent_id: model.id,
                    parent_type: model.module,

                    // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
                    data: {
                        value: checkInData,
                        type: 'checkin',
                        location: {
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }, },
                });

                postModel.save(null, {
                    fields: ['activity_type', 'data', 'parent_id', 'parent_type'],

                    params: {
                        skipOfflineRead: true,
                    },
                    success: function(model) {
                        // Do any additional setup after checkin activity is saved
                    },

                    error: function(err) {
                        // Add error handling.
                    },
                });
            };

            var successPlacemarksCallback = function(placemarks) {

                // Add activity record with the first placemark returned.
                addToActivityStream(placemarks[0]);
            };

            var placemarkErrorCb = function(errCode, errMessage) {
                // If we fail to get placemarks, lets add activity record with location (lat/long) data.
                addToActivityStream();
            };

            var successCurrentLocation = function(position) {
                app.logger.debug('Latitude : ' + position.coords.latitude  + ', longitude: ' + position.coords.longitude);

                location = { latitude: position.coords.latitude, longitude: position.coords.longitude };

                // Request for current placemarks for corresponding location.
                geolocation.getGeoPlacemarks(location, { successCb: successPlacemarksCallback, errorCb: placemarkErrorCb });
            };

            var errorCb = function(errCode, errMessage) {
                dialog.showAlert(errMessage);
            };

            // This requests for current location lat,long.
            geolocation.getCurrentPosition({ successCb: successCurrentLocation, errorCb: errorCb, enableHighAccuracy: true });

        },

        rank: 0,
    },
];

_.each(customActions, customization.registerRecordAction);

