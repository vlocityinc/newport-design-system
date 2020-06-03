// @ts-nocheck
import {
    screenValidation,
    getExtensionParameterValidation,
    getRulesForField,
    getDynamicTypeMappingValidation
} from './screenValidation';
import { VALIDATE_ALL, isUniqueDevNameInStore } from 'builder_platform_interaction/validationRules';
import { conditionListReducer } from 'builder_platform_interaction/conditionListReducer';
import {
    updateProperties,
    set,
    deleteItem,
    insertItem,
    replaceItem,
    hydrateWithErrors,
    isItemHydratedWithErrors,
    getValueFromHydratedItem
} from 'builder_platform_interaction/dataMutationLib';
import {
    PropertyChangedEvent,
    ValidationRuleChangedEvent,
    SCREEN_EDITOR_EVENT_NAME,
    AddConditionEvent,
    UpdateConditionLogicEvent,
    DeleteConditionEvent,
    UpdateConditionEvent,
    UseAdvancedOptionsSelectionChangedEvent,
    DynamicTypeMappingChangeEvent
} from 'builder_platform_interaction/events';
import { createEmptyScreenFieldOfType } from 'builder_platform_interaction/elementFactory';
import { elementTypeToConfigMap } from 'builder_platform_interaction/elementConfig';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { createChoiceReference } from 'builder_platform_interaction/elementFactory';
import {
    isScreen,
    isExtensionField,
    isPicklistField,
    isMultiSelectPicklistField,
    isMultiSelectCheckboxField,
    isRadioField,
    isRegionContainerField,
    compareValues,
    EXTENSION_PARAM_PREFIX,
    extendFlowExtensionScreenField,
    getColumnFieldType
} from 'builder_platform_interaction/screenEditorUtils';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { getCachedExtension } from 'builder_platform_interaction/flowExtensionLib';

/**
 * Replaces the field at the specified position with the updatedChild and then updates the fields
 * collection on the parent and returns the parent. Does this recursively, as long as there are entries
 * in the positions array.
 * @param {Object} parent - The parent of the updated child
 * @param {Array} positions - An array of the positions or indexes. The first index in the array is the
 * updated child's position in its parent's fields collection. The next index is that parent's position
 * in it's parent fields collection (the updated child's grand parent, and so on and so forth.
 * @param {Object} updatedChild - The field that was actually modified
 */
const updateAncestors = (parent, positions, updatedChild) => {
    if (positions && positions.length === 0) {
        return updatedChild;
    }
    const parentPosition = positions.pop();
    if (positions.length > 0) {
        updatedChild = updateAncestors(parent.fields[parentPosition], positions, updatedChild);
    }
    const updatedParentItems = replaceItem(parent.fields, updatedChild, parentPosition);
    return set(parent, 'fields', updatedParentItems);
};

const updateFieldInScreen = (screen, field, newField) => {
    // Replace the field in the screen
    const positions = screen.getFieldIndexesByGUID(field.guid);
    return updateAncestors(screen, positions, newField);
};

const updateField = (screen, field, properties) => {
    const updatedField = updateProperties(field, properties);
    return updateFieldInScreen(screen, field, updatedField);
};

/**
 * Returns the object that is the parent of the field that is located at the position indicated by the
 * provided sequence of indexes.
 * @param {Object} screen - The screen.
 * @param {Array} ancestorPositions - An array of the positions or indexes. The first index in the array
 * is the index of the child whose parent we are looking for. The next index is the parent's index in its
 * parent's fields collection (the grand parent's) and so on and so forth.
 */
const findParentByAncestorPositions = (screen, ancestorPositions) => {
    let parent = screen;
    if (ancestorPositions && ancestorPositions.length > 0) {
        let child = parent;
        for (let i = ancestorPositions.length - 1; i >= 0; i--) {
            parent = child;
            child = parent.fields[ancestorPositions[i]];
        }
    }
    return parent;
};

