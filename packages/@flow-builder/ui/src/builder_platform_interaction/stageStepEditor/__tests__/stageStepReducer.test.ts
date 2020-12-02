// @ts-nocheck
import { stageStepReducer } from '../stageStepReducer';
import { DeleteConditionEvent, PropertyChangedEvent, UpdateConditionEvent } from 'builder_platform_interaction/events';
import { createCondition } from 'builder_platform_interaction/elementFactory';
import {
    hydrateWithErrors,
    replaceItem,
    deleteItem,
    updateProperties
} from 'builder_platform_interaction/dataMutationLib';

const mockCondition = {
    a: 1
};

jest.mock('builder_platform_interaction/elementFactory', () => {
    return {
        createCondition: jest.fn(() => {
            return mockCondition;
        })
    };
});

const mockHydrated = {
    entryConditions: ['foo']
};

jest.mock('builder_platform_interaction/dataMutationLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/dataMutationLib');

    return {
        hydrateWithErrors: jest.fn(() => {
            return mockHydrated;
        }),
        updateProperties: jest.fn((state, props) => {
            return actual.updateProperties(state, props);
        }),
        replaceItem: jest.fn((state, props, index) => {
            return actual.replaceItem(state, props, index);
        }),
        deleteItem: jest.fn((state, index) => {
            return actual.deleteItem(state, index);
        })
    };
});

describe('StageStep Reducer', () => {
    let originalState, originalStateWithEntryCriteria;
    beforeEach(() => {
        originalState = {
            guid: 'itemGuid',
            entryConditions: []
        };

        originalStateWithEntryCriteria = {
            guid: 'itemGuid',
            entryConditions: ['foo']
        };
    });

    describe('UpdateConditionEvent', () => {
        it('replaces null entry criteria with the new criteria', () => {
            const event = {
                type: UpdateConditionEvent.EVENT_NAME,
                detail: {
                    guid: originalState.guid,
                    index: 0,
                    value: 'newValue'
                }
            };

            const newState = stageStepReducer(originalState, event);
            expect(createCondition).toHaveBeenCalledWith(event.detail.value);
            expect(hydrateWithErrors).toHaveBeenCalledWith(mockCondition);

            expect(newState.entryConditions[0]).toEqual(mockHydrated);
            expect(newState).not.toBe(originalStateWithEntryCriteria);
        });
        it('replaces existing entry criteria with the new criteria', () => {
            const event = {
                type: UpdateConditionEvent.EVENT_NAME,
                detail: {
                    parentGUID: originalState.guid,
                    index: 0,
                    value: 'newValue'
                }
            };

            const newState = stageStepReducer(originalStateWithEntryCriteria, event);

            expect(createCondition).toHaveBeenCalledWith(event.detail.value);
            expect(hydrateWithErrors).toHaveBeenCalledWith(mockCondition);
            expect(replaceItem).toHaveBeenCalledWith(originalStateWithEntryCriteria.entryConditions, mockHydrated, 0);

            expect(newState.entryConditions[0]).toEqual(mockHydrated);
            expect(newState).not.toBe(originalStateWithEntryCriteria);
        });
    });

    describe('DeleteConditionEvent', () => {
        it('deleted existing entry criteria', () => {
            const event = {
                type: DeleteConditionEvent.EVENT_NAME,
                detail: {
                    parentGUID: originalState.guid,
                    index: 0
                }
            };

            const newState = stageStepReducer(originalStateWithEntryCriteria, event);

            expect(deleteItem).toHaveBeenCalledWith(originalStateWithEntryCriteria.entryConditions, 0);

            expect(newState.entryConditions[0]).not.toBeDefined();
            expect(newState).not.toBe(originalStateWithEntryCriteria);
        });
    });
    describe('PropertyChangedEvent', () => {
        it('updates the property', () => {
            const event = {
                type: PropertyChangedEvent.EVENT_NAME,
                detail: {
                    propertyName: 'foo',
                    value: 'newValue',
                    error: null
                }
            };

            const newState = stageStepReducer(originalState, event);
            const hydratedValue = {
                value: event.detail.value,
                error: null
            };

            expect(updateProperties).toHaveBeenCalledWith(originalState, {
                [event.detail.propertyName]: hydratedValue
            });

            expect(newState.foo).toEqual(hydratedValue);
            expect(newState).not.toBe(originalStateWithEntryCriteria);
        });
    });
});
