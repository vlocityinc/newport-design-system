import {
    deleteItem,
    hydrateWithErrors,
    replaceItem,
    updateProperties
} from 'builder_platform_interaction/dataMutationLib';
import {
    DeleteConditionEvent,
    DeleteParameterItemEvent,
    PropertyChangedEvent,
    UpdateConditionEvent,
    UpdateParameterItemEvent,
    ValueChangedEvent
} from 'builder_platform_interaction/events';
import { createCondition, StageStep } from 'builder_platform_interaction/elementFactory';
import {
    deleteParameterItem,
    MERGE_WITH_PARAMETERS,
    mergeWithInputOutputParameters,
    REMOVE_UNSET_PARAMETERS,
    removeUnsetParameters,
    updateParameterItem
} from 'builder_platform_interaction/calloutEditorLib';
import { InvocableAction } from 'builder_platform_interaction/invocableActionLib';
import { ACTION_TYPE, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

const itemPropertyChanged = (state: StageStep, event: CustomEvent): StageStep => {
    event.detail.guid = state.guid;
    // validateProperty(state, event);
    return updateProperties(state, {
        [event.detail.propertyName]: {
            error: event.detail.error,
            value: event.detail.value
        }
    });
};

const actionChanged = (state: StageStep, event: ValueChangedEvent<InvocableAction>): StageStep => {
    if (event.detail.value) {
        // validateProperty(state, event);

        const actionName: string = (<InvocableAction>event.detail.value).actionName;

        return updateProperties(state, {
            action: hydrateWithErrors({
                elementType: ELEMENT_TYPE.ACTION_CALL,
                actionType: ACTION_TYPE.CREATE_WORK_ITEM,
                actionName
            })
        });
    }

    return state;
};

/**
 * Updates an entry criteria
 */
const updateEntryCriteria = (state: StageStep, event: UpdateConditionEvent): StageStep => {
    const newEntryCriteria = hydrateWithErrors(createCondition(event.detail.value));

    if (state.entryConditions.length > 0) {
        return updateProperties(state, {
            entryConditions: replaceItem(state.entryConditions, newEntryCriteria, event.detail.index)
        });
    }

    return updateProperties(state, {
        entryConditions: [newEntryCriteria]
    });
};

/**
 * delete entry criteria
 */
const deleteEntryCriteria = (state: StageStep, event: DeleteConditionEvent): StageStep => {
    return updateProperties(state, {
        entryConditions: deleteItem(state.entryConditions, event.detail.index)
    });
};

/**
 * orchestratedStage reducer function runs validation rules and returns back the updated element state
 */
export const stageStepReducer = (state: StageStep, event: CustomEvent): StageStep => {
    switch (event.type) {
        case UpdateConditionEvent.EVENT_NAME:
            return updateEntryCriteria(state, event);
        case DeleteConditionEvent.EVENT_NAME:
            return deleteEntryCriteria(state, event);
        case ValueChangedEvent.EVENT_NAME:
            return actionChanged(state, event);
        case PropertyChangedEvent.EVENT_NAME:
            return itemPropertyChanged(state, event);
        case REMOVE_UNSET_PARAMETERS:
            return removeUnsetParameters(state);
        case MERGE_WITH_PARAMETERS:
            return mergeWithInputOutputParameters(state, event.detail);
        case UpdateParameterItemEvent.EVENT_NAME:
            return updateParameterItem(state, event.detail);
        case DeleteParameterItemEvent.EVENT_NAME:
            return deleteParameterItem(state, event.detail);
        default:
            return state;
    }
};
