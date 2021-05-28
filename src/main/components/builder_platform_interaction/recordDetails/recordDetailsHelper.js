/*eslint-disable*/
({
    /**
     * Called when user update the record
     * Collect all field changes. Deleted fields will be specified as null
     * @param {Aura} cmp, the recordDetails component
     * @param {String} fieldName, field name of update i.e. BillingCountry
     * @param {String} fieldNewValue, new value of the field
     */
    udpateRecordUpdates: function (cmp, fieldName, fieldNewValue) {
        var fieldUpdates = cmp.get('v.fieldUpdates');

        var fieldOldValue = cmp.get('v.fields')[fieldName].value;
        if (!fieldNewValue || fieldNewValue.trim() === '') {
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
