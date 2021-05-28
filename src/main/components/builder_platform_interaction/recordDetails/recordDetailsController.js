/*eslint-disable*/
({
    handleLoad: function (cmp, event) {
        var record = event.getParam('recordUi').record;
        var fieldNames = Object.keys(record.fields);
        cmp.set('v.fieldNames', fieldNames);
        cmp.set('v.fields', record.fields);
    },

    handleChange: function (cmp, event, helper) {
        var fieldName = event.getSource().attributes.fieldName.$lastResult$;
        var fieldNewValue = event.getParam('value');
        helper.udpateRecordUpdates(cmp, fieldName, fieldNewValue);
    }
});