/**
 * Update the visibilityRule condition logic
 * @param {*} screen - The screen.
 * @param {*} field - The field
 * @param {*} event - The UpdateConditionLogicEvent
 */
const updateConditionLogic = (state, field, event) => {
    const visibilityRule = conditionListReducer(field.visibilityRule, event);
    return updateField(state, field, { visibilityRule });
};

/**
 * Update a visibilityRule condition
 * @param {*} screen - The screen.
 * @param {*} field - The field
 * @param {*} event - The UpdateConditionEvent
 */
const updateCondition = (screen, field, event) => {
    const visibilityRule = conditionListReducer(field.visibilityRule, event, new Map(), '');
    return updateField(screen, field, { visibilityRule });
};

/**
 * Delete a visibilityRule condition
 * @param {*} screen - The screen.
 * @param {*} field - The field
 * @param {*} event - The DeleteConditionEvent
 */
const deleteCondition = (screen, field, event) => {
    const visibilityRule = conditionListReducer(field.visibilityRule, event);
    return updateField(screen, field, { visibilityRule });
};

/**
 * Add a visibilityRule condition
 * @param {*} screen - The screen.
 * @param {*} field - The field
 */
const addCondition = (screen, field, event) => {
    const visibilityRule = conditionListReducer(field.visibilityRule, event);
    return updateField(screen, field, { visibilityRule });
};

/**
 * Clears values of field parameters with the specified generic type.
 */
const clearGenericParameters = ({ parameters, extensionParameters, genericTypeName }) =>
    parameters
        .map(parameter => ({
            parameter,
            parameterType: extensionParameters.find(
                paramType => paramType.apiName === getValueFromHydratedItem(parameter.name)
            )
        }))
        .map(({ parameter, parameterType }) =>
            parameterType && parameterType.subtype === '{' + genericTypeName + '}'
                ? {
                      ...parameter,
                      value: {
                          value: '',
                          error: null
                      }
                  }
                : parameter
        );

/**
 * Clears values of input and output parameters of the specified generic type
 * of a screen field.
 */
function clearGenericFieldParameters(field, genericTypeName) {
    const extension = getCachedExtension(getValueFromHydratedItem(field.extensionName));
    const result = {};
    if (field.inputParameters) {
        result.inputParameters = clearGenericParameters({
            parameters: field.inputParameters,
            extensionParameters: extension.inputParameters,
            genericTypeName
        });
    }
    if (field.outputParameters) {
        result.outputParameters = clearGenericParameters({
            parameters: field.outputParameters,
            extensionParameters: extension.outputParameters,
            genericTypeName
        });
    }
    return result;
}

/**
 * Updates a values of a dynamic type mapping of a screen field.
 * Clears values of input and output parameters with the generic type in the changed mapping.
 */
function setDynamicTypeMappingTypeValue(screen, field, event) {
    const { typeName, typeValue } = event.detail;
    const { dynamicTypeMappings } = field;

    // Find the dynamic type mapping. It has to be present in the array already.
    const index = dynamicTypeMappings.findIndex(mapping => getValueFromHydratedItem(mapping.typeName) === typeName);
    const dynamicTypeMapping = dynamicTypeMappings[index];

    // Check if the value has actually changed
    if (getValueFromHydratedItem(dynamicTypeMapping.typeValue) === typeValue) {
        return screen;
    }

    // Update the dynamic type mapping with the new value and validate it.
    const validation = getDynamicTypeMappingValidation(dynamicTypeMapping.rowIndex);
    const newDynamicTypeMapping = updateProperties(dynamicTypeMapping, {
        typeValue: {
            value: typeValue,
            error: validation.validateProperty('dynamicTypeMapping', typeValue)
        }
    });
    // Update dynamic type mappings in the state and return the new state.
    const newDynamicTypeMappings = replaceItem(dynamicTypeMappings, newDynamicTypeMapping, index);
    return updateField(screen, field, {
        dynamicTypeMappings: newDynamicTypeMappings,
        ...clearGenericFieldParameters(field, typeName)
    });
}

