({
    onInit: function (cmp) {
        // convert values in to something usable by forceSearch:inputLookupDesktop
        // v.values is an lwc proxy
        var values = cmp.get('v.values').map(function (v) {
            return {
                id: v.id
            };
        });

        cmp.set('v.priv_convertedValues', values);
    },

    handleSelected: function (cmp, event, helper) {
        helper.handleSelected(cmp, event.getSource().get('v.value'));
    }
});
