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
var ListView = require('%app.views%/list/list-view');
var ListLayout = require('%app.layouts%/list-layout.js');

var MyDayView = customization.declareView({
    parent: ListView,
    register: { module: 'Meetings' },
}, {
    template: 'meetings-list',

    initialize: function(options) {
        this._super(options);

        // adding custom filter to collection
        this.collection.filterDef = {
            date_modified: {    // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
                $dateRange: 'last_7_days',
            },
        };
    },
});

// To customize list layout for Meetings module we need to specify layout type=list and module=Meetings.
module.exports = customization.declareLayout({
    views: [MyDayView],
    parent: ListLayout, // overriding list-layout,
    header: {
        title: app.lang.get('My Day'),
    },
    register: { module: 'Meetings' },
}, {

    isFilterEnabled: false, // hiding filter
    isSearchEnabled: false, // hiding search
});
