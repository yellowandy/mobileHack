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
var ListLayout = require('%app.layouts%/list-layout');
var ListView = require('%app.views%/list/list-view');
var deviceFeatures = require('%app.core%/device');

var sampleListData = _.map([
    ['SugarCRM', 'https://www.sugarcrm.com'],
    ['StackOverflow', 'http://stackoverflow.com'],
    ['Javascript', 'https://www.codecademy.com/learn/javascript'],
], function(item, index) {
    return {
        id: index + 1,
        name: item[0],
        url: item[1],
    };
});

customization.declareView({
    parent: ListView,
    register: { type: 'cool-bookmarks-list' },    // type as defined in metadata.
}, {
    // we're using hard coded data for collection loading and we need to avoid request to a server.
    shouldFetchContext: false,

    // overriding base method to open url on list item click.
    onItemClick: function(model) {
        deviceFeatures.openUrl(model.get('url'));
    },

    loadData: function() {
        this.collection.reset(sampleListData);
    },
});

// External source list layout
customization.declareLayout({
    header: {
        buttons: {  // specifying header config to hide 'rightMenu' button.
            mainMenu: true,
            rightMenu: false,
        },
    },
    parent: ListLayout,
    register: {
        // Type is not specified because it is calculated based on parent class ListView.
        // Module is specified because we need to override list layout only for that module
        module: 'Bookmarks',
    },
}, {
    // search and filters are not supported by our custom Bookmarks list.
    isSearchEnabled: false,
    isFilterEnabled: false,
});
