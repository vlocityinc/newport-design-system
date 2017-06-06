/*
 * Copyright 2017 salesforce.com, inc.
 * All Rights Reserved
 * Company Confidential
 */

({
    onInit: function(cmp, event, helper) {
    },

    onNodeClick: function(cmp, event, helper) {
        helper.selectNode(cmp);
    },

    onDragStartNode: function(cmp, event, helper) {
        helper.toggleClass(cmp, "dragging");
    }
})