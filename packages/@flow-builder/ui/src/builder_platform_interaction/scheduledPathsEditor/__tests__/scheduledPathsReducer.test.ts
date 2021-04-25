// @ts-nocheck
import { scheduledPathsReducer } from '../scheduledPathsReducer';
import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import { PropertyChangedEvent, DeleteScheduledPathEvent } from 'builder_platform_interaction/events';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { TIME_OPTION } from 'builder_platform_interaction/flowMetadata';

jest.mock('builder_platform_interaction/usedByLib', () => {
    return {
        usedByStoreAndElementState: jest.fn().mockImplementation(() => {
            return [];
        })
    };
});

const mockGuid1 = 'ABC';

const emptyScheduledPath = {
    dataType: { value: 'Boolean', error: null },
    elementType: 'ScheduledPath',
    label: { value: '', error: null },
    guid: mockGuid1,
    name: { value: '', error: null },
    offsetNumber: { value: '', error: null },
    offsetUnit: { value: '', error: null },
    timeSource: { value: '', error: null }
};

const originalState = {
    name: '',
    guid: mockGuid1,
    scheduledPaths: [
        {
            label: { value: 'My scheduled path', error: null },
            apiName: { value: 'My_time_trigger', error: null },
            timeSource: { value: 'ClosedDate', error: null },
            guid: generateGuid(),
            offsetNumber: { value: 2, error: null },
            offsetUnit: { value: TIME_OPTION.HOURS_BEFORE, error: null }
        },
        {
            label: { value: 'My scheduled path_2', error: null },
            apiName: { value: 'My_time_trigger_2', error: null },
            timeSource: { value: 'OpenedDate', error: null },
            guid: generateGuid(),
            offsetNumber: { value: 4, error: null },
            offsetUnit: { value: TIME_OPTION.DAYS_AFTER, error: null }
        }
    ]
};

describe('scheduled-path-reducer', () => {
    beforeEach(() => {
        const storeLib = require('builder_platform_interaction/storeLib');
        storeLib.generateGuid = jest.fn().mockReturnValue(mockGuid1);
    });
    describe('Add a new Scheduled Path', () => {
        it('Should be added to the scheduledPaths array', () => {
            const addScheduledPathAction = new CustomEvent(PROPERTY_EDITOR_ACTION.ADD_START_ELEMENT_SCHEDULED_PATH, {});
            const newState = scheduledPathsReducer(originalState, addScheduledPathAction);
            expect(newState.scheduledPaths).toHaveLength(3);
            expect(newState.scheduledPaths[2]).toMatchObject(emptyScheduledPath);
            expect(newState.scheduledPaths[2].offsetNumber.value).toBe('');
        });
    });
    describe('Remove a scheduled path ', () => {
        it('Should remove the selected scheduled path from scheduledPaths array', () => {
            const deleteScheduledPathAction = {
                type: DeleteScheduledPathEvent.EVENT_NAME,
                detail: {
                    guid: originalState.scheduledPaths[0].guid
                }
            };

            const newState = scheduledPathsReducer(originalState, deleteScheduledPathAction);
            expect(newState.scheduledPaths).toHaveLength(1);
        });
    });
    describe('Modify a scheduled path ', () => {
        it('Modify the timeSource', () => {
            const propertyChangedEvent = new PropertyChangedEvent(
                'timeSource',
                TIME_OPTION.HOURS_AFTER,
                null,
                originalState.scheduledPaths[0].guid,
                TIME_OPTION.HOURS_BEFORE,
                undefined,
                'string'
            );

            const newState = scheduledPathsReducer(originalState, propertyChangedEvent);
            expect(newState.scheduledPaths[0].timeSource.value).toBe(TIME_OPTION.HOURS_AFTER);
            expect(newState.scheduledPaths[1]).toMatchObject(originalState.scheduledPaths[1]);
        });
    });
});
