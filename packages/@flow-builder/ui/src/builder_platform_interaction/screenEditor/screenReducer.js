import { screenValidation, getExtensionParameterValidation, getRulesForField } from "./screenValidation";
import { VALIDATE_ALL } from "builder_platform_interaction/validationRules";
import { updateProperties, set, deleteItem, insertItem, replaceItem, mutateScreenField, hydrateWithErrors } from "builder_platform_interaction/dataMutationLib";
import { ReorderListEvent, PropertyChangedEvent, SCREEN_EDITOR_EVENT_NAME } from "builder_platform_interaction/events";
import { getScreenFieldTypeByName, createEmptyNodeOfType, isScreen, isExtensionField, getFerovTypeFromFieldType, compareValues } from "builder_platform_interaction/screenEditorUtils";
import { elementTypeToConfigMap } from "builder_platform_interaction/elementConfig";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";

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
 * Adds a chocie to a screenField.
 * @param {object} screen - The screen.
 * @param {event} event - The add choice event.
 * @param {object} field - The field that the choice should be added to.
 */
const addChoice = (screen, event, field) => {
    // New choices can only be added to the end of the list. The position number should never
    // be anything other than the the next available index.
    if (event.detail.position !== field.choiceReferences.length) {
        throw new Error("Position for new choice is invalid: " + event.detail.position);
    }

    const emptyChoice = '';
    const updatedChoices = insertItem(field.choiceReferences, emptyChoice, event.detail.position);
    const updatedField = set(field, 'choiceReferences', updatedChoices);

    // Replace the field in the screen
    const fieldPosition = screen.getFieldIndexByGUID(field.guid);
    const updatedFields =  replaceItem(screen.fields, updatedField, fieldPosition);
    return set(screen, 'fields', updatedFields);
};

/**
 * Change a choice of a screenField.
 * @param {*} screen - The screen.
 * @param {*} event - The change choice event.
 * @param {*} field - The field that the choice should be changed in.
 */
const changeChoice = (screen, event, field) => {
    if (event.detail.position > field.choiceReferences.length - 1 || event.detail.position < 0) {
        throw new Error("Invalid position for choice deletion: " + event.detail.position);
    }

    const updatedChoices = replaceItem(field.choiceReferences, event.detail.newValue.value, event.detail.position);
    const updatedField = set(field, 'choiceReferences', updatedChoices);

    // Replace the field in the screen
    const fieldPosition = screen.getFieldIndexByGUID(field.guid);
    const updatedFields =  replaceItem(screen.fields, updatedField, fieldPosition);
    return set(screen, 'fields', updatedFields);
};

/**
 * Delete a choice of a screenField.
 * @param {*} screen - The screen.
 * @param {*} event - The delete choice event.
 * @param {*} field - The field that the choice should be deleted from.
 */
