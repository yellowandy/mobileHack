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
var dialog = require('%app.core%/dialog');

// Registering list item data provider. It serves to prepare list item data for HBS template including model id
// and extract appropriate model id when list item id clicked.
customization.registerListItemDataProvider({
    name: 'todo-list-item', // provider name is referenced in list initialization below.
    prepareItemData: function(model) {

        // list item HBS template receives this data.
        return {
            itemId: this.buildId(model),        // used to find model by id on item click.
            completed: model.get('completed'),  // item complete state
            title: model.get('title'),          // item title
        };
    },

    // overriding data-id attribute value calculation.
    // Together with extractId method create a reference between collection model and list item element.
    buildId: function(model) {
        return 'todo_' + model.id;
    },

    // converts data-id attribute value to real id of related model.
    extractId: function(id) {
        return id.replace('todo_', '');
    },
});

module.exports = customization.declareView({
    parent: ListView,
}, {

    contextMenuDisabled: true,
    shouldFetchContext: false,

    // overriding list template to custom one to show total number of records.
    template: 'todo-list',

    // applying custom list item data helper defined above.
    listItemDataProvider: 'todo-list-item',

    // customizing list view and list item template via options.
    listItemTpl: 'todo-list-item',

    loadData: function() {
        app.alert.show('ajax_load', {           // need to handle loading messages manually because data is loading without data-manager class.
            level: 'load',
            closeable: false,
            messages: app.lang.get('LBL_LOADING'),
        });

        $.ajax({
            url: 'http://jsonplaceholder.typicode.com/todos',
            success: _.bind(function onAjaxSuccess(data) {

                this.collection.reset(data);    // putting load result into collection, this will trigger list rendering.

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

    // override default behavior on pull to refresh.
    ptrRefresh: function() {
        this.loadData();

        // Hide loading animation (spinner).
        this.hidePtrSpinner();
    },

    // override default behavior to display alert instead of navigation
    onItemClick: function(model) {
        var message = model.get('title') + ' is' + (model.get('completed') ? '' : ' not') + ' completed';
        dialog.showAlert(message);
    },
});
