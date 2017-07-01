/*
 * Copyright 2017 salesforce.com, inc.
 * All Rights Reserved
 * Company Confidential
 */

({
    onInit : function(cmp, event, helper) {
        cmp.set("v.defaultItem", {
            'assignmentItem' : {
                'assignToReference' : null,
                'operator' : null,
                'value' : null
            },
            'isValid' : false
        });
    },

    onItemsChanged : function(cmp, event, helper) {
        var items = cmp.get('v.items');
        if (items.length < cmp.get("v.minLength")) {
            items.push(helper.createRow(cmp));
            cmp.set("v.items", items);
        }
    }
})