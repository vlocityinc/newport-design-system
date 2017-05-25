({
    initializeEditor : function(cmp, helper, flowObject, undoRedoStack) {
        cmp.set("v._canvasReady", false);

        cmp.set("v._flow", flowObject);

        var flowModel = flowObject.getModel();
        var id;
        var flow;
        for ( var nodeId in flowModel) {
            node = flowModel[nodeId];
            if (node.isTopLevel) {
                id = nodeId;
                break;
            }
        }

        if (id) {
            node = flowModel[id];
            if (node.isTopLevel) {
                flow = flowObject.find(id, true);
            }
        }

        // trigger the page loaded
        $A.getEvt("markup://flexipageEditor:pageLoaded").setParams({
            "model" : flow
        }).fire();
    },

    handlePageActionError : function(e) {
    },

    fireComponentPropertiesChanged : function(node, isUndoOrRedo, isValid) {
        var event = $A
                .getEvt("markup://flexipageEditor:modelChangedPropertiesChanged");
        event.setParams({
            type : node.type,
            componentInstance : node,
            isUndoOrRedo : isUndoOrRedo,
            isValid : isValid
        });
        event.fire();
    },

    fireSaveCompleted : function(successful, pageId) {
        $A.getEvt("markup://flexipageEditor:saveCompleted").setParams({
            successful : successful,
            pageId : pageId || null
        }).fire();
    }

});
