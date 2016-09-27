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
var PandaView = require('./panda-view');
var PandaListView = require('./panda-list-view');
var TabbedPandaView = require('./tabbed-panda-view');
var customization = require('%app.core%/customization');
var dialog = require('%app.core%/dialog');

//Unless you know what you're doing, registration of a new layout should always go through customization module dedicated function
var PandaDetailLayout = customization.declareLayout({
        //Header configuration is self-explanatory
        header: {
            enabled: true,
            title: app.lang.get('Panda Details'),
            buttons: {
                mainMenu: true,
                save: true,
                cancel: true,
            },
        },

        //Views that are contained in this layout. There can be any number of views.
        views: [PandaView],
    }, {
        //We can extend NomadLayout methods like so (only @protected and @public method should be extended):
        onHeaderSaveClick: function() {
            dialog.showAlert('Custom Save button handler');
            this._super();
        },
    });

//For this example we declare second layout. We use shorter declaration this time
var PandaListLayout = customization.declareLayout({
    views: [PandaListView],
    header: {
        enabled: true,
        title: app.lang.get('Panda List'),
        buttons: {
            mainMenu: true,
            rightMenu: false,
        },
    },
});

// Sample layout for tab container view.
var PandaTabsLayout = customization.declareLayout({
    views: [TabbedPandaView],
    header: {
        enabled: true,
        title: app.lang.get('Panda Tabs Example'),
        buttons: {
            mainMenu: true,
        },
    },
});

module.exports = {
    PandaListLayout: PandaListLayout,
    PandaDetailLayout: PandaDetailLayout,
    PandaTabsLayout: PandaTabsLayout,
};
