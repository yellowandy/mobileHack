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
var nomad = require('%app.core%/nomad');
var dialog = require('%app.core%/dialog');

var editActions = [
    {
        name: 'magic-action',
        types: ['right-menu-detail'],
        label: 'Magic Action',
        iconKey: 'actions.magic',
        stateHandlers: {
            isVisible: function(view, model) {
                // Check if action is available here
                // if no custom logic is required then isVisible may be omitted. As well as stateHandlers property.
                return true;
            },
        },

        handler: function(view, model) {
            dialog.showAlert('Thanks for click me! Magic is about to happen...');
        },

        rank: 21,
    },
    {
        // Will override default create action on Meetings right menu list

        // Name of the action to override
        name: 'create',

        // `types` is required property
        types: ['right-menu-list'],

        // Specify modules where default create action will be overridden
        modules: ['Meetings'],

        // Custom handler
        handler: function(view, model) {
            dialog.showAlert('Creating Meeting record...');
            var route = Handlebars.helpers.buildRoute(model,
                {
                    hash: {
                        appendRoot: true,
                        action: 'create',
                    },
                });

            app.controller.navigate(route);
        },
    },
];

// Register custom right menu actions
_.each(editActions, customization.registerRecordAction);
