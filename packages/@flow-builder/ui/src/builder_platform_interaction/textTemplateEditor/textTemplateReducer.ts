// @ts-nocheck
import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { textTemplateValidation } from './textTemplateValidation';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { elementTypeToConfigMap } from 'builder_platform_interaction/elementConfig';

const NON_HYDRATABLE_PROPS = new Set([...elementTypeToConfigMap[ELEMENT_TYPE.TEXT_TEMPLATE].nonHydratableProperties]);

const textTemplatePropertyChanged = (textTemplate, action) => {
    const isHydrated = !NON_HYDRATABLE_PROPS.has(action.payload.propertyName);
    action.payload.error =
        action.payload.error === null
            ? textTemplateValidation.validateProperty(action.payload.propertyName, action.payload.value)
            : action.payload.error;
    return updateProperties(textTemplate, {
        [action.payload.propertyName]: isHydrated
            ? {
                  error: action.payload.error,
                  value: action.payload.value
              }
            : action.payload.value
    });
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
        default:
            return textTemplate;
    }
};
