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
var deviceFeatures = require('%app.core%/device');
var ActivitystreamDashlet = require('%app.dashlets%/activities-view');

/*
 * Custom Activity stream view sample.
 * This allows users to click on location icon (if available) to open the location in maps.
 * Please take a look at custom-record-actions.js 'checkin' action for adding location data to a checkin activity.
 */

module.exports = customization.declareView({
    parent: ActivitystreamDashlet,
    register: {},   // overriding base ActivityStream dashlet
}, {
    events: function() {
        var events = this._super();
        _.extend(events, { 'click .location': 'onLocationClick' });

        return events;
    },

    onLocationClick: function(e) {
        var $el = $(e.target).closest('article');
        var module = $el.attr('module') || this.module;
        var id = $el.attr('data-id');
        var model = this.listView.collection.get(id, module);
        if (model) {
            var data = model.get('data');
            if (data && data.location) {
                deviceFeatures.openAddress({ location: data.location });
            }
        }
    },
});
