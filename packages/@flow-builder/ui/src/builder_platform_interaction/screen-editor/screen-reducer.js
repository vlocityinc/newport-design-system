import { screenValidation } from './screen-validation';
import { VALIDATE_ALL } from 'builder_platform_interaction-validation-rules';
import { updateProperties, isItemHydratedWithErrors, set, deleteItem } from 'builder_platform_interaction-data-mutation-lib';
import { ReorderListEvent, PropertyChangedEvent, screenEventNames } from 'builder_platform_interaction-events';


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

const deleteScreenField = (screen, event) => {
    const updatedItems = deleteItem(screen.fields, screen.getFieldIndex(event.screenElement));
    return set(screen, 'fields', updatedItems);
};

export const reorderFields = (state, event) => {
    let fields = state.fields;

    const destinationIndex = state.fields.findIndex((element) => {
        return element.guid === event.detail.destinationGuid;
    });

    const movedField = fields.find((field) => {
        return field.guid === event.detail.sourceGuid;
    });
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

        case screenEventNames.screenElementDeletedEvent:
            return deleteScreenField(state, event);

        case VALIDATE_ALL:
            return screenValidation.validateAll(state);

        case ReorderListEvent.EVENT_NAME:
            return reorderFields(state, event);

        default: return state;
    }
};

