import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { textTemplateValidation } from './textTemplateValidation';

/**
 * Text template reducer function runs validation rules and returns back the updated variable
 * @param {object} textTemplate - element / node state
 * @param {object} action - object containing type and payload eg: {type:"xyz", payload: {propertyName: '', value: '' , error: ''}}
 * @returns {object} textTemplate - updated text template
 */
export const textTemplateReducer = (textTemplate, action) => {
    switch (action.type) {
        case PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY: {
            const propertyValue = {error: action.payload.error, value: action.payload.value};
            return updateProperties(textTemplate, {[action.payload.propertyName]: propertyValue});
        }
        case VALIDATE_ALL:
            return textTemplateValidation.validateAll(textTemplate);
        default: return textTemplate;
    }
};