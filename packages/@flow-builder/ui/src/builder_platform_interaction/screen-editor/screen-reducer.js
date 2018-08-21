import { screenValidation } from './screen-validation';
import { VALIDATE_ALL } from 'builder_platform_interaction-validation-rules';
import { updateProperties, isItemHydratedWithErrors, set, deleteItem, insertItem, replaceItem, mutateScreenField, hydrateWithErrors } from 'builder_platform_interaction-data-mutation-lib';
import { ReorderListEvent, PropertyChangedEvent, SCREEN_EDITOR_EVENT_NAME } from 'builder_platform_interaction-events';
import { getScreenFieldTypeByName, createEmptyNodeOfType, isScreen, isExtensionField } from 'builder_platform_interaction-screen-editor-utils';
import { elementTypeToConfigMap } from 'builder_platform_interaction-element-config';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';

/**
 * Adds screen fields to a screen.
 * @param {object} screen - The screen
 * @param {event} event - The add screen field event
 * @returns {object} - A new screen with the changes applied
 */
const addScreenField = (screen, event) => {
    // Figure out if the field be added to the end or somewhere in between.
    const position = Number.isInteger(event.position) ? event.position : screen.fields.length;
    const type = getScreenFieldTypeByName(event.typeName);
    const field = createEmptyNodeOfType(type);
    hydrateWithErrors(mutateScreenField(field), elementTypeToConfigMap[ELEMENT_TYPE.SCREEN].nonHydratableProperties);
    const updatedItems = insertItem(screen.fields, field, position);
    return set(screen, 'fields', updatedItems);
};

/**
 * Deletes screen fields to a screen.
 * @param {object} screen - The screen
 * @param {event} event - The delete screen field event
 * @returns {object} - A new screen with the changes applied
 */
const deleteScreenField = (screen, event) => {
    const updatedItems = deleteItem(screen.fields, screen.getFieldIndex(event.screenElement));
    return set(screen, 'fields', updatedItems);
};

/**
 * Rearranges fields in a screen.
 * @param {object} screen - The screen
 * @param {event} event - The add screen field event
 * @returns {object} - A new screen with the changes applied
 */
const reorderFields = (screen, event) => {
    let fields = screen.fields;

    const destinationIndex = screen.getFieldIndexByGUID(event.detail.destinationGuid);
    const movedField = screen.getFieldByGUID(event.detail.sourceGuid);

    if (destinationIndex >= 0 && movedField) {
        fields = fields.filter((field) => {
            return field.guid !== event.detail.sourceGuid;
        });
        fields.splice(destinationIndex, 0, movedField);
    }
    return updateProperties(screen, {fields});
};

const handleScreenFieldPropertyChange = (data) => {
    // Non-extension screen field change

    // Run validation
    const type = data.field.type.name;
    const fullPropName = data.property !== 'name' ? 'fields[type.name="' + type + '"].' + data.property : 'name';
    const error = data.error === null ? screenValidation.validateProperty(fullPropName, data.currentValue) : data.error;
    if (error && data.hydrated) {
        data.newValue.error = error;
    }

    // If the validation rule's error message or formula expression was changed, it needs special handling
    // because it's an object within the field.
    if (data.property === 'validationRule.errorMessage') {
        const validationRuleProp = 'validationRule';
        const errorMessageProp = 'errorMessage';
        const newErrorMessage = updateProperties(data.field[validationRuleProp], {[errorMessageProp]: data.newValue});
        return updateProperties(data.field, {[validationRuleProp]: newErrorMessage});
    } else if (data.property === 'validationRule.formulaExpression') {
        const validationRuleProp = 'validationRule';
        const formulaProp = 'formulaExpression';
        const newFormula = updateProperties(data.field[validationRuleProp], {[formulaProp]: data.newValue});
        return updateProperties(data.field, {[validationRuleProp]: newFormula});
    } else if (data.property === 'defaultValue') {
        // Default value needs special handling because defaultValueDataType may need to be updated

        // First update the value
        let updatedValueField = updateProperties(data.field, {'defaultValue': data.newValue});

        // Figure out if we need to update defaultValueDataType
        const currentDataType = data.field.defaultValueDataType;
        const newValueGuid = data.newValueGuid;
        if (currentDataType === 'reference' && !newValueGuid) { // Going from reference to literal?
            updatedValueField = updateProperties(updatedValueField, {'defaultValueDataType': data.field.dataType});
            delete updatedValueField.defaultValueGuid;
        } else if (currentDataType !== 'reference' && !!newValueGuid) { // Going from literal to reference ?
            updatedValueField = updateProperties(updatedValueField, {'defaultValueDataType': 'reference'});
            updatedValueField.defaultValueGuid = newValueGuid;
        }

        return updatedValueField;
    }

    return updateProperties(data.field, {[data.property]: data.newValue});
};

