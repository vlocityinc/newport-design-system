import {
    screenValidation,
    getExtensionParameterValidation,
    getRulesForField
} from './screenValidation';
import {
    VALIDATE_ALL,
    isUniqueDevNameInStore
} from 'builder_platform_interaction/validationRules';
import { conditionListReducer } from 'builder_platform_interaction/conditionListReducer';
import {
    updateProperties,
    set,
    deleteItem,
    insertItem,
    replaceItem,
    hydrateWithErrors
} from 'builder_platform_interaction/dataMutationLib';
import {
    ReorderListEvent,
    PropertyChangedEvent,
    ValidationRuleChangedEvent,
    SCREEN_EDITOR_EVENT_NAME,
    AddConditionEvent,
    UpdateConditionLogicEvent,
    DeleteConditionEvent,
    UpdateConditionEvent
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
    compareValues,
    EXTENSION_PARAM_PREFIX
} from 'builder_platform_interaction/screenEditorUtils';
import { generateGuid } from 'builder_platform_interaction/storeLib';

const updateFieldInScreen = (screen, field, newField) => {
    // Replace the field in the screen
    const fieldPosition = screen.getFieldIndexByGUID(field.guid);
    const updatedItems = replaceItem(screen.fields, newField, fieldPosition);

    // Replace the fields in the screen
    return set(screen, 'fields', updatedItems);
};

const updateField = (screen, field, properties) => {
    const updatedField = updateProperties(field, properties);
    return updateFieldInScreen(screen, field, updatedField);
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
    const visibilityRule = conditionListReducer(
        field.visibilityRule,
        event,
        new Map(),
        ''
    );
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

const isHydrated = value => {
    return (
        value && value.hasOwnProperty('value') && value.hasOwnProperty('error')
    );
};

/**
 * Adds screen fields to a screen.
 * @param {object} screen - The screen
 * @param {event} event - The add screen field event
 * @returns {object} - A new screen with the changes applied
 */
const addScreenField = (screen, event) => {
    // Figure out if the field be added to the end or somewhere in between.
    const position = Number.isInteger(event.position)
        ? event.position
        : screen.fields.length;
    const field = createEmptyScreenFieldOfType(event.typeName);

    hydrateWithErrors(
        field,
        elementTypeToConfigMap[ELEMENT_TYPE.SCREEN].nonHydratableProperties
    );
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
        throw new Error(
            'Position for new choice is invalid: ' + event.detail.position
        );
    }

    const emptyChoice = hydrateWithErrors(createChoiceReference());
    const updatedChoices = insertItem(
        field.choiceReferences,
        emptyChoice,
        event.detail.position
    );
    const updatedField = set(field, 'choiceReferences', updatedChoices);

    // Replace the field in the screen
    const fieldPosition = screen.getFieldIndexByGUID(field.guid);
    const updatedFields = replaceItem(
        screen.fields,
        updatedField,
        fieldPosition
    );
    return set(screen, 'fields', updatedFields);
};

/**
 * Change a choice of a screenField.
 * @param {*} screen - The screen.
 * @param {*} event - The change choice event.
 * @param {*} field - The field that the choice should be changed in.
 */
const changeChoice = (screen, event, field) => {
    if (
        event.detail.position > field.choiceReferences.length - 1 ||
        event.detail.position < 0
    ) {
        throw new Error(
            'Invalid position for choice deletion: ' + event.detail.position
        );
    }

    const originalChoice = field.choiceReferences[event.detail.position];

    const hydratedChoice = hydrateWithErrors(
        createChoiceReference(event.detail.newValue.value)
    );
    hydratedChoice.choiceReference.error = event.detail.newValue.error;
    const updatedChoices = replaceItem(
        field.choiceReferences,
        hydratedChoice,
        event.detail.position
    );
    const updatedField = set(field, 'choiceReferences', updatedChoices);

    // If default value was set for this field, check to see if its set to the choice that was just
    // changed. If it was, then clear the default value as it may no longer be valid.
    if (
        field.defaultSelectedChoiceReference &&
        field.defaultSelectedChoiceReference.value
    ) {
        if (
            field.defaultSelectedChoiceReference.value ===
            originalChoice.choiceReference.value
        ) {
            updatedField.defaultSelectedChoiceReference.value = null;
        }
    }

    // Replace the field in the screen
    const fieldPosition = screen.getFieldIndexByGUID(field.guid);
    const updatedFields = replaceItem(
        screen.fields,
        updatedField,
        fieldPosition
    );
    return set(screen, 'fields', updatedFields);
};

