import { scheduleTriggerValidation } from './scheduleTriggerValidation';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { elementTypeToConfigMap } from 'builder_platform_interaction/elementConfig';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import { updateProperties } from 'builder_platform_interaction/dataMutationLib';

const NON_HYDRATABLE_PROPS = new Set([...elementTypeToConfigMap[ELEMENT_TYPE.START_ELEMENT].nonHydratableProperties]);

const propertyChanged = (state, event) => {
    if (!event.detailignoreValidate) {
        event.detail.error =
            event.detail.error === null
                ? scheduleTriggerValidation.validateProperty(event.detail.propertyName, event.detail.value, null, state)
                : event.detail.error;
    }

    //  filtering out non-hydratable properties
    if (!NON_HYDRATABLE_PROPS.has(event.detail.propertyName)) {
        state = updateProperties(state, {
            [event.detail.propertyName]: {
                error: event.detail.error,
                value: event.detail.value
            }
        });
    }

    return state;
};

/**
 * Schedule trigger reducer function
 * @param {object} state - element / start node
 * @param {object} event - object containing type and payload eg: {type:'xyz', payload: {propertyName: '', value: '' , error: ''}}
 * @returns {object} start - new start node instance with mutations
 */
export const scheduleTriggerReducer = (state, event) => {
    switch (event.type) {
        case PropertyChangedEvent.EVENT_NAME:
            return propertyChanged(state, event);
        case VALIDATE_ALL: {
            return scheduleTriggerValidation.validateAll(state);
        }
        default:
            return state;
    }
};