const handleExtensionFieldPropertyChange = (data) => {
    // input/output param validation
    let prefix;
    let parametersPropName;
    let paramPropertyName;
    if (data.property.startsWith('input.')) {
        prefix = 'input.';
        parametersPropName = 'inputParameters';
        paramPropertyName = 'value';
    } else if (data.property.startsWith('output.')) {
        prefix = 'output.';
        parametersPropName = 'outputParameters';
        paramPropertyName = 'assignToReference';
    } else {
        throw new Error('Unknown parameter type: ' + data.property);
    }

    const paramName = data.property.substring(prefix.length);
    const param = data.field[parametersPropName].find(p => (p.name && p.name.value ? p.name.value : p.name) === paramName);
    if (param) {
        // const error = data.error === null ? screenValidation.validateProperty(fullPropName, data.currentValue) : data.error; // TODO  W-4947239 validation??

        // Replace the property in the parameter
        const newParam = updateProperties(param, {[paramPropertyName]: data.newValue});
        // Replace the new parameter in the parameters array
        const index = data.field[parametersPropName].indexOf(param);
        const updatedParams = replaceItem(data.field[parametersPropName], newParam, index);
        // Replace the parameters in the field
        return set(data.field, parametersPropName, updatedParams);
    }

    return null;
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

    let error = event.detail.error;
    const value = event.detail.value;
    const currentValue = event.detail.oldValue || selectedNode[property];
    const hydrated = isItemHydratedWithErrors(currentValue);

    // Only update the field if the given property value actually changed.
    let updatedNode = selectedNode;
    if (value !== (hydrated ? currentValue.value : currentValue)) {
        const newValue = hydrated ? {error, value} : value;
        if (isScreen(selectedNode)) {
            error = error === null ? screenValidation.validateProperty(property, value) : error;
            if (hydrated) {
                newValue.error = error;
            }
            updatedNode = updateProperties(screen, {[property]: newValue});
        } else { // Screen field
            const data = {property, field: selectedNode, currentValue, newValue, hydrated, error, newValueGuid: event.detail.guid};
            let newField = null;
            if (isExtensionField(selectedNode) && property !== 'name') {
                newField = handleExtensionFieldPropertyChange(data);
            } else {
                newField = handleScreenFieldPropertyChange(data);
            }

            // Replace the field in the screen
            const fieldPosition = screen.getFieldIndexByGUID(selectedNode.guid);
            const updatedItems =  replaceItem(screen.fields, newField, fieldPosition);

            // Replace the fields in the screen
            updatedNode = set(screen, 'fields', updatedItems);
        }
    } else {
        // If nothing changed, return the screen, unchanged.
        return screen;
    }
    return updatedNode;
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

        case SCREEN_EDITOR_EVENT_NAME.SCREEN_FIELD_ADDED:
            return addScreenField(state, event);

        case SCREEN_EDITOR_EVENT_NAME.SCREEN_ELEMENT_DELETED:
            return deleteScreenField(state, event);

        case ReorderListEvent.EVENT_NAME:
            return reorderFields(state, event);

        case VALIDATE_ALL:
            return screenValidation.validateAll(state);

        default: return state;
    }
};
