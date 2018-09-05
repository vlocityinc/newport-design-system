import { screenValidation } from './screen-validation';
import { VALIDATE_ALL } from 'builder_platform_interaction-validation-rules';
import { updateProperties, isItemHydratedWithErrors, set, deleteItem, insertItem, replaceItem, mutateScreenField, hydrateWithErrors } from 'builder_platform_interaction-data-mutation-lib';
import { ReorderListEvent, PropertyChangedEvent, SCREEN_EDITOR_EVENT_NAME } from 'builder_platform_interaction-events';
import { getScreenFieldTypeByName, createEmptyNodeOfType, isScreen, isExtensionField, getFerovTypeFromTypeName } from 'builder_platform_interaction-screen-editor-utils';
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

/**
 * Processes a Ferov change and makes sure the three properties used to describe the ferov value are in sync (dataType, dataGuid and the property itself)
 *
 * @param {object} valueField - The field to be processed (containing a ferov value)
 * @param {string} currentFieldDataType - The data type of the current value
 * @param {string} defaultValueDataType - The default data type of the ferov (the data type when it is not a reference)
 * @param {any} newValue - The new value of the ferov field
 * @param {string} newValueGuid - The guid of the new value (or null if it is not a reference)
 * @param {string} typePropertyName - The name of the data type property (assigned in ferov mutation)
 * @param {string} guidPropertyName  - The name of the data guid property (assigned in ferov mutation)
 * @return {object} - The processed field
 */
const processFerovValueChange = (valueField, currentFieldDataType, defaultValueDataType, newValue, newValueGuid, typePropertyName, guidPropertyName) => {
    // Figure out if we need to update typePropertyName (typePropertyName can be null if value is null)
    const currentDataType =  currentFieldDataType || getFerovTypeFromTypeName(defaultValueDataType);
    if (currentDataType === 'reference') {
        if (!newValueGuid) { // Going from reference to literal
            valueField = updateProperties(valueField, {[typePropertyName]: defaultValueDataType});
            delete valueField[guidPropertyName];
        } else { // Going from reference to reference
            valueField[guidPropertyName] = newValueGuid;
        }
    } else if (currentDataType !== 'reference' && !!newValueGuid) { // Going from literal to reference
        valueField = updateProperties(valueField, {[typePropertyName]: 'reference'});
        valueField[guidPropertyName] = newValueGuid;
    }

    if (!newValue) { // New value is null, remove data type
        delete valueField[typePropertyName];
    } else if (!valueField[typePropertyName]) { // Coming from null value to non-null, add data type
        valueField[typePropertyName] = newValueGuid ? 'reference' : currentDataType;
    }

    return valueField;
};

/**
 * Applies changes to a screen field
 *
 * @param {*} data - {field, property, currentValue, newValue, hydrated, error, newValueGuid, dataType}
 * @returns {screenfield} - The new screenfield after the change
 */
const handleScreenFieldPropertyChange = (data) => {
    // Non-extension screen field change

    // Run validation
    const type = data.field.type.name;
    const fullPropName = data.property !== 'name' ? 'fields[type.name="' + type + '"].' + data.property : 'name';
    const newValue = data.hydrated ? data.newValue.value : data.newValue;
    const error = data.error === null ? screenValidation.validateProperty(fullPropName, newValue) : data.error;
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
        const updatedValueField = updateProperties(data.field, {'defaultValue': data.newValue});
        return processFerovValueChange(updatedValueField, data.field.defaultValueDataType, data.dataType || event.detail.defaultValueDataType,
            newValue, data.newValueGuid, 'defaultValueDataType', 'defaultValueGuid');
    }

    return updateProperties(data.field, {[data.property]: data.newValue});
};

/**
 * Applies changes to the input/output parameters of an extension screen field
 *
 * @param {*} data - {field, property, currentValue, newValue, hydrated, error, newValueGuid, dataType}
 * @returns {screenfield} - The new screenfield after the change
 */
const handleExtensionFieldPropertyChange = (data) => {
    let prefix;
    let parametersPropName;
    let paramPropertyName;
    if (data.property.startsWith('input.')) {
        prefix = 'input';
        parametersPropName = 'inputParameters';
        paramPropertyName = 'value';
    } else if (data.property.startsWith('output.')) {
        prefix = 'output';
        parametersPropName = 'outputParameters';
        paramPropertyName = 'assignToReference';
    } else {
        throw new Error('Unknown parameter type: ' + data.property);
    }

    const paramName = data.property.substring(prefix.length + 1); // + 1 to remove the dot
    const param = data.field[parametersPropName].find(p => (p.name && p.name.value ? p.name.value : p.name) === paramName);
    if (param) {
        const newValue = data.hydrated ? data.newValue.value : data.newValue;
        // TODO how do we validate dynamic property names?
        const error = data.error === null ? screenValidation.validateProperty(data.property, newValue) : data.error;
        if (error && data.hydrated) {
            data.newValue.error = error;
        }

        // Replace the property in the parameter
        let newParam = updateProperties(param, {[paramPropertyName]: data.newValue});
        const dataTypePropName = prefix === 'input' ? 'valueDataType' : 'assignToReferenceDataType';
        const dataGuidPropName = prefix === 'input' ? 'valueGuid' : 'assignToReferenceGuid';

        newParam = processFerovValueChange(newParam, newParam[dataTypePropName], data.dataType,
            newValue, data.newValueGuid, dataTypePropName, dataGuidPropName);

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
            const data = {
                field: selectedNode,
                property,
                currentValue,
                newValue,
                hydrated,
                error,
                newValueGuid: event.detail.guid,
                dataType: selectedNode.dataType || event.detail.valueDataType
            };
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