const deleteChoice = (screen, event, field) => {
    const updatedChoices = deleteItem(field.choiceReferences, event.detail.position);
    const updatedField = set(field, 'choiceReferences', updatedChoices);

    // Replace the field in the screen
    const fieldPosition = screen.getFieldIndexByGUID(field.guid);
    const updatedFields =  replaceItem(screen.fields, updatedField, fieldPosition);
    return set(screen, 'fields', updatedFields);
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
 * @return {object} - The processed field
 */
const processFerovValueChange = (valueField, currentFieldDataType, defaultValueDataType, newValue, newValueGuid, typePropertyName) => {
    // Figure out if we need to update typePropertyName (typePropertyName can be null if value is null)
    const currentDataType =  currentFieldDataType || getFerovTypeFromFieldType(defaultValueDataType);
    if (currentDataType === 'reference') {
        if (!newValueGuid) { // Going from reference to literal
            valueField = updateProperties(valueField, {[typePropertyName]: defaultValueDataType});
        }
    } else if (currentDataType !== 'reference' && !!newValueGuid) { // Going from literal to reference
        valueField = updateProperties(valueField, {[typePropertyName]: 'reference'});
    }

    if (!newValue) { // New value is null, remove data type
        delete valueField[typePropertyName];
    } else if (!valueField[typePropertyName]) { // Coming from null value to non-null, add data type
        valueField[typePropertyName] = newValueGuid ? 'reference' : defaultValueDataType;
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
    const field = data.field;
    const rules = getRulesForField(field);
    const newValue = data.hydrated ? data.newValue.value : data.newValue; // TODO property must be hydrated here
    const error = data.error === null ? screenValidation.validateProperty(data.property, newValue, rules[data.property]) : data.error;
    if (error && data.hydrated) {
        data.newValue.error = error;
    }

    // Default value needs special handling because defaultValueDataType may need to be updated
    if (data.property === 'defaultValue') {
        // First update the value.
        // TODO: Hack: previewDefaultValue is needed for guid-devName swapping inconsistencies
        const updatedValueField = updateProperties(data.field, {'defaultValue': data.newValue, 'previewDefaultValue': data.newValue});

        // Now the defaultValue object.
        return processFerovValueChange(updatedValueField, data.field.defaultValueDataType, data.dataType || event.detail.defaultValueDataType,
            newValue, data.newValueGuid, 'defaultValueDataType');
    }

    return updateProperties(data.field, {[data.property]: data.newValue});
};

/**
 * Applies changes to the input/output parameters of an extension screen field
 *
 * @param {*} data - {field, property, currentValue, newValue, hydrated, error, newValueGuid, dataType, required}
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

    let field = data.field;
    const paramName = data.property.substring(prefix.length + 1); // + 1 to remove the dot
    let param = field[parametersPropName].find(p => (p.name && p.name.value ? p.name.value : p.name) === paramName);
    if (!param) {
        // Parameters that were never assigned a value are not present in the flow MD, let's create the param and add it
        param = {
            name: paramName,
            processMetadataValues:[],
            [paramPropertyName]: null
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
    let newParam = updateProperties(param, {[paramPropertyName]: data.newValue});
    const dataTypePropName = prefix === 'input' ? 'valueDataType' : 'assignToReferenceDataType';

    newParam = processFerovValueChange(newParam, newParam[dataTypePropName], data.dataType,
        newValue, data.newValueGuid, dataTypePropName);

    // Replace the new parameter in the parameters array
    const index = field[parametersPropName].indexOf(param);
    const updatedParams = replaceItem(field[parametersPropName], newParam, index);
    // Replace the parameters in the field
    return set(field, parametersPropName, updatedParams);
};

const isHydrated = (value) => {
    return value && value.hasOwnProperty('value') && value.hasOwnProperty('error');
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
    const hydrated = isHydrated(currentValue);

    if (hydrated) {
        if (!isHydrated(value)) {
            throw new Error('Current value is hydrated and new value is not' + JSON.stringify(event.detail));
        }
    } else if ((typeof currentValue === 'string' || typeof value === 'string') &&
                !elementTypeToConfigMap[ELEMENT_TYPE.SCREEN].nonHydratableProperties.includes(property)) {
        // Unless this property is on the blacklist, if it's a string, we should be hydrating it.
        throw new Error('String values have to be hydrated: ' + JSON.stringify(event.detail));
    }

    // Only update the field if the given property value actually changed.
    let updatedNode = selectedNode;
    if (compareValues(currentValue, value)) {
        if (isScreen(selectedNode)) {
            if (hydrated) {
                error = error === null ? screenValidation.validateProperty(property, value.value) : error;
                value.error = error;
            }
            updatedNode = updateProperties(screen, {[property]: value});
        } else { // Screen field
            const data = {
                field: selectedNode,
                property,
                currentValue,
                newValue: value,
                hydrated,
                error,
                newValueGuid: event.detail.guid,
                dataType: selectedNode.dataType || event.detail.valueDataType,
                required: event.detail.required
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

        case SCREEN_EDITOR_EVENT_NAME.CHOICE_ADDED:
            return addChoice(state, event, selectedNode);

        case SCREEN_EDITOR_EVENT_NAME.CHOICE_CHANGED:
            return changeChoice(state, event, selectedNode);

        case SCREEN_EDITOR_EVENT_NAME.CHOICE_DELETED:
            return deleteChoice(state, event, selectedNode);

        case VALIDATE_ALL:
            return screenValidation.validateAll(state);

        default: return state;
    }
};
