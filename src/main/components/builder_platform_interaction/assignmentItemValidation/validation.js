/*
 * @author avanderlee
 * since 210
 */

function validation() {
    var ASSIGNMENT_ITEM_LIST = 'assignmentItemList';
    var LEFT_SIDE_NAME = "leftSide";
    var OPERATOR_NAME = "operator";
    var VALUE = "value";

    var _assignmentItemValidation = function(assignmentItems) {
        var isValid = true;
        var errorMessage = "Fix your assignment items and try again.";
        var errors = [];
        assignmentItems
                .forEach(function(item, index) {
                    if (item.isValid === false) {
                        isValid = false;
                        errors.push({
                            isValid : false,
                            msg : {
                                message : errorMessage,
                                editor : ASSIGNMENT_ITEM_LIST,
                                index : index
                            }
                        });
                    } else if (!!item.assignmentItem) {
                        if ($A.util
                                .isUndefinedOrNull(item.assignmentItem.assignToReference)
                                || $A.util
                                        .isUndefinedOrNull(item.assignmentItem.operator)) {
                            isValid = false;
                            errors.push({
                                isValid : false,
                                msg : {
                                    message : errorMessage,
                                    editor : ASSIGNMENT_ITEM_LIST,
                                    index : index
                                }
                            });
                        }
                    }
                });

        return {
            isValid : isValid,
            errors : errors
        };
    };

    var _validate = function(assignmentItems) {
        var assignmentItemsVal = _assignmentItemValidation(assignmentItems);
        var isValid = assignmentItemsVal.isValid;

        var errors = assignmentItemsVal.errors;

        return {
            isValid : isValid,
            errors : errors
        };
    };

    return {
        validate : _validate
    }
}