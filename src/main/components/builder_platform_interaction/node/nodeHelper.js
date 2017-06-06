/*
 * Copyright 2017 salesforce.com, inc.
 * All Rights Reserved
 * Company Confidential
 */

({
    //Adding class based on shape of node
    addClassBasedOnShape: function(cmp) {
        var shape;
        if (!$A.util.isUndefinedOrNull(cmp)) {
            shape = cmp.get("v.shape");
            $A.util.addClass(cmp, shape);
        }
    },

    //Position node inside the canvas
    positionNode: function(cmp) {
        var data, el;
        if (!$A.util.isUndefinedOrNull(cmp)) {
            data = cmp.get("v.data");
            el = cmp.getElement();
            el.style.left = data.properties.locationX + 'px';
            el.style.top = data.properties.locationY + 'px';
        }
    },

    //Select a node and open property editor
    selectNode: function(cmp) {
        var id;
        if (!$A.util.isUndefinedOrNull(cmp)) {
            if ($A.util.hasClass(cmp, "dragging")) {
                this.toggleClass(cmp, "dragging");
            } else {
                id = cmp.get("v.data")["id"];
                $A.getEvt("markup://flexipageEditor:selectNode").setParams({
                    id: id
                }).fire();
            }
        }
    },

    //Helper method to toggle class on component
    toggleClass: function(cmp, cssClass) {
        if (!$A.util.isUndefinedOrNull(cmp)) {
            $A.util.toggleClass(cmp, cssClass);
        }
     }
})