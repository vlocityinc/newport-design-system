/*
 * Copyright 2017 salesforce.com, inc.
 * All Rights Reserved
 * Company Confidential
 */

({
    //Create all the nodes in the canvas
    createNodes: function(cmp, event) {
        var model, nodes, child, cmpDef, attr, index;
        if (!$A.util.isUndefinedOrNull(cmp)) {
            nodes = [];
            cmpDef = "builder_platform_interaction:node";
            model = event.getParam("model");
            if (model) {
                for (index = 0; index < model.children.length; index = index + 1) {
                    attr = {};
                    child = model.children[index];
                    attr.data = child;
                    //For now, default shape is Rectangle. Update after UX input.
                    attr.shape = this.getShape(child.type);
                    nodes.push([cmpDef, attr]);
                }
                $A.createComponents(nodes, function (components) {
                    cmp.set("v.body", components);
                });
            }
        }
    },

    //Create a new node in canvas
    createNode: function(cmp, event) {
        var jqueryUI, helper, componentInstance, el;
        jqueryUI = event.getParam("ui");
        helper = jqueryUI.helper;
        //componentInstance is same as child in createNodes method
        componentInstance = event.getParam("componentInstance");
        if (!$A.util.isUndefinedOrNull(cmp) && !$A.util.isUndefinedOrNull(helper) && helper.get('v.broadcastDragEvent')) {
            el = cmp.getElement();
            //Since position of node is relative to canvas and jqueryUI offfset return position relative to body, we need to subtract canvas offset to identify correct position.
            componentInstance.properties.locationX = jqueryUI.offset.left - el.offsetLeft;
            componentInstance.properties.locationY = jqueryUI.offset.top - el.offsetTop;
            $A.createComponent("builder_platform_interaction:node", {
                data: componentInstance,
                shape: this.getShape(componentInstance.type)
            }, function(nodeCmp) {
                var body;
                if (!$A.util.isUndefinedOrNull(cmp) && !$A.util.isUndefinedOrNull(nodeCmp)) {
                    body = cmp.get("v.body");
                    body.push(nodeCmp);
                    cmp.set("v.body", body);
                    $A.getEvt("markup://visualEditor:addComponent").setParams({
                        componentInstance: nodeCmp.get("v.data")
                    }).fire();
                }
            })
        }
    },

    //Return shape of a node.
    //TODO: update the logic
    getShape: function(type) {
        return "Rectangle";
    },

    //When broadcastDragEvent is set to true, then only we will create a new node in canvas.
    setBroadcastDragEvent: function(event, value) {
        var jqueryUI, helper;
        jqueryUI = event.getParam("ui");
        helper = jqueryUI.helper;
        if (!$A.util.isUndefinedOrNull(helper) && helper.isInstanceOf("visualEditor:paletteItem")) {
            helper.set('v.broadcastDragEvent', value);
        }
    }
})