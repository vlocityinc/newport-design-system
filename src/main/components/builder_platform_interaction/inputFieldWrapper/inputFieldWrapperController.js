/*eslint-disable*/
({
    handleChange: function (cmp, event) {
        var fieldName = cmp.get('v.fieldName');
        var fieldNewValue = event.getParam('value');
        // build event and fire
        var fieldChange = cmp.getEvent('fieldChangeEvent');
        fieldChange.setParams({ fieldName: fieldName, fieldValue: fieldNewValue });
        fieldChange.fire();
    }
});
