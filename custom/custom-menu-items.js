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
var dialog = require('%app.core%/dialog');

var customMenuItems = [
    {
        label: 'Static Panda',
        route: 'StaticPanda',  // results in app.controller.navigate('#StaticPanda'); when item is clicked.
        rank: 11,
    },
    {
        label: 'KungFu Panda',
        iconKey: 'modules.Dashboard',
        handler: function() {
            // Put your custom logic here

            var options = {
                title: '',
                buttonLabels: [app.lang.get('LBL_CANCEL_BUTTON_LABEL'), app.lang.get('LBL_ENABLE')],
                defaultText: app.lang.get('LBL_LOGIN_PASSWORD'),
                inputStyle: 3,
                callback: function(result) {
                    if (result.buttonIndex === 2) {
                        var route = result.input1 ? 'PandaProfile/' + result.input1 : 'Panda/KungFu';
                        app.controller.navigate(route);
                    }
                },
            };

            dialog.showPrompt('Enter panda name to see panda profile or leave empty to see panda list', options);
        },

        isVisible: function() {
            // 'Random Panda' menu item is visible only for admins
            return app.user.get('type') === 'admin';
        },

        rank: 0,
    },
    {
        label: 'Tabbed Panda',
        route: 'Panda/TabbedPanda', // "#Panda/TabbedPanda" route is opened when menu item is clicked.
        rank: 1,
    },
    {
        label: 'My TODO list',
        route: 'todos', // "#todos" route is opened when menu item is clicked.
        rank: 2,
    },
    {
        label: 'Faux Siri',
        route: 'ptr-custom',  // "#ptr-custom" route is opened when menu item is clicked.
        rank: 3,
    },
];

_.each(customMenuItems, customization.registerMainMenuItem);
