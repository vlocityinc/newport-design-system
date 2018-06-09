import { screenValidation } from './screen-validation';
import { VALIDATE_ALL } from 'builder_platform_interaction-validation-rules';
import { updateProperties, isItemHydratedWithErrors, set, deleteItem, insertItem } from 'builder_platform_interaction-data-mutation-lib';
import { ReorderListEvent, PropertyChangedEvent, SCREEN_EDITOR_EVENT_NAME } from 'builder_platform_interaction-events';
import { getScreenFieldTypeByName, createEmptyNodeOfType } from 'builder_platform_interaction-screen-editor-utils';

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

const addScreenField = (screen, event) => {
    const position = Number.isInteger(event.position) ? event.position : screen.fields.length;
    const typeName = event.typeName;
    const type = getScreenFieldTypeByName(typeName);
    const field = createEmptyNodeOfType(type);
    const updatedItems = insertItem(screen.fields, field, position);
    return set(screen, 'fields', updatedItems);
};

const deleteScreenField = (screen, event) => {
    const updatedItems = deleteItem(screen.fields, screen.getFieldIndex(event.screenElement));
    return set(screen, 'fields', updatedItems);
};

export const reorderFields = (state, event) => {
    let fields = state.fields;

    const destinationIndex = state.getFieldIndexByGUID(event.detail.destinationGuid);
    const movedField = state.getFieldByGUID(event.detail.sourceGuid);

    if (destinationIndex >= 0 && movedField) {
        fields = fields.filter((field) => {
            return field.guid !== event.detail.sourceGuid;
        });
        fields.splice(destinationIndex, 0, movedField);
    }
    return updateProperties(state, {fields});
};

/**
 * screen reducer function runs validation rules and returns back the updated screen element
 * @param {object} state - element / assignment node
 * @param {object} event - object containing type and payload eg: {type:'xyz', payload: {propertyName: '', value: '' , error: ''}}
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

