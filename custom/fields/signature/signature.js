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
 * Custom signature field sample
 * It allows to create digital signature for documents
 */

var app = SUGAR.App;
var customization = require('%app.core%/customization.js');
var SignatureEditView = require('../../views/edit/signature-edit');

//Let's define layout we want to show to edit signature
var SignatureEditLayout = customization.declareLayout({
    header: {
        title: 'Sign Document',
        buttons: {
            save: { label: 'Sign' },
            cancel: { label: 'Revoke' },
        },
    },

    //This layout will contain 2 views, header that will be created automatically using header config provided above
    //and SignatureEditView that is defined in another file that we've required above
    views: [SignatureEditView],
}, {
    //CSS class name we want applied to layout <div>
    className: 'signature-edit',
});

//Here we define 'Signature' field that is derived from TextField (which is basically the base field)
var SignatureField = customization.declareField({
    register: { type: 'signature' },
}, {
    //DOM-events handlers registration
    events: {
        click: 'onTap',
    },

    onTap: function onTap(e) {
        e.stopPropagation();
        e.preventDefault();

        //In this example we pass 'model' instance. It is also possible to pass collection in the same way when needed.
        //In more advanced case 'context' object can be passed. It is Backbone.model instance that may contain any data/callbacks
        //that will be available in create layout via 'this.context' reference
        app.controller.loadDynamic({
            layout: SignatureEditLayout,
            model: this.model,
        });
    },
});

module.exports = SignatureField;
