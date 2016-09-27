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
 * This is an example of adding custom validation to model 'save' routine.
 */

var app = SUGAR.App;
var customization = require('%app.core%/customization.js');
var CurrencyField = require('%app.fields%/currency/currency.js');

function _validate(fields, errors, callback) {
    //Each validation task is called once during bean save.
    //'fields' is hash of fields being saved.
    //'errors' is hash of validation errors. If validation fails validator should push error object to 'errors' hash
    //to let validation routine know that validation failed for specific field.
    //Validation is async and 'callback' must be called when it completes (either successfully or with error).
    if (_.has(fields, this.name)) {
        var currentValue = this.model.get(this.name);
        if (!this._isValidViaSomeCondition(currentValue)) {
            //Example of populating error hash with custom error. field name should be used as key
            errors[this.name] = { 'Custom Validation Failed': true };
        }
    }

    callback(null, fields, errors);
}

//By registering field named as 'MobileRevenueLineItemsCurrency' we are using sidecar naming convention.
//Using it Sidecar will automatically create instance of this field when inside RevenueLineItems module
var RliCurrencyField = customization.declareField({
    parent: CurrencyField,
    register: { module: 'RevenueLineItems' },
}, {
    initialize: function(options) {
        this._super(options);

        if (this.name === 'discount_amount') {
            //Bean's addValidationTask is the way to add custom validators to a model.
            //First parameter is validation task name (should be unique), second is validator function
            //Validation task will be called when bean is saved
            this.model.addValidationTask('CustomCurrencyValidation' + this.name, _validate.bind(this));
        }
    },

    handleValidationError: function(error) {
        //This function will be called if validation fails. Put your error handling code here.
        //Default implementation will put error key to html underneath the field ('Custom Validation Failed' in this case)
        this._super(error);
    },

    _isValidViaSomeCondition: function(value) {
        //Put your custom validation code here
        return false;
    },
});

module.exports = RliCurrencyField;
