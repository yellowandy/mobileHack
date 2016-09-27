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

var dashlet = customization.declareDashlet({
    title: 'Record summary dashlet',
}, {
    template: app.template.get('record-summary-dashlet'),
    initialize: function(params) {
        this._super(params);
        this.createModel();
    },

    createModel: function() {
        var screenOptions = app.controller.getScreenContext();
        this.model = app.data.createBean(screenOptions.parentModule, {
            id: screenOptions.parentModelId,
        });
    },

    loadData: function() {
        this.model.fetch({ success: _.bind(this.render, this) });
    },
});

customization.registerComponent(dashlet, { type: 'recordsummarydashlet' });
