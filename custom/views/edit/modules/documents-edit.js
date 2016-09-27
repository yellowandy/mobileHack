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

/*
 * Injects signature field on Documents edit view
 */
var app = SUGAR.App;
var customization = require('%app.core%/customization.js');
var EditView = require('%app.views.edit%/edit-view.js');
var base64SimpleImg = 'data:image/png;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
var signatureFieldName = 'signature';
var signatureMeta = {
    label: 'Signature',
    name: signatureFieldName,
    type: signatureFieldName,
};

customization.registerRecordAction({
    name: 'sign_and_save',
    modules: ['Documents'],
    types: ['edit-menu'],
    label: 'Sign and Save',
    stateHandlers: {
        isVisible: function isVisible(view, model) {
            // Check if action is available here
            // if no custom logic is required then isVisible may be omitted. As well as stateHandlers property.
            return true;
        },
    },

    handler: function(view, model) {
        // Put your custom action handler here
        var signatureValue = model.get(signatureFieldName);

        if (!signatureValue) {
            model.set(signatureFieldName, base64SimpleImg);
        }

        view.save();
    },

    rank: 0,
});

var DocumentEditView = customization.declareView({
    //Register this view as EditView for Documents module
    parent: EditView,
    register: { module: 'Documents' },
}, {

    initialize: function initialize(options) {
        this._super(options);
        var signatureField = _.findWhere(this.options.meta.panels[0].fields, { name: signatureFieldName });

        // Inject signature field only if it's not presented on view yet
        if (!signatureField) {
            this.displayFields.unshift(signatureMeta);
        }
    },
});

module.exports = DocumentEditView;
