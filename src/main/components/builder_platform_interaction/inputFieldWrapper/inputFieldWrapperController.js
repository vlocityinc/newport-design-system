/*eslint-disable*/
({
    handleChange: function (cmp, event) {
        var fieldName = cmp.get('v.fieldName');
        var params = event.getParams();
        var fieldNewValue = params.hasOwnProperty('checked') ? event.getParam('checked') : event.getParam('value');
        // build event and fire
        var fieldChange = cmp.getEvent('fieldChangeEvent');
        fieldChange.setParams({ fieldName: fieldName, fieldValue: fieldNewValue });
        fieldChange.fire();
    }
});
