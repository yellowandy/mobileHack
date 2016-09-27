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
var ListLayout = require('%app.layouts%/list-layout.js');
var OpportunitiesListView = require('./opportunities-list-view');
var customization = require('%app.core%/customization');

module.exports = customization.declareLayout({
    views: [OpportunitiesListView],
    parent: ListLayout, // overriding list-layout,
    header: {
        title: app.lang.get('My Opportunities'),
    },
    register: {
        module: 'Opportunities',
    },
}, {

    isSearchEnabled: false, // hiding search
});

