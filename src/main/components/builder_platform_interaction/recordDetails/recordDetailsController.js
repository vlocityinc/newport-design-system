/*eslint-disable*/
({
    handleLoad: function (cmp, event) {
        var record = event.getParam('recordUi').record;
        var fieldNames = Object.keys(record.fields);
        cmp.set('v.fieldNames', fieldNames);
    }
});
