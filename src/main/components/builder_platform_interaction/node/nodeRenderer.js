/*
 * Copyright 2017 salesforce.com, inc.
 * All Rights Reserved
 * Company Confidential
 */

({
    afterRender: function(cmp, helper) {
        this.superAfterRender();
        helper.addClassBasedOnShape(cmp);
        helper.positionNode(cmp);
    }
})