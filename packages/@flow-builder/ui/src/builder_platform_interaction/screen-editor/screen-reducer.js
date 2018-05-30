import { screenValidation } from './screen-validation';
import { VALIDATE_ALL } from 'builder_platform_interaction-validation-rules';
import { updateProperties, isItemHydratedWithErrors, set, deleteItem } from 'builder_platform_interaction-data-mutation-lib';
import { PropertyChangedEvent, screenEventNames } from 'builder_platform_interaction-events';

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

        default: return state;
    }
};
