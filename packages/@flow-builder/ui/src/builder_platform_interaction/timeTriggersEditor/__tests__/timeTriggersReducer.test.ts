// @ts-nocheck
import { timeTriggersReducer } from '../timeTriggersReducer';
import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { TIME_OPTION } from 'builder_platform_interaction/flowMetadata';

jest.mock('builder_platform_interaction/usedByLib', () => {
    return {
        usedByStoreAndElementState: jest.fn().mockImplementation(() => {
            return [];
        })
    };
});

const originalState = {
    name: '',
    guid: '',
    timeTriggers: [
        {
            label: { value: 'My time trigger', error: null },
            apiName: { value: 'My_time_trigger', error: null },
            timeSource: { value: 'ClosedDate', error: null },
            guid: generateGuid(),
            offsetNumber: { value: 2, error: null },
            offsetUnit: { value: TIME_OPTION.HOURS_BEFORE, error: null }
        },
        {
            label: { value: 'My time trigger_2', error: null },
            apiName: { value: 'My_time_trigger_2', error: null },
            timeSource: { value: 'OpenedDate', error: null },
            guid: generateGuid(),
            offsetNumber: { value: 4, error: null },
            offsetUnit: { value: TIME_OPTION.DAYS_AFTER, error: null }
        }
    ]
};

describe('time-trigger-reducer', () => {
    describe('Add a new Time Trigger', () => {
        it('Should be added to the timeTriggers array', () => {
            const addTimeTriggerAction = new CustomEvent(PROPERTY_EDITOR_ACTION.ADD_START_ELEMENT_TIME_TRIGGER, {});
            const newState = timeTriggersReducer(originalState, addTimeTriggerAction);
            expect(newState.timeTriggers).toHaveLength(3);
        });
    });
    describe('Remove a time trigger ', () => {
        it('Should remove the selected time trigger from timeTriggers array', () => {
            const deleteTimeTriggerAction = {
                type: PROPERTY_EDITOR_ACTION.DELETE_START_ELEMENT_TIME_TRIGGER,
                detail: {
                    guid: originalState.timeTriggers[0].guid
                }
            };

            const newState = timeTriggersReducer(originalState, deleteTimeTriggerAction);
            expect(newState.timeTriggers).toHaveLength(1);
        });
    });
    describe('Modify a time trigger ', () => {
        it('Modify the timeSource', () => {
            const propertyChangedEvent = new PropertyChangedEvent(
                'timeSource',
                TIME_OPTION.HOURS_AFTER,
                null,
                originalState.timeTriggers[0].guid,
                TIME_OPTION.HOURS_BEFORE,
                undefined,
                'string'
            );

            const newState = timeTriggersReducer(originalState, propertyChangedEvent);
            expect(newState.timeTriggers[0].timeSource.value).toBe(TIME_OPTION.HOURS_AFTER);
            expect(newState.timeTriggers[1]).toMatchObject(originalState.timeTriggers[1]);
        });
    });
});
