({
    onModelLoaded: function(cmp, event, helper) {
        helper.createNodes(cmp, event);
    },

    onPaletteItemDragStop: function(cmp, event, helper) {
        helper.createNode(cmp, event);
    },

    onDropOver: function(cmp, event, helper) {
        helper.setBroadcastDragEvent(event, true);
    },

    onDropOut: function(cmp, event, helper) {
        helper.setBroadcastDragEvent(event, false);
    }
});
