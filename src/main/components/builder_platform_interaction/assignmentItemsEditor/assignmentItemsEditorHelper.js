/*
 * Copyright 2016 salesforce.com, inc.
 * All Rights Reserved
 * Company Confidential
 */

({
    LEFT_SIDE_NAME : "leftSide",
    OPERATOR_NAME : "operator",
    RIGHT_SIDE_NAME : "rightSide",
    ASSIGNMENT_ITEM_LIST : 'assignmentItemList',

    createErrorComponent : function(cmp) {
        $A.createComponent("markup://ui:inputDefaultError", {}, function(
                errorCmp, status) {
            if (status === "SUCCESS") {
                cmp.set("v.errorComponent", errorCmp);
            }
        });
    },

    updateAssignmentItem : function(cmp, params) {
        var list = cmp.get('v.listOfAssignmentItems');
        var value = cmp.get('v.value') || {};

        list[params.index] = {
            assignmentItem : params.newAssignmentItem,
            isValid : params.isValid
        };
        value.assignmentItems = this.getValueAssignmentItems(list);
        cmp.set('v.listOfAssignmentItems', list, true);
        cmp.set('v.value', value);
    },

    addErrorToAssignmentItemList : function(cmp, errors) {
        var errorCmp = cmp.get('v.errorComponent')[0];
        var element = cmp.getElement();
        var errorKeys = Object.keys(errors);
        if (!errorCmp) {
            this.createErrorComponent(cmp);
            errorCmp = cmp.get('v.errorComponent')[0];
        }
        if (errorKeys.length) {
            errorCmp.set("v.value", errors[errorKeys[0]]);
            cmp.set('v.errorComponent', errorCmp);
            if (element) {
                element.setAttribute('aria-described-by', errorCmp
                        .getGlobalId());
            }
        } else {
            errorCmp.set("v.value", []);
            cmp.set('v.errorComponent', errorCmp);
        }
    },

    setErrors : function(cmp, errors) {
        cmp.set('v.errors', errors);
    },

    getErrors : function(cmp) {
        return cmp.get('v.errors');
    },

    getListOfAssignmentItems : function(assignmentItems) {
        var list = [];
        if (!$A.util.isUndefinedOrNull(assignmentItems)) {
            assignmentItems.forEach(function(item) {
                list.push({
                    assignmentItem : item,
                    isValid : true
                });
            });
        }
        return list;
    },

    getValueAssignmentItems : function(assignmentItems) {
        var list = [];
        if (!$A.util.isUndefinedOrNull(assignmentItems)) {
            assignmentItems.forEach(function(item) {
                list.push(item.assignmentItem);
            });
        }
        return list;
    },

    clientValidation : function(cmp) {
        var value = cmp.get('v.value');

        if (!$A.util.isUndefinedOrNull(value)) {
            var assignmentItems = cmp.get('v.listOfAssignmentItems');
            var validationResult = this.validation.validation
                    .validate(assignmentItems);
            if (!$A.util.isUndefinedOrNull(validationResult.errors)) {
                if (!validationResult.isValid) {
                    return validationResult.errors[0];
                }
            }
        }
        return {
            valid : true,
            msg : undefined
        };
    }
})