import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import { collectionChoiceSetValidation, getRules } from './collectionChoiceSetValidation';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';

const manageUpdateProperty = (collectionChoice, action) => {
    // Validate
    if (!action.payload.doValidateProperty) {
        action.payload.error = null;
    } else {
        action.payload.error =
            action.payload.error === null
                ? collectionChoiceSetValidation.validateProperty(action.payload.propertyName, action.payload.value, [])
                : action.payload.error;
    }

    return Object.assign({}, collectionChoice, {
        [action.payload.propertyName]: {
            error: action.payload.error,
            value: action.payload.value
        }
    });
};

export const collectionChoiceSetReducer = (collectionChoice, action) => {
    switch (action.type) {
        case PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY:
            return manageUpdateProperty(collectionChoice, action);
        case VALIDATE_ALL:
            return collectionChoiceSetValidation.validateAll(
                collectionChoice,
                getRules(collectionChoice, action.showSecondSection)
            );
        default:
            return collectionChoice;
    }
};
