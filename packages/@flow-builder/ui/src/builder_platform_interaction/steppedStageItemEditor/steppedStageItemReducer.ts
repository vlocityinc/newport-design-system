import {
    deleteItem,
    hydrateWithErrors,
    replaceItem,
    updateProperties
} from 'builder_platform_interaction/dataMutationLib';
import { DeleteConditionEvent, PropertyChangedEvent, UpdateConditionEvent } from 'builder_platform_interaction/events';
import { createCondition, SteppedStageItem } from 'builder_platform_interaction/elementFactory';

const itemPropertyChanged = (state, event: CustomEvent): SteppedStageItem => {
    event.detail.guid = state.guid;
    // validateProperty(state, event);
    return updateProperties(state, {
        [event.detail.propertyName]: {
            error: event.detail.error,
            value: event.detail.value
        }
    });
};

/**
 * Updates an entry criteria
 */
const updateEntryCriteria = (state: SteppedStageItem, event: UpdateConditionEvent) => {
    const newEntryCriteria = hydrateWithErrors(createCondition(event.detail.value));

    if (state.entryCriteria.length > 0) {
        return updateProperties(state, {
            entryCriteria: replaceItem(state.entryCriteria, newEntryCriteria, event.detail.index)
        });
    }

    return updateProperties(state, {
        entryCriteria: [newEntryCriteria]
    });
};

/**
 * delete entry criteria
 */
const deleteEntryCriteria = (state: SteppedStageItem, event: DeleteConditionEvent) => {
    return updateProperties(state, {
        entryCriteria: deleteItem(state.entryCriteria, event.detail.index)
    });
};

/**
 * steppedStage reducer function runs validation rules and returns back the updated element state
 */
export const steppedStageItemReducer = (state: SteppedStageItem, event: CustomEvent): SteppedStageItem => {
    switch (event.type) {
        case UpdateConditionEvent.EVENT_NAME:
            return updateEntryCriteria(state, event);
        case DeleteConditionEvent.EVENT_NAME:
            return deleteEntryCriteria(state, event);
        case PropertyChangedEvent.EVENT_NAME:
            return itemPropertyChanged(state, event);
        default:
            return state;
    }
};