/**
 * Delete a choice of a screenField.
 * @param {*} screen - The screen.
 * @param {*} event - The delete choice event.
 * @param {*} field - The field that the choice should be deleted from.
 */
const deleteChoice = (screen, event, field) => {
    const originalChoice = field.choiceReferences[event.detail.position];
    const updatedChoices = deleteItem(
        field.choiceReferences,
        event.detail.position
    );
    const updatedField = set(field, 'choiceReferences', updatedChoices);

    // If default value was set for this field, check to see if its set to the choice that was just
    // delete. If it was, then clear the default value as it may no longer be valid.
    if (
        field.defaultSelectedChoiceReference &&
        field.defaultSelectedChoiceReference.value
    ) {
        if (
            field.defaultSelectedChoiceReference.value ===
            originalChoice.choiceReference.value
        ) {
            updatedField.defaultSelectedChoiceReference.value = null;
        }
    }

    // Replace the field in the screen
    const fieldPosition = screen.getFieldIndexByGUID(field.guid);
    const updatedFields = replaceItem(
        screen.fields,
        updatedField,
        fieldPosition
    );
    return set(screen, 'fields', updatedFields);
};

/**
 * Deletes screen fields to a screen.
 * @param {object} screen - The screen
 * @param {event} event - The delete screen field event
 * @returns {object} - A new screen with the changes applied
 */
const deleteScreenField = (screen, event) => {
    const updatedItems = deleteItem(
        screen.fields,
        screen.getFieldIndex(event.screenElement)
    );
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

    const destinationIndex = screen.getFieldIndexByGUID(
        event.detail.destinationGuid
    );
    const movedField = screen.getFieldByGUID(event.detail.sourceGuid);

    if (destinationIndex >= 0 && movedField) {
        fields = fields.filter(field => {
            return field.guid !== event.detail.sourceGuid;
        });
        fields.splice(destinationIndex, 0, movedField);
    }
    return updateProperties(screen, { fields });
};

/**
 * Processes a Ferov change and makes sure the three properties used to describe the ferov value are in sync (dataType, dataGuid and the property itself)
 *
 * @param {object} valueField - The field to be processed (containing a ferov value)
 * @param {string} ferovDataType - The data type of the value being placed into the field
 * @param {string} typePropertyName - The name of the data type property (assigned in ferov mutation)
 * @return {object} - The processed field
 */
const processFerovValueChange = (
    valueField,
    ferovDataType,
    typePropertyName
) => {
    return updateProperties(valueField, { [typePropertyName]: ferovDataType });
};

