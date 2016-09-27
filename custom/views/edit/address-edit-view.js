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
var customization = require('%app.core%/customization.js');
var geolocation = require('%app.core%/geolocation');
var dialog = require('%app.core%/dialog');
var BaseAddressEditView = require('%app.views%/edit/address-edit-view');

/*
 * Custom address edit view class.
 * This adds an additional [Get Location] button in address edit view to make use of GeoLocation APIs to fetch device current address.
 */
var CustomAddressEditView = customization.declareView({
    parent: BaseAddressEditView,
    register: {}, // overriding base address edit view.
}, {

    events: { 'click .field__geoplacemark': 'onGetGeoPlacemarkClick', },

    initialize: function(options) {
        this._super(options);
        this.enableGeoPlacemark = app.isNative;
    },

    onGetGeoPlacemarkClick: function() {
        var self = this;

        // Error handler for getCurrentPosition and getGeoPlacemarks
        var errorCb = function(errCode, errMessage) {
            dialog.showAlert(errMessage);
        };

        var successPlacemarksCallback = function(placemarks) {
            if (placemarks.length > 0) {
                var placemark = placemarks[0] || {};

                var street = (_.isEmpty(placemark.subThoroughfare) ? '' : placemark.subThoroughfare + ' ') + (placemark.thoroughfare || '');
                self._setModelData('street', street);
                self._setModelData('city', placemark.locality || '');
                self._setModelData('postalcode', placemark.postalCode || '');
                self._setModelData('state', placemark.adminArea || '');
                self._setModelData('country', placemark.countryCode || placemark.country || '');
            }
        };

        var successCurrentLocation = function(position) {
            app.logger.debug('Latitude : ' + position.coords.latitude  + ', longitude: ' + position.coords.longitude);
            var pos = { latitude: position.coords.latitude, longitude: position.coords.longitude };
            geolocation.getGeoPlacemarks(pos, { successCb: successPlacemarksCallback, errorCb: errorCb, displayAddressChooser: true });
        };

        geolocation.getCurrentPosition({ successCb: successCurrentLocation, errorCb: errorCb, enableHighAccuracy: true });
    },

    // Sets the model data if we match search key. eg, if the model has 'Office_street'/'HomeAddress_street' field, this will set it with street value.
    _setModelData: function(searchKey, value) {
        var key = _.find(this.addressFieldsNames, function(item) { return item.match(new RegExp(searchKey, 'i')); });

        if (key) {
            this.model.set(key, value);
        }
    },

});

module.exports = CustomAddressEditView;
