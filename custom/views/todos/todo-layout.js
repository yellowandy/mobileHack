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
var TodoListView = require('../todos/todo-list-view');

// External source list layout
module.exports = customization.declareLayout({
    views: [TodoListView],
    header: {
        enabled: true,
        title: app.lang.get('TODO List'),
    },
});
