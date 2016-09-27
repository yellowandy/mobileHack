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

module.exports = customization.declareView(null, {
    //In this case we are declaring template using by directly using template function (retrieved via app.template.get)
    //We would get the same result if we declared template as "template: 'panda-view'"
    template: app.template.get('panda-view'),
    shouldFetchContext: false,

    initialize: function(options) {

        // code below demonstrates how parameters can be passed in view constructor. Usually just one method is used.

        // when view is created like "new View(optionsObject)" or via view-manager then passed parameters available as first argument of constructor (initialize).
        var optionsName = options.pandaName;

        // if parameters are passed via location.hash they are available via controller.getScreenContext method. Parameters processing is performed in route.getScreenOptions.
        var context = app.controller.getScreenContext();
        var contextName = context.isPandaProfileRoute ? context.profileName : context.pandaName;

        // default name if not specified externally.
        var defaultName = 'Noname Panda';

        // parameter used by HBS template.
        this.pandaName = optionsName || contextName || defaultName;

        this._super(options);
    },

    loadData: function() {
        // custom data loading method.
        app.alert.show('panda_loading', {
            messages: ['Panda is loading data'],
            closeable: true,
            autoClose: true,
            level: 'info',
        });
    },
});
