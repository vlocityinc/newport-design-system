({
    doInit : function(cmp, event, helper) {

        var connectorType = "flow";
        var fid = cmp.get('v.flowId');
        if (fid === null) {
            // Add code to handle the case where we are creating a new flow
        } else {
            // Editing an existing flow
            var flowRef = {
                id : fid
            };
            helper.getInstances(cmp, connectorType, [ flowRef ], function(
                    result) {
                var flow = new helper.utils.model(result,
                        helper.handlePageActionError.bind(helper));
                flow.initialize();
                helper.initializeEditor(cmp, helper, flow);
            }, function(error) {
                cmp.set('v._redirectOnClose', true);
            });
        }

        // UNDO REDO
        var observer = {
            action_doAddComponent : function(message, undo, redo) {
                var flow = cmp.get("v._flow");
                var out;
                if (!undo) {// DO
                    out = flow.add(message.data.node,
                            message.data.parentId,
                            message.data.insertBeforeComponentId);
                    if (out.SUCCESS === true) {
                        message.data.id = out.RESULT.node.id;
                        // id might not have been set in the componentInstance
                        // parameter but it should be set by now
                        message.data.index = out.RESULT.newIndex;

                        helper.fireComponentAdded(out.RESULT.node,
                                message.data.parentId, message.data.index);
                        return true;
                    } else {
                        return false;// need to return false so
                        // undoRedoManager doesn't enqueue this
                        // failed action
                    }
                } else {// UNDO
                    out = flow.remove(message.data.id);
                    if (out.SUCCESS === true) {
                        helper.fireComponentRemoved(message.data.parentId,
                                message.data.index);
                        return true;
                    } else {
                        return false;// need to return false so
                        // undoRedoManager doesn't enqueue this
                        // failed action
                    }
                }
            },

            action_doPropertyChange : function(message, undo, redo) {
                var flow = cmp.get("v._flow");
                var out;
                if (!undo) {
                    var currentNode = flow.find(message.data.id);
                    message.data.old_props = currentNode.properties;
                    message.data.old_isValid = currentNode.isValid;
                    // set the prop diffs to null, so undo reverts newly added
                    // props
                    for ( var propKey in message.data.properties) {
                        if (!message.data.old_props.hasOwnProperty(propKey)) {
                            message.data.old_props[propKey] = null;
                        }
                    }
                    var isValid = message.data.isValid;
                    out = flow.setProperties(message.data.id,
                            message.data.properties, isValid);
                    if (out.SUCCESS === true) {
                        helper.fireComponentPropertiesChanged(out.RESULT.node,
                                redo, isValid);
                        return true;
                    } else {
                        return false;// need to return false so
                        // undoRedoManager doesn't enqueue this
                        // failed action
                    }

                } else {// UNDO
                    out = flow.setProperties(message.data.id,
                            message.data.old_props, message.data.old_isValid);
                    if (out.SUCCESS === true) {
                        helper.fireComponentPropertiesChanged(out.RESULT.node,
                                true, out.RESULT.node.isValid);
                        return true;
                    } else {
                        return false;// need to return false so
                        // undoRedoManager doesn't enqueue this
                        // failed action
                    }
                }
            },

            acceptMessage : function(message) {
                if (message.type === "AddComponent"
                        || message.type === "PropertyChange") {
                    return true;
                }
                return false;
            }
        };

        var undoRedoManager = new helper.utils.undoRedo.Manager({
            updateUndoRedoState : function(undoEnabled, redoEnabled) {
                var toggleEvent = $A
                        .getEvt("markup://visualEditor:toggleUndoRedoState");
                toggleEvent.setParams({
                    undoEnabled : undoEnabled,
                    redoEnabled : redoEnabled
                });
                toggleEvent.fire();
            }
        });
        undoRedoManager.addObserver(observer);
        cmp.set("v._undoRedoManager", undoRedoManager);
    },

    // This method handles when a new component is added in the canvas. It is
    // doing exactly same as handle select component.
    // It needs to be rewritten once backend plumbing is done.
    handleAddComponent : function(cmp, event) {
        var componentInstance, label, properties;
        componentInstance = event.getParam("componentInstance");
        label = componentInstance.label;
        if (componentInstance.properties !== null
                && componentInstance.properties.label !== null) {
            label = componentInstance.properties.label;
        }
        properties = {
            'elementName' : componentInstance.id,
            'elementLabel' : label,
            'data' : componentInstance,
            // TODO: Fix this - the element type should not be hard coded
            'elementType' : "assignment"// componentInstance.properties.elementType
        };
        $A.getEvt("markup://flexipageEditor:triggerPropertyEditor").setParams({
            componentType : "Element",
            context : componentInstance.id,
            properties : properties,
            componentLabel : componentInstance.id,
            isValid : false,
            params : null
        }).fire();
    },

    handleSelectComponent : function(cmp, event, helper) {
        var elementId = event.getParam('id');
        var flowObject = cmp.get('v._flow');
        var data = null;
        if (elementId !== null && flowObject !== null) {
            data = flowObject.find(elementId, null);
        }
        var properties = {};
        if (data) {
            var label = data.label;
            if (data.properties !== null && data.properties.label !== null) {
                label = data.properties.label;
            }
            properties = {
                'elementName' : {'value': data.id},
                'elementLabel' : {'value': label},
                'data' : {'value': data.properties.data},
                'elementType' : {'value': data.properties.elementType}
            };
        }

        $A.getEvt("markup://flexipageEditor:triggerPropertyEditor").setParams({
            componentType : "Element",
            context : elementId,
            properties : properties,
            componentLabel : elementId,
            isValid : false,
            params : null
        }).fire();
    },

    handlePropertiesChanged : function(cmp, event) {
        var id = event.getParam("context");
        var props = event.getParam("props");
        var isValid = event.getParam("isValid");
        if (id) {
            cmp.get("v._undoRedoManager").perform({
                type : "PropertyChange",
                data : {
                    id : id,
                    properties : props,
                    isValid : isValid
                }
            });
        }
    },
    /* when we receive a save aura event */
    handleSave : function(cmp, event, helper) {

        var flowObject = cmp.get('v._flow');
        if (!flowObject) {
            // the flow probably hasn't loaded yet
            helper.fireSaveCompleted(false);
            return;
        }
        var flowModel = flowObject.getModel();
        var connectorType = cmp.get("v.connectorType");
        helper.save(cmp, connectorType, flowModel, function(result) {
            // notify and track the fact that save has completed
            helper.fireSaveCompleted(true, null);
        }, function(error) {
            helper.fireSaveCompleted(false, null);
        });
    }
});
