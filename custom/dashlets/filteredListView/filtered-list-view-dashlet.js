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
var ListContainerDashletView = require('%app.dashlets%/list-container-dashlet-view');

var dashlet = customization.declareDashlet({
    title: 'Filtered ListView',
    parent: ListContainerDashletView,
    iconKey: 'dashlets.dashablelist',
},
{
    initViews: function(views, options) {    // overriding initViews method to add own filter to options object.
        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers

        options.listParams = {  // listParam property holds configuration of child list view including filter.
            filter: {
                date_modified: {
                    $dateRange: 'last_7_days',
                },
            },
        };

        // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

        this._super(views, options);
    },
});

customization.registerComponent(dashlet, { type: 'filtered-dashable-list' });
