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

//In this example we want to render our own 'statistics' dashlet instead of default 'rssfeed' dashlet
var dashlet = customization.declareDashlet({
    title: 'My Statistics',
    iconKey: 'dashlets.tabbed-dashlet.planned-activities',
}, {
    template: 'statistics-dashlet',
    initialize: function(options) {
        this._statisticsId = '128sadjk9';
        this._super(options);
    },
});

customization.registerComponent(dashlet, { type: 'statistics' });
