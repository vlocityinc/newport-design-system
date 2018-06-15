import { screenValidation } from './screen-validation';
import { VALIDATE_ALL } from 'builder_platform_interaction-validation-rules';
import { updateProperties, isItemHydratedWithErrors, set, deleteItem, insertItem, mutateScreenField } from 'builder_platform_interaction-data-mutation-lib';
import { ReorderListEvent, PropertyChangedEvent, SCREEN_EDITOR_EVENT_NAME } from 'builder_platform_interaction-events';
import { getScreenFieldTypeByName, createEmptyNodeOfType } from 'builder_platform_interaction-screen-editor-utils';

/**
 * Handles changes in properties in the screen.
 * @param {object} state - The screen
 * @param {event} event - The property changed event
 * @returns {object} - A new screen with the changes applied
 */
const screenPropertyChanged = (state, event) => {
    let error = event.detail.error;
    const property = event.detail.propertyName;
    const value = event.detail.value;

    const currentValue = event.detail.oldValue || state[property];
    const hydrated = isItemHydratedWithErrors(currentValue);
    if (value !== (hydrated ? currentValue.value : currentValue)) {
        error = error === null ? screenValidation.validateProperty(property, value) : error;
        const newValue = hydrated ? {error, value} : value;
        return updateProperties(state, {[property]: newValue});
    }

    return state;
};

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
    mutateScreenField(field);
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
 * Screen reducer function, performs changes and validation on a screen and returns the updated (new) screen element
 * @param {object} state - element / screen node
 * @param {object} event - event to process
 * @returns {object} screen - the updated screen
 */
export const screenReducer = (state, event) => {
    switch (event.type) {
        case PropertyChangedEvent.EVENT_NAME:
            return screenPropertyChanged(state, event);

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

