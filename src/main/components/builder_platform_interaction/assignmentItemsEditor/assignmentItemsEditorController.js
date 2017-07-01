({
    onInit : function(cmp, event, helper) {
        var value = cmp.get('v.value');
        if (value) {
            cmp.set('v.listOfAssignmentItems', helper
                    .getListOfAssignmentItems(value.assignmentItems));
            cmp.set('v.errors', helper.clientValidation(cmp));
        }
    },

    onErrorsUpdated : function(cmp, event, helper) {
        var errors = cmp.get('v.errors');
        var listErrors = {};
        if (errors) {
            errors.forEach(function(error) {
                if (!error.isValid) {
                    // property editor take the result as msg then sends it back
                    // as message.
                    var errorObj = error.msg || error.message;
                    if (errorObj) {
                        if (errorObj.editor === helper.ASSIGNMENT_ITEM_LIST) {
                            listErrors[errorObj.index] = errorObj.message;
                        }
                    }
                }
            });
        }
        helper.addErrorToAssignmentItemList(cmp, listErrors);
    },

    onAssignmentItemListChanged : function(cmp, event, helper) {
        var list = cmp.get('v.listOfAssignmentItems');
        var value = cmp.get('v.value') || {};
        var newAssignmentItem = false;
        var propChanged = false;

        if (cmp.getElement()) {
            var itemsInDom = cmp.getElement().querySelectorAll(
                    ".builder_platform_interactionAssignmentItemListRow").length;
            newAssignmentItem = list.length > itemsInDom;
            if (newAssignmentItem) {
                value.assignmentItems = helper.getValueAssignmentItems(list);
                propChanged = true;
            } else if (list.length < itemsInDom) {
                // if assignmentItem is removed
                if (list.length > 0) {
                    value.assignmentItems = helper
                            .getValueAssignmentItems(list);
                }
                propChanged = true;
            }
        }

        helper.clientValidation(cmp);

        if (propChanged) {
            cmp.set('v.value', value);
            cmp.get('c.handlePropChange').run();
        }
    },

    onAssignmentItemUpdated : function(cmp, event, helper) {
        var params = event.getParams();

        if (params && params.newAssignmentItem) {
            helper.updateAssignmentItem(cmp, params);
            cmp.get('c.handlePropChange').run();
        } else if (params && !$A.util.isUndefinedOrNull(params.index)) {
            // closed without changing anything
            var index = params.index;
            var list = cmp.get('v.listOfAssignmentItems');
            if (list.length > 0) {
                var item = list[index];

                if (item && item[helper.LEFT_SIDE_NAME] === ""
                        && item[helper.OPERATOR_NAME] === "") {
                    list.splice(index, 1);
                    cmp.set('v.listOfAssignmentItems', list);
                }
            }
        }
    }
})