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
var customMeta = require('./modules-meta.json');

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
app.baseMetadata.modules_info = app.baseMetadata.modules_info || {};
_.extend(app.baseMetadata.modules, customMeta.modules);
_.extend(app.baseMetadata.modules_info, customMeta.modules_info);

// jscs:enable requireCamelCaseOrUpperCaseIdentifiers

app.events.once('app:sync:complete', function() {
    var listModules = app.user.get('module_list');
    listModules.push.apply(listModules, _.keys(customMeta.modules));    // required to show custom modules in main menu.
});
