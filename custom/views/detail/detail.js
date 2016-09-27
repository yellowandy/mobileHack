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

/*
 * Detail view controller customization sample.
 * Changes standard detail view header title.
 * See {@link #getHeaderConfig} for clarifications
 */
var app = SUGAR.App;
var customization = require('%app.core%/customization.js');
var DetailView = require('%app.views.detail%/detail-view.js');

var AccountsDetailView = customization.declareView({
    parent: DetailView,
    register: { module: 'Accounts' },   //Register this detail view only for Accounts module
}, {
    getHeaderConfig: function getHeaderConfig() {
        var config = this._super();
        var recordName = this.model.get(this.headerField.name);

        if (recordName) {
            config.title += ' - ' + recordName;
        }

        return config;
    },
});

module.exports = AccountsDetailView;
