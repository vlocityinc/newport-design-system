import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import { FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import { eventDrivenJourneyReducer } from '../eventDrivenJourneyReducer';

const startElement = () => ({
    description: { value: '', error: null },
    elementType: 'START_ELEMENT',
    guid: '326e1b1a-7235-487f-9b44-38db56af4a45',
    isCanvasElement: true,
    label: { value: '', error: null },
    name: { value: '', error: null },
    object: { value: 'Account', error: null },
    triggerType: { value: FLOW_TRIGGER_TYPE.EVENT_DRIVEN_JOURNEY, error: null }
});

describe('PropertyChangedEvent', () => {
    const propertyChangedEvent = new PropertyChangedEvent('object', 'Lead', null);
    it('to return new start object', () => {
        const newState = eventDrivenJourneyReducer(startElement, propertyChangedEvent);
        expect(newState).not.toBe(startElement);
        expect(newState.object.value).toBe('Lead');
    });
});
