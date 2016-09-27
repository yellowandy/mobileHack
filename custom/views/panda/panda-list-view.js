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

customization.registerListItemDataProvider({
    name: 'panda-list-item',

    // Shows how to customize list item data provider parent.
    // No need to specify "ListItem" explicitly because it's used by default. Just for a example.
    parent: 'list-item', // here we can also specify list item data provider by reference, eg. ListView.listItemDataProviders.ListItem
    prepareItemData: function(model) {
        var displayName = app.utils.capitalize(model.get('systemName')).replace(/_/g, ' ');
        return {      // list item template receives this data.
            first: displayName[0],
            rest: displayName.slice(1),
            itemId: this.buildId(model),
            isMenuVisible: true,
        };
    },

    // overriding data-id attribute value calculation.
    // Together with extractId method create a reference between collection model and list item element.
    buildId: function(model) {
        var id = this.parent.buildId.call(this, model); // calling parent method.

        return 'panda_' + id;
    },

    extractId: function(id) {
        return id.replace('panda_', '');
    },
});

module.exports = customization.declareView({
    parent: ListView,
}, {

    shouldFetchContext: false,  // context loading is disabled.

    initialize: function(options) {
        this._super(options);

        // customizing list view and list item template via options.
        this.listItemTpl = 'panda-list-item';

        // applying custom list item data helper defined above.
        this.listItemDataProvider = 'panda-list-item';
    },

    loadData: function() {
        var data = new Array(10);

        _.each(data, function(item, i) {
            data[i] = { id: i, systemName: 'panda_number_' + i };
        });

        this.collection.reset(data);

    },

    // override default behavior on pull to refresh.
    ptrRefresh: function() {
        this.loadData();

        // Hide loading animation (spinner).
        this.hidePtrSpinner();
    },

    onItemClick: function(model) {
        var detailViewRoute = 'Panda/KungFu/' + model.get('systemName');
        app.controller.navigate(detailViewRoute);
    },
});
