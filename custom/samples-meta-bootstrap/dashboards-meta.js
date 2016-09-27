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

//===================================================
// HACK: FOR SAMPLE CODE ONLY.
// This way of overriding metadata IS NOT SUPPORTED by SDK.
// All metadata must come from the server side.
//===================================================

var app = SUGAR.App;
var dashboards = require('%app.core%/dashboards.js');
var processFetchResults = dashboards._processFetchResults;

// injects sample dashboards into Nomad.
dashboards._processFetchResults = function(data) {
    var sampleDashboards = app.utils.deepCopy(require('./dashboards-meta.json'));
    data.push.apply(data, sampleDashboards);
    processFetchResults.apply(dashboards, arguments);
};