/**
 * Inserts the field into the parent's fields collection at the position specified and returns an updated
 * screen object.
 * @param {Object} screen - The screen
 * @param {Object} parent - The parent to which we are adding the field
 * @param {Object} field - The field to be inserted
 * @param {Number} position - The position at which the field should be added
 * @returns {object} - A new screen with the changes applied
 */
const insertScreenFieldIntoParent = (screen, parent, field, position) => {
    // Figure out if the field be added to the end or somewhere in between.
    position = Number.isInteger(position) ? position : parent.fields.length;
    const updatedItems = insertItem(parent.fields, field, position);
    parent = set(parent, 'fields', updatedItems);
    if (screen.name.value !== parent.name.value) {
        parent = updateAncestors(screen, screen.getFieldIndexesByGUID(parent.guid), parent);
    }
    return parent;
};

/**
 * Resize all columns in the section to a total of 12
 * This is used when columns are added or removed
 *
 * @param {Object} screen - The screen
 * @param {Object} sectionGuid - Guid of the
 * @returns {object} - A new screen with the changes applied
 */
const resizeColumnsForSection = (screen, sectionGuid) => {
    const parent = screen.findFieldByGUID(screen.fields, sectionGuid);

    const MAX_TOTAL_WIDTH = 12;

    const fields = [];
    const newWidth = MAX_TOTAL_WIDTH / parent.fields.length;

    // Update the column with a new width input parameter
    parent.fields.forEach(column => {
        const originalInputParameters = column.inputParameters;
        const inputParameter = Object.assign({}, originalInputParameters[0], { name: 'width', value: newWidth });
        const field = Object.assign({}, column, { inputParameters: [inputParameter] });
        fields.push(field);
    });

    return updateField(screen, parent, { fields });
};

/**
 * Adds screen fields to a screen.
 * @param {object} screen - The screen
 * @param {event} event - The add screen field event
 * @returns {object} - A new screen with the changes applied
 */
const addScreenField = (screen, event) => {
    let parent = event.parentGuid ? screen.getFieldByGUID(event.parentGuid) : screen;
    parent = parent ? parent : screen;

    // If it is a section, figure out how many sections the screen already has (needed to generate a
    // a unique API name)
    let sectionCount = 0;
    if (event.typeName === 'Section') {
        for (const field of parent.fields) {
            if (isRegionContainerField(field)) {
                sectionCount++;
            }
        }
    }

    const field = createEmptyScreenFieldOfType(event.typeName, sectionCount);

    hydrateWithErrors(field, elementTypeToConfigMap[ELEMENT_TYPE.SCREEN].nonHydratableProperties);

    // Add properties, specific to flow extensions
    if (isExtensionField(field)) {
        extendFlowExtensionScreenField(field);
    }

    let updatedScreen = insertScreenFieldIntoParent(screen, parent, field, event.position);

    // If a column is being added, all other columns in the parent must be resized
    if (event.typeName === getColumnFieldType().name) {
        updatedScreen = resizeColumnsForSection(updatedScreen, parent.guid);
    }

    return updatedScreen;
};

/**
 * Adds a chocie to a screenField.
 * @param {object} screen - The screen.
 * @param {event} event - The add choice event.
 * @param {object} field - The field that the choice should be added to.
 */
const addChoice = (screen, event, field) => {
    // New choices can only be added to the end of the list. The position number should never
    // be anything other than the the next available index.
    if (event.detail.position !== field.choiceReferences.length) {
        throw new Error('Position for new choice is invalid: ' + event.detail.position);
    }

    const emptyChoice = hydrateWithErrors(createChoiceReference());
    const updatedChoices = insertItem(field.choiceReferences, emptyChoice, event.detail.position);
    const updatedField = set(field, 'choiceReferences', updatedChoices);

    // Replace the field in the screen
    const positions = screen.getFieldIndexesByGUID(field.guid);
    return updateAncestors(screen, positions, updatedField);
};

