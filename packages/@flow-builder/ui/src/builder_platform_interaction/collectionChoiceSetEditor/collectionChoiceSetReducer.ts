import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import { collectionChoiceSetValidation, validate } from './collectionChoiceSetValidation';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';

const manageUpdateProperty = (collectionChoice, action) => {
    if (!action.payload.doValidateProperty) {
        action.payload.error = null;
    } else {
        action.payload.error =
            action.payload.error === null
                ? collectionChoiceSetValidation().validateProperty(
                      action.payload.propertyName,
                      action.payload.value,
                      null
                  )
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
        case VALIDATE_ALL: {
            return validate(collectionChoice, action.showSecondSection);
        }
        default:
            return collectionChoice;
    }
};
