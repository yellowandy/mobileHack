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
var ContainerView = require('%app.views%/container/container-view');
var PandaDetailView = require('./panda-view');
var customization = require('%app.core%/customization');

module.exports = customization.declareView({
    parent: ContainerView,
}, {
    // custom template for container-view should contain switcher and views container placeholders.
    template: 'tabbed-panda',

    // storage section name to store last active tab index and restore on view creation.
    activeTabStorageKey: 'tabbed_panda_store',

    // switching between views is performed via tabs switcher.
    viewSwitcher: ContainerView.switcherTypes.TABS,

    // context loading is disabled, loadData is handled by each view in its own.
    shouldFetchContext: false,

    // if views are not presented in options property while creating the view, then initViews is the right place add them.
    initViews: function(views, options) {

        // container view contains two views: panda details view and list view for Accounts module.
        views = [
            {
                name: PandaDetailView,
                title: app.lang.get('Panda Details'),
                pandaName: 'Tabbed Panda',
            },
            {
                type: 'list',
                title: app.lang.get('Accounts List'),
                context: app.context.getContext({
                    model: app.data.createBean('Accounts'),
                    collection: app.data.createBeanCollection('Accounts'),
                }),

                // loadDataFn is called to load view data when view is displayed/created (depending on container-view configuration).
                loadDataFn: function() {

                    // "this" points to Accounts list-view here.
                    this.loadData();
                },
            },
        ];

        this._super(views, options);
    },
});