/**
 * Change a choice of a screenField.
 * @param {*} screen - The screen.
 * @param {*} event - The change choice event.
 * @param {*} field - The field that the choice should be changed in.
 */
const changeChoice = (screen, event, field) => {
    if (event.detail.position > field.choiceReferences.length - 1 || event.detail.position < 0) {
        throw new Error('Invalid position for choice deletion: ' + event.detail.position);
    }

    const originalChoice = field.choiceReferences[event.detail.position];

    const hydratedChoice = hydrateWithErrors(createChoiceReference(event.detail.newValue.value));
    hydratedChoice.choiceReference.error = event.detail.newValue.error;
    const updatedChoices = replaceItem(field.choiceReferences, hydratedChoice, event.detail.position);
    const updatedField = set(field, 'choiceReferences', updatedChoices);

    // If default value was set for this field, check to see if its set to the choice that was just
    // changed. If it was, then clear the default value as it may no longer be valid.
    if (field.defaultSelectedChoiceReference && field.defaultSelectedChoiceReference.value) {
        if (field.defaultSelectedChoiceReference.value === originalChoice.choiceReference.value) {
            updatedField.defaultSelectedChoiceReference.value = null;
        }
    }

    // Replace the field in the screen
    const positions = screen.getFieldIndexesByGUID(field.guid);
    return updateAncestors(screen, positions, updatedField);
};

/**
 * Delete a choice of a screenField.
 * @param {*} screen - The screen.
 * @param {*} event - The delete choice event.
 * @param {*} field - The field that the choice should be deleted from.
 */
const deleteChoice = (screen, event, field) => {
    const originalChoice = field.choiceReferences[event.detail.position];
    const updatedChoices = deleteItem(field.choiceReferences, event.detail.position);
    const updatedField = set(field, 'choiceReferences', updatedChoices);

    // If default value was set for this field, check to see if its set to the choice that was just
    // delete. If it was, then clear the default value as it may no longer be valid.
    if (field.defaultSelectedChoiceReference && field.defaultSelectedChoiceReference.value) {
        if (field.defaultSelectedChoiceReference.value === originalChoice.choiceReference.value) {
            updatedField.defaultSelectedChoiceReference.value = null;
        }
    }

    // Replace the field in the screen
    const positions = screen.getFieldIndexesByGUID(field.guid);
    return updateAncestors(screen, positions, updatedField);
};

/**
 * Removes the specified field from the specified parent and then returns an updated screen object
 * @param {object} screen - The screen
 * @param {object} parent - The parent of the field to be removed
 * @param {object} field - The field to be removed
 * @param {object} positions - an array of indexes that indicate the location of a screen field in the screen field tree
 * @returns {object} - A new screen with the changes applied
 */
const removeScreenFieldFromParent = (screen, parent, field, positions) => {
    if (positions && positions.length > 0) {
        const deletedItemIndex = positions.splice(0, 1);
        const updatedItems = deleteItem(parent.fields, deletedItemIndex[0]);
        parent = set(parent, 'fields', updatedItems);

        let updatedScreen = updateAncestors(screen, positions, parent);

        // If a column is being added, all other columns in the parent must be resized
        if (field.type.name === getColumnFieldType().name) {
            updatedScreen = resizeColumnsForSection(updatedScreen, parent.guid);
        }

        return updatedScreen;
    }
    return screen;
};

/**
 * Deletes screen fields from the screen.
 * @param {object} screen - The screen
 * @param {event} event - The delete screen field event
 * @returns {object} - A new screen with the changes applied
 */
const deleteScreenField = (screen, event) => {
    const positions = screen.getFieldIndexesByGUID(event.screenElement.guid);
    let parent = event.parentGuid
        ? screen.getFieldByGUID(event.parentGuid)
        : findParentByAncestorPositions(screen, positions);
    parent = parent ? parent : screen;
    return removeScreenFieldFromParent(screen, parent, event.screenElement, positions);
};

/**
 * Moves a field from one location in a screen to another.
 * @param {object} screen - The screen
 * @param {event} event - The screen element moved event
 * @returns {object} - A new screen with the changes applied
 */
const moveScreenField = (screen, event) => {
    const sourceField = screen.getFieldByGUID(event.detail.sourceGuid);
    if (sourceField) {
        const sourcePositions = screen.getFieldIndexesByGUID(event.detail.sourceGuid);
        const sourceParent = findParentByAncestorPositions(screen, sourcePositions);
        const sourceIndex = sourcePositions && sourcePositions.length > 0 ? sourcePositions[0] : -1;
        const updatedScreen = removeScreenFieldFromParent(screen, sourceParent, sourceField, sourcePositions);
        const destinationParentGuid = event.detail.destinationParentGuid;
        const destinationParent =
            updatedScreen.guid === destinationParentGuid
                ? updatedScreen
                : updatedScreen.getFieldByGUID(destinationParentGuid);
        let destinationIndex = event.detail.destinationIndex;
        if (sourceParent.guid === destinationParent.guid && sourceIndex >= 0 && sourceIndex <= destinationIndex) {
            destinationIndex--;
        }
        if (destinationIndex >= 0) {
            return insertScreenFieldIntoParent(updatedScreen, destinationParent, sourceField, destinationIndex);
        }
    }
    return screen;
};

/**
 * Processes a Ferov change and makes sure the three properties used to describe the ferov value are in sync (dataType, dataGuid and the property itself)
 *
 * @param {object} valueField - The field to be processed (containing a ferov value)
 * @param {string} ferovDataType - The data type of the value being placed into the field
 * @param {string} typePropertyName - The name of the data type property (assigned in ferov mutation)
 * @return {object} - The processed field
 */
const processFerovValueChange = (valueField, ferovDataType, typePropertyName) => {
    return updateProperties(valueField, { [typePropertyName]: ferovDataType });
};

/**
 * Update all fields in a container screen field
 *
 * Currently, no validation is performed
 *
 * @param {*} data - {field, property, currentValue, newValue, hydrated, error, newValueGuid, dataType}
 * @returns {screenfield} - The new screenfield after the change
 */
const handleFieldsPropertyChange = data => {
    return updateProperties(data.field, {
        fields: data.newValue
    });
};

/**
 * Applies changes to a screen field.
 *
 * @param {*} data - {field, property, currentValue, newValue, hydrated, error, newValueGuid, dataType}
 * @returns {screenfield} - The new screenfield after the change
 */
const handleStandardScreenFieldPropertyChange = data => {
    // Non-extension screen field change

    // Run validation
    let field = data.field;
    const rules = getRulesForField(field, !!data.newValueGuid);
    const newValue = data.hydrated ? data.newValue.value : data.newValue; // TODO property must be hydrated here
    const error =
        data.error === null
            ? screenValidation.validateProperty(data.property, newValue, rules[data.property])
            : data.error;
    if (error && data.hydrated) {
        data.newValue.error = error;
    }

    // Default value needs special handling because defaultValueDataType may need to be updated
    if (data.property === 'defaultValue') {
        // First update the value.
        let updatedValueField;
        if (data.newValueGuid) {
            // If the new value is a reference, set the value to the GUID
            updatedValueField = updateProperties(data.field, {
                defaultValue: { value: data.newValueGuid, error }
            });
        } else {
            updatedValueField = updateProperties(data.field, {
                defaultValue: data.newValue
            });
        }
        // Now the defaultValue object.
        return processFerovValueChange(updatedValueField, data.ferovDataType, 'defaultValueDataType');
    }

    // If the dataType of the field was changed and this is a choice based field, clear out any choices
    // that were already configured.
    if (
        data.property === 'dataType' &&
        (isPicklistField(field) ||
            isMultiSelectPicklistField(field) ||
            isMultiSelectCheckboxField(field) ||
            isRadioField(field))
    ) {
        if (field.choiceReferences.length) {
            // Delete all choices except 1 because when the dataType is changed, all choices must be
            // reset. Choices are strictly typed so there is no way a change in dataType will result
            // in the old choices being valid for the new dataType. If we ever change this,
            // we might need to revisit this.
            const emptyChoice = hydrateWithErrors(createChoiceReference());
            field = set(field, 'choiceReferences', [emptyChoice]);
        }
    }

    return updateProperties(field, { [data.property]: data.newValue });
};

/**
 * Applies changes to the input/output parameters of an extension screen field
 *
 * @param {*} data - {field, property, currentValue, newValue, hydrated, error, newValueGuid, dataType, required}
 * @param {*} attributeIndex - the index of the property (for output attributes assigned to more than one variable)
 * @returns {screenfield} - The new screenfield after the change
 */
const handleExtensionFieldPropertyChange = (data, attributeIndex) => {
    let prefix;
    let parametersPropName;

    if (data.property.startsWith(EXTENSION_PARAM_PREFIX.INPUT + '.')) {
        prefix = EXTENSION_PARAM_PREFIX.INPUT;
        parametersPropName = 'inputParameters';
    } else if (data.property.startsWith(EXTENSION_PARAM_PREFIX.OUTPUT + '.')) {
        prefix = EXTENSION_PARAM_PREFIX.OUTPUT;
        parametersPropName = 'outputParameters';
    } else {
        throw new Error('Unknown parameter type: ' + data.property);
    }

    let field = data.field;
    const paramName = data.property.substring(prefix.length + 1); // + 1 to remove the dot
    let param = null;
    if (attributeIndex > 0) {
        const params = field[parametersPropName].filter(
            p => (p.name && p.name.value ? p.name.value : p.name) === paramName
        );
        param = params[attributeIndex - 1];
    } else {
        param = field[parametersPropName].find(p => (p.name && p.name.value ? p.name.value : p.name) === paramName);
    }

    // Going from no value to having a value
    if (!param) {
        // Parameters that were never assigned a value are not present in the flow MD, let's create the param and add it
        param = {
            name: paramName,
            processMetadataValues: [],
            value: null,
            rowIndex: generateGuid()
        };

        hydrateWithErrors(param, elementTypeToConfigMap[ELEMENT_TYPE.SCREEN].nonHydratableProperties);
        const updatedParams = insertItem(field[parametersPropName], param, field[parametersPropName].length);
        field = set(field, parametersPropName, updatedParams);
    }

    const newValue = data.hydrated ? data.newValue.value : data.newValue;
    let error = data.error;
    if (!error) {
        const paramValidation = getExtensionParameterValidation('parameterValue', data.dataType, data.required);
        error = paramValidation.validateProperty('parameterValue', newValue);
    }

    if (error && data.hydrated) {
        data.newValue.error = error;
    }

    // Replace the property in the parameter
    let updatedParams = null;
    const index = field[parametersPropName].indexOf(param);

    // Note: need to check data.newValue.value is only null/undefined here specifically,
    // otherwise boolean type false or number type 0 could cause deleting the param
    if ((data.newValue.value === null || data.newValue.value === undefined) && !data.newValue.error) {
        // User cleared the value and we are fine with that, let's remove the parameter
        updatedParams = deleteItem(field[parametersPropName], index);
    } else {
        // Replace the property in the parameter
        const newParamValue = data.newValueGuid
            ? { value: data.newValueGuid, error: data.newValue.error }
            : data.newValue; // If it is a reference store the guid, not the devName
        let newParam = updateProperties(param, { value: newParamValue });
        const dataTypePropName = 'valueDataType';

        newParam = processFerovValueChange(newParam, data.ferovDataType, dataTypePropName);

        // Replace the new parameter in the parameters array
        updatedParams = replaceItem(field[parametersPropName], newParam, index);
    }

    // Replace the parameters in the field
    return set(field, parametersPropName, updatedParams);
};

/**
 * Handles changes in properties in a screenfield.
 * @param {object} screen - The screen or node
 * @param {event} event - The property changed event
 * @param {object} screenfield - The screenfield
 * @returns {object} - A new screen/node with the changes applied
 */
