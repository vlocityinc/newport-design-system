import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { apexPluginValidation } from './apexPluginValidation';
import {
    UpdateParameterItemEvent,
    PropertyChangedEvent,
    DeleteParameterItemEvent
} from 'builder_platform_interaction/events';
import {
    updateParameterItem,
    mergeWithInputOutputParameters,
    removeUnsetParameters,
    deleteParameterItem,
    MERGE_WITH_PARAMETERS,
    REMOVE_UNSET_PARAMETERS
} from 'builder_platform_interaction/calloutEditorLib';

const apexPluginPropertyChanged = (state, event) => {
    const error =
        event.detail.error === null
            ? apexPluginValidation.validateProperty(
                  event.detail.propertyName,
                  event.detail.value
              )
            : event.detail.error;
    return updateProperties(state, {
        [event.detail.propertyName]: { value: event.detail.value, error }
    });
};

/**
 * Apex Plugin reducer, performs changes and validation on a apex plugin editor
 * @param {object} state  element / apex plugin node
 * @param {object} event  event to process
 * @returns {object}    the updated apex plugin node
 */
export const apexPluginReducer = (state, event) => {
    switch (event.type) {
        case PropertyChangedEvent.EVENT_NAME:
            return apexPluginPropertyChanged(state, event);
        case UpdateParameterItemEvent.EVENT_NAME:
            return updateParameterItem(state, event.detail);
        case DeleteParameterItemEvent.EVENT_NAME:
            return deleteParameterItem(state, event.detail);
        case MERGE_WITH_PARAMETERS:
            return mergeWithInputOutputParameters(state, event.detail);
        case REMOVE_UNSET_PARAMETERS:
            return removeUnsetParameters(state);
        case VALIDATE_ALL:
            return apexPluginValidation.validateAll(state);
        default:
            return state;
    }
};
