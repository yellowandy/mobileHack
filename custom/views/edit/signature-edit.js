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
 * Signature field edit class
 */

var app = SUGAR.App;
var customization = require('%app.core%/customization');
var SignaturePad = require('../../libs/signature_pad');
var SIGNATURE_ATTR_NAME = 'signature';

module.exports = customization.declareView(null, {
    template: 'signature-edit',
    events: {
        'click .clear-canvas': 'onClear',
    },

    onAfterRender: function onAfterRender() {
        this._super();
        var canvasEl = this.$('.signature-canvas').get(0);
        var $container = this.$('.pad');
        var signatureDataUrl = this.model.get(SIGNATURE_ATTR_NAME);

        canvasEl.width = $container.width();
        canvasEl.height = $container.height();

        this.signaturePad = new SignaturePad(canvasEl);

        if (signatureDataUrl) {
            this.signaturePad.fromDataURL(signatureDataUrl);
        }
    },

    save: function save() {
        var signatureDataURL = this.signaturePad.isEmpty() ? '' : this.signaturePad.toDataURL();
        this.model.set(SIGNATURE_ATTR_NAME, signatureDataURL);

        app.controller.goBack();
    },

    onHeaderSaveClick: function() {
        this.save();
    },

    onClear: function onClear() {
        this.signaturePad.clear();
    },

    onDetach: function onDetach() {
        if (this.signaturePad) {
            this.signaturePad.clear();
            this.signaturePad.off();
        }

        this._super();
    },
});
