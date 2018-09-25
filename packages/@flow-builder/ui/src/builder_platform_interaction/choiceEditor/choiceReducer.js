import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { choiceValidation } from './choiceValidation';

const dataTypeChanged = (state, action) => {
    const value = action.payload.value;
    const updatedValues = {
        dataType : { error: null, value: value.dataType }
    };

    if (value.dataType === 'Boolean') {
        updatedValues.isShowInputSelected = false;
        updatedValues.isValidateSelected = false;
        updatedValues.userInput = undefined;
    }
    return updateProperties(state, updatedValues);
};

export const choiceReducer = (choice, action) => {
    switch (action.type) {
        case PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY: {
            let propertyValue;
            if (typeof (action.payload.value) === 'string' || action.payload.value === null) {
                action.payload.error = action.payload.error === null ?
                    choiceValidation.validateProperty(action.payload.propertyName, action.payload.value) : action.payload.error;
                propertyValue = {error: action.payload.error, value: action.payload.value};
            } else {
                propertyValue = action.payload.value;
            }

            return updateProperties(choice, {[action.payload.propertyName]: propertyValue});
        }
        case PROPERTY_EDITOR_ACTION.CHANGE_DATA_TYPE:
            return dataTypeChanged(choice, action);
        case VALIDATE_ALL:
            return choiceValidation.validateAll(choice);
        default: return choice;
    }
};