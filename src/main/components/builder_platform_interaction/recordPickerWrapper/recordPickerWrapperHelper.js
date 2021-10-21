({
    handleSelected: function (cmp, selectedRecordId) {
        var selectedCallback = cmp.get('v.recordSelectedCallback');
        if (selectedCallback && typeof selectedCallback === 'function') {
            selectedCallback(selectedRecordId);
        }
    }
});
