({
    afterRender: function(cmp, helper) {
        this.superAfterRender();
        var keyboardInteractions = cmp.get('v.keyboardInteractions');
        keyboardInteractions.addKeyDownEventListener(document.querySelector('.uiContainerManager'));
    },
    unrender: function() {
        this.superUnrender();
        var keyboardInteractions = cmp.get('v.keyboardInteractions');
        keyboardInteractions.removeKeyDownEventListener(document.querySelector('.uiContainerManager'));
    }
});
