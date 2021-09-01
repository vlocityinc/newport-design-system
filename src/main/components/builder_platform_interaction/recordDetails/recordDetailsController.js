/*eslint-disable*/
({
    handleLoad: function (cmp, event) {
        var record = event.getParam('recordUi').record;
        var fieldNames = Object.keys(record.fields);
        cmp.set('v.fieldNames', fieldNames);
        cmp.set('v.fields', record.fields);
    },

    /**
     * Called when user update the record
     * Collect a field changes. Deleted fields will be specified as null
     * @param {Aura} cmp, the inputFieldWrapper component
     * @param {String} fieldName, field name of update i.e. BillingCountry
     * @param {String} fieldNewValue, new value of the field
     */
    updateRecordUpdates: function (cmp, event) {
        var fieldName = event.getParam('fieldName');
        var fieldNewValue = event.getParam('fieldValue');

        var fieldUpdates = cmp.get('v.fieldUpdates') || {};

        var fieldOldValue = cmp.get('v.fields')[fieldName].value;
        // if null/undefined/emptystring we want to set null
        // else if empty object or array set to null
        if (!fieldNewValue || (typeof fieldNewValue === 'string' && fieldNewValue.trim() === '')) {
            fieldNewValue = null;
        } else if (typeof fieldNewValue === 'object' && Object.keys(fieldNewValue).length == 0) {
            fieldNewValue = null;
        }

        if (fieldOldValue != fieldNewValue) {
            fieldUpdates[fieldName] = fieldNewValue;
        } else {
            delete fieldUpdates[fieldName];
        }

        cmp.set('v.fieldUpdates', fieldUpdates);
    }
});
