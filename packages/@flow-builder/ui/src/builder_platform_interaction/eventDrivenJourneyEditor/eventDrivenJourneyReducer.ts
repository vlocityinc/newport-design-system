import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';

const propertyChanged = (state, event) => {
    state = updateProperties(state, {
        [event.detail.propertyName]: {
            error: event.detail.error,
            value: event.detail.value
        }
    });
    return state;
};

export const eventDrivenJourneyReducer = (state, event) => {
    switch (event.type) {
        case PropertyChangedEvent.EVENT_NAME:
            return propertyChanged(state, event);
        default:
            return state;
    }
};