/**
 * Applies changes to a screen field
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
            ? screenValidation.validateProperty(
                  data.property,
                  newValue,
                  rules[data.property]
              )
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
        return processFerovValueChange(
            updatedValueField,
            data.ferovDataType,
            'defaultValueDataType'
        );
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
        param = field[parametersPropName].find(
            p => (p.name && p.name.value ? p.name.value : p.name) === paramName
        );
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

        hydrateWithErrors(
            param,
            elementTypeToConfigMap[ELEMENT_TYPE.SCREEN].nonHydratableProperties
        );
        const updatedParams = insertItem(
            field[parametersPropName],
            param,
            field[parametersPropName].length
        );
        field = set(field, parametersPropName, updatedParams);
    }

    const newValue = data.hydrated ? data.newValue.value : data.newValue;
    let error = data.error;
    if (!error) {
        const paramValidation = getExtensionParameterValidation(
            'parameterValue',
            data.dataType,
            data.required
        );
        error = paramValidation.validateProperty('parameterValue', newValue);
    }

    if (error && data.hydrated) {
        data.newValue.error = error;
    }

    // Replace the property in the parameter
    let updatedParams = null;
    const index = field[parametersPropName].indexOf(param);
    if (!data.newValue.value && !data.newValue.error) {
        // User cleared the value and we are fine with that, let's remove the parameter
        updatedParams = deleteItem(field[parametersPropName], index);
    } else {
        // Replace the property in the parameter
        const newParamValue = data.newValueGuid
            ? { value: data.newValueGuid, error: data.newValue.error }
            : data.newValue; // If it is a reference store the guid, not the devName
        let newParam = updateProperties(param, { value: newParamValue });
        const dataTypePropName = 'valueDataType';

        newParam = processFerovValueChange(
            newParam,
            data.ferovDataType,
            dataTypePropName
        );

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
            screenValidation.validateFieldNameUniquenessLocally(
                screen,
                newValueForProperty,
                screenfield.guid
            ) ||
            isUniqueDevNameInStore(newValueForProperty, [
                event.detail.guid || screenfield.guid
            ]);
    }

    // If the default value is being cleared out, the dataType associated with the new value should be set
    // to undefined because we want to clear that property.
    if (
        newValueForProperty === undefined ||
        newValueForProperty === null ||
        newValueForProperty === ''
    ) {
        data.dataType = undefined;
    }

    let newField = null;
    if (isExtensionField(screenfield) && data.property !== 'name') {
        newField = handleExtensionFieldPropertyChange(
            data,
            event.detail.attributeIndex
        );
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
    const hydrated = isHydrated(currentValue);

    if (hydrated) {
        if (!isHydrated(value)) {
            throw new Error(
                'Current value is hydrated and new value is not' +
                    JSON.stringify(event.detail)
            );
        }
    } else if (
        (typeof currentValue === 'string' || typeof value === 'string') &&
        !elementTypeToConfigMap[
            ELEMENT_TYPE.SCREEN
        ].nonHydratableProperties.includes(property)
    ) {
        // Unless this property is on the blacklist, if it's a string, we should be hydrating it.
        throw new Error(
            'String values have to be hydrated: ' + JSON.stringify(event.detail)
        );
    }

    // Only update the field if the given property value actually changed.
    let updatedNode = selectedNode;
    if (compareValues(currentValue, value, true)) {
        if (isScreen(selectedNode)) {
            if (hydrated) {
                value.error =
                    error ||
                    screenValidation.validateProperty(property, value.value);
                if (value.error === null && property === 'name' && screen) {
                    value.error = screenValidation.validateFieldNameUniquenessLocally(
                        screen,
                        value.value,
                        screen.guid
                    );
                }
            }

            updatedNode = updateProperties(screen, { [property]: value });

            if (
                property === 'allowPause' &&
                !value &&
                screen.pausedText.error
            ) {
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
                dataType:
                    selectedNode.dataType ||
                    event.detail.valueDataType ||
                    event.detail.defaultValueDataType,
                ferovDataType: event.detail.dataType,
                required: event.detail.required
            };

            updatedNode = handleScreenFieldPropertyChange(
                data,
                screen,
                event,
                selectedNode
            );
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
        compareValues(
            newRule.formulaExpression,
            currentRule.formulaExpression,
            true
        ) ||
        compareValues(newRule.errorMessage, currentRule.errorMessage, true)
    ) {
        // Run validation
        const validate = (property, element, rules) => {
            const value = element[property];
            const propertyRules = rules.validationRule[property];
            value.error =
                value.error === null
                    ? screenValidation.validateProperty(
                          property,
                          value.value,
                          propertyRules
                      )
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

        case AddConditionEvent.EVENT_NAME:
            return addCondition(state, selectedNode, event);

        case UpdateConditionLogicEvent.EVENT_NAME:
            return updateConditionLogic(state, selectedNode, event);

        case DeleteConditionEvent.EVENT_NAME:
            return deleteCondition(state, selectedNode, event);

        case UpdateConditionEvent.EVENT_NAME:
            return updateCondition(state, selectedNode, event);

        default:
            return state;
    }
};
