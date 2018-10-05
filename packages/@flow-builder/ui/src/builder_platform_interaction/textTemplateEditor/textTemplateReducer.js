import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { textTemplateValidation } from './textTemplateValidation';

const textTemplatePropertyChanged = (textTemplate, action) => {
    action.payload.error = action.payload.error === null ? textTemplateValidation.validateProperty(action.payload.propertyName, action.payload.value) : action.payload.error;
    return updateProperties(textTemplate, {[action.payload.propertyName]: {error: action.payload.error, value: action.payload.value}});
};

/**
 * Text template reducer function runs validation rules and returns back the updated variable
 * @param {object} textTemplate - element / node state
 * @param {object} action - object containing type and payload eg: {type:"xyz", payload: {propertyName: '', value: '' , error: ''}}
 * @returns {object} textTemplate - updated text template
 */
export const textTemplateReducer = (textTemplate, action) => {
    switch (action.type) {
        case PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY:
            return textTemplatePropertyChanged(textTemplate, action);
        case VALIDATE_ALL:
            return textTemplateValidation.validateAll(textTemplate);
        default: return textTemplate;
    }
};