const handleScreenFieldPropertyChange = (data, screen, event, screenfield) => {
    const newValueForProperty = data.newValue.value;
    if (data.property === 'name' && data.error === null && screen) {
        data.error =
            screenValidation.validateFieldNameUniquenessLocally(screen, newValueForProperty, screenfield.guid) ||
            isUniqueDevNameInStore(newValueForProperty, [event.detail.guid || screenfield.guid]);
    }

    // If the default value is being cleared out, the dataType associated with the new value should be set
    // to undefined because we want to clear that property.
    if (newValueForProperty === undefined || newValueForProperty === null || newValueForProperty === '') {
        data.dataType = undefined;
    }

    let newField = null;
    if (isExtensionField(screenfield) && data.property !== 'name') {
        newField = handleExtensionFieldPropertyChange(data, event.detail.attributeIndex);
    } else if (data.property === 'fields') {
        // TODO: Aniko: you might want to do this differently?  I'm just making it work for now
        // Updates the children of a screen field
        newField = handleFieldsPropertyChange(data);
    } else {
        newField = handleStandardScreenFieldPropertyChange(data);
    }

    return updateFieldInScreen(screen, screenfield, newField);
};

/**
 * Handles changes in properties in the screen or node.
 * @param {object} screen - The screen or node
 * @param {event} event - The property changed event
 * @param {object} selectedNode - the currently selected node
 * @returns {object} - A new screen/node with the changes applied
 */
const screenPropertyChanged = (screen, event, selectedNode) => {
    let property = event.detail.propertyName;

    // If the element being updated is not screen field and the property name
    // is 'label', translate this to 'fieldText', which is how label is kept for screen fields.
    if (!isScreen(selectedNode) && property === 'label') {
        property = 'fieldText';
    }

    const error = event.detail.error;
    const value = event.detail.value;
    const currentValue = event.detail.oldValue || selectedNode[property];
    const hydrated = isItemHydratedWithErrors(currentValue);

    if (hydrated) {
        if (!isItemHydratedWithErrors(value)) {
            throw new Error('Current value is hydrated and new value is not' + JSON.stringify(event.detail));
        }
    } else if (
        (typeof currentValue === 'string' || typeof value === 'string') &&
        !elementTypeToConfigMap[ELEMENT_TYPE.SCREEN].nonHydratableProperties.includes(property)
    ) {
        // Unless this property is on the blacklist, if it's a string, we should be hydrating it.
        throw new Error('String values have to be hydrated: ' + JSON.stringify(event.detail));
    }

    // Only update the field if the given property value actually changed.
    let updatedNode = selectedNode;
    if (compareValues(currentValue, value, true)) {
        if (isScreen(selectedNode)) {
            if (hydrated) {
                value.error = error || screenValidation.validateProperty(property, value.value);
                if (value.error === null && property === 'name' && screen) {
                    value.error = screenValidation.validateFieldNameUniquenessLocally(screen, value.value, screen.guid);
                }
            }

            updatedNode = updateProperties(screen, { [property]: value });

            if (property === 'allowPause' && !value && screen.pausedText.error) {
                // Clear the the pausedText if allowPause is false and the pausedText has an error, if it doesn't we
                // keep it until the user saves the flow in case he changes his mind
                updatedNode = updateProperties(updatedNode, {
                    pausedText: { value: null, error: null }
                });
            }
        } else {
            // Screen field
            const data = {
                field: selectedNode,
                property,
                currentValue,
                newValue: value,
                hydrated,
                error,
                newValueGuid: event.detail.guid,
                dataType: selectedNode.dataType || event.detail.valueDataType || event.detail.defaultValueDataType,
                ferovDataType: event.detail.dataType,
                required: event.detail.required
            };

            updatedNode = handleScreenFieldPropertyChange(data, screen, event, selectedNode);
        }
    } else {
        // If nothing changed, return the screen, unchanged.
        return screen;
    }
    return updatedNode;
};

/**
 * Handles changes in validation rules for screen fields.
 * @param {object} screen - The screen or node
 * @param {event} event - The validation rule changed event
 * @param {object} selectedNode - the currently selected field
 * @returns {object} - A new screen with the changes applied
 */
const validationRuleChanged = (screen, event, selectedNode) => {
    // Make sure there was a change
    const newRule = event.detail.rule;
    const currentRule = selectedNode.validationRule;
    if (
        compareValues(newRule.formulaExpression, currentRule.formulaExpression, true) ||
        compareValues(newRule.errorMessage, currentRule.errorMessage, true)
    ) {
        // Run validation
        const validate = (property, element, rules) => {
            const value = element[property];
            const propertyRules = rules.validationRule[property];
            value.error =
                value.error === null
                    ? screenValidation.validateProperty(property, value.value, propertyRules)
                    : value.error;
        };

        // Update validationRule in field
        const updatedField = updateProperties(selectedNode, {
            validationRule: newRule
        });

        // I'm validating after updating the rule in the field because conditional requiredness rules should be ran on the new values
        const validationRulesForField = getRulesForField(updatedField);
        validate('formulaExpression', newRule, validationRulesForField);
        validate('errorMessage', newRule, validationRulesForField);

        // Update field in screen
        return updateFieldInScreen(screen, selectedNode, updatedField);
    }

    return screen;
};

const useAdvancedOptionsSelectionChanged = (state, selectedNode, { useAdvancedOptions }) => {
    const updatedField = updateProperties(selectedNode, {
        storeOutputAutomatically: !useAdvancedOptions
    });
    return updateFieldInScreen(state, selectedNode, updatedField);
};

/**
 * Screen reducer function, performs changes and validation on a screen and returns the updated (new) screen element
 * @param {object} state - element / screen node
 * @param {object} event - event to process
 * @param {object} selectedNode - the currently selected node
 * @returns {object} screen - the updated screen
 */
export const screenReducer = (state, event, selectedNode) => {
    switch (event.type) {
        case PropertyChangedEvent.EVENT_NAME:
            return screenPropertyChanged(state, event, selectedNode);

        case ValidationRuleChangedEvent.EVENT_NAME:
            return validationRuleChanged(state, event, selectedNode);

        case SCREEN_EDITOR_EVENT_NAME.SCREEN_FIELD_ADDED:
            return addScreenField(state, event);

        case SCREEN_EDITOR_EVENT_NAME.SCREEN_ELEMENT_DELETED:
            return deleteScreenField(state, event);

        case SCREEN_EDITOR_EVENT_NAME.SCREEN_ELEMENT_MOVED:
            return moveScreenField(state, event);

        case SCREEN_EDITOR_EVENT_NAME.CHOICE_ADDED:
            return addChoice(state, event, selectedNode);

        case SCREEN_EDITOR_EVENT_NAME.CHOICE_CHANGED:
            return changeChoice(state, event, selectedNode);

        case SCREEN_EDITOR_EVENT_NAME.CHOICE_DELETED:
            return deleteChoice(state, event, selectedNode);

        case VALIDATE_ALL:
            return screenValidation.validateAll(state);

        case AddConditionEvent.EVENT_NAME:
            return addCondition(state, selectedNode, event);

        case UpdateConditionLogicEvent.EVENT_NAME:
            return updateConditionLogic(state, selectedNode, event);

        case DeleteConditionEvent.EVENT_NAME:
            return deleteCondition(state, selectedNode, event);

        case UpdateConditionEvent.EVENT_NAME:
            return updateCondition(state, selectedNode, event);

        case UseAdvancedOptionsSelectionChangedEvent.EVENT_NAME:
            return useAdvancedOptionsSelectionChanged(state, selectedNode, event.detail);

        case DynamicTypeMappingChangeEvent.EVENT_NAME:
            return setDynamicTypeMappingTypeValue(state, selectedNode, event);

        default:
            return state;
    }
};
