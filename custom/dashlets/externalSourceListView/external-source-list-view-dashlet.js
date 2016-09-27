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
    parent: ListContainerDashletView,
    iconKey: 'dashlets.dashablelist',
}, {
    // overriding the method to add our custom configuration to child list view.
    initViews: function(views, options) {
        // changing child list view template to our own.
        options.listParams = {
            template: 'external-source-list-view-dashlet',
        };

        this._super(views, options);
    },

    // custom implementation uses external source to fetch data and fills list view collection with result.
    loadViewData: function(view) {
        app.alert.show('ajax_load', {   // need to handle loading messages manually because data is loading bypassing data-manager class.
            level: 'load',
            closeable: false,
            messages: app.lang.get('LBL_LOADING'),
        });

        $.ajax({
            url: 'http://jsonplaceholder.typicode.com/todos',
            success: _.bind(function onAjaxSuccess(data) {

                view.collection.reset(data);    // putting load result into collection, this will trigger list rendering.

                app.alert.show('ajax_load_success', {
                    level: 'success',
                    autoClose: true,
                    messages: 'Data is loaded.',
                });
            }, this),

            error: function onAjaxError() {
                app.alert.show('ajax_load_error', {
                    level: 'error',
                    autoClose: true,
                    messages: 'Error loading data.',
                });
            },

            complete: function onAjaxComplete() {
                app.alert.dismiss('ajax_load'); // once fetching is finished need to hide loading message.
            },
        });
    },
});

customization.registerComponent(dashlet, { type: 'external-source-list' });
