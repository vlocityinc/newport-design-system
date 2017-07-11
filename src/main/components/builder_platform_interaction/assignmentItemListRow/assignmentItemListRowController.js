/*
 * Copyright 2016 salesforce.com, inc.
 * All Rights Reserved
 * Company Confidential
 */

({
    onInit : function(cmp, event, helper) {
        var item = cmp.get('v.item.assignmentItem');
        var properties = {};
        properties[helper.ASSIGNMENT_ITEM_NAME] = {
            'value' : item
        };
        helper.commons.component
                .createComponent(
                        'markup://visualEditor:componentPropertiesEditor',
                        {
                            connectorType : helper.ASSIGNMENT_ITEM_NAME,
                            validateAttributesOnInit : true,
                            fetchValuesOnInit : false,
                            attributeValues : properties,
                            itemId : helper.ASSIGNMENT_ITEM_NAME,
                            context : helper.ASSIGNMENT_ITEM_NAME
                                    + cmp.get('v.index'),
                            storable : true
                        },
                        function(propsEditor, overallStatus, statusList) {
                            if (overallStatus === "SUCCESS") {
                                propsEditor.getConcreteComponent()
                                        .setAttributeValueProvider(cmp);
                                cmp.set('v.body', [ propsEditor ]);
                            } else {
                                $A.logger
                                        .warning("Error creating property editor for the assignment item: "
                                                + statusList);
                            }
                        });
    },

    handlePropertiesChanged : function(cmp, event, helper) {
        if (cmp.isValid()) {
            var params = event.getParams();

            if (params.props) {
                var assignmentItem = cmp.get('v.item.assignmentItem');
                var leftSide = params.props[helper.LEFT_SIDE_NAME];
                var operator = params.props[helper.OPERATOR_NAME];
                var rightSide = params.props[helper.RIGHT_SIDE_NAME];
                var newItem = {};
                if ($A.util.isUndefinedOrNull(leftSide)) {
                    newItem.assignToReference = assignmentItem.assignToReference;
                } else {
                    newItem.assignToReference = leftSide.value;
                }
                if ($A.util.isUndefinedOrNull(operator)) {
                    newItem.operator = assignmentItem.operator;
                } else {
                    newItem.operator = operator.value;
                }
                if ($A.util.isUndefinedOrNull(rightSide)) {
                    newItem.value = assignmentItem.value;
                } else {
                    newItem.value = rightSide.value;
                }

                var updatedEvent = cmp.getEvent('assignmentItemUpdated');

                updatedEvent.setParams({
                    index : cmp.get('v.index'),
                    newAssignmentItem : newItem,
                    isValid : params.isValid
                }).fire();
            }
            if (params.isValid !== undefined) {
                cmp.set('v.hasError', !params.isValid);
            }
        }
        event.stopPropagation();
    }
})