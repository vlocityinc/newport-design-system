// @ts-nocheck
import { stageStepReducer } from '../stageStepReducer';
import {
    DeleteConditionEvent,
    PropertyChangedEvent,
    UpdateConditionEvent,
    ValueChangedEvent
} from 'builder_platform_interaction/events';
import { createCondition } from 'builder_platform_interaction/elementFactory';
import {
    hydrateWithErrors,
    replaceItem,
    deleteItem,
    updateProperties
} from 'builder_platform_interaction/dataMutationLib';
import { invokeModal } from 'builder_platform_interaction/builderUtils';

import { ACTION_TYPE, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

const mockCondition = {
    a: 1
};

const mockReferencedGuid = 'referencedItemGuid';
let mockReferencingElement;

jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getElementByGuid: jest.fn(() => {
            return mockReferencingElement;
        })
    };
});

jest.mock('builder_platform_interaction/usedByLib', () => {
    return {
        usedBy: jest.fn((guidArray) => {
            return guidArray[0] === mockReferencedGuid ? [{}] : [];
        })
    };
});

jest.mock('builder_platform_interaction/elementFactory', () => {
    const actual = jest.requireActual('builder_platform_interaction/elementFactory');

    return Object.assign({}, actual, {
        createCondition: jest.fn(() => {
            return mockCondition;
        })
    });
});

let mockHydrated;

jest.mock('builder_platform_interaction/dataMutationLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/dataMutationLib');

    return {
        hydrateWithErrors: jest.fn((value) => {
            if (mockHydrated) {
                return mockHydrated;
            }
            return value;
        }),
        updateProperties: jest.fn((state, props) => {
            return actual.updateProperties(state, props);
        }),
        replaceItem: jest.fn((state, props, index) => {
            return actual.replaceItem(state, props, index);
        }),
        deleteItem: jest.fn((state, index) => {
            return actual.deleteItem(state, index);
        }),
        getValueFromHydratedItem: actual.getValueFromHydratedItem
    };
});

jest.mock('builder_platform_interaction/builderUtils', () => {
    return {
        invokeModal: jest.fn()
    };
});

describe('StageStep Reducer', () => {
    beforeEach(() => {
        mockReferencingElement = {
            guid: 'someElement',
            someField: `${mockReferencedGuid}.Outputs`
        };
    });

    let originalState, originalStateWithEntryCriteria;
    beforeEach(() => {
        originalState = {
            guid: 'itemGuid',
            entryConditions: [],
            inputParameters: [{}],
            ouputParameters: [{}]
        };

        originalStateWithEntryCriteria = {
            guid: 'itemGuid',
            entryConditions: ['foo']
        };
    });

    describe('UpdateConditionEvent', () => {
        beforeEach(() => {
            mockHydrated = {
                entryConditions: ['foo']
            };
        });

        afterEach(() => {
            mockHydrated = undefined;
        });

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

            mockHydrated = undefined;
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

    describe('ValueChangedEvent', () => {
        it('updates the action', () => {
            const event = {
                type: ValueChangedEvent.EVENT_NAME,
                detail: {
                    value: {
                        actionName: 'someAction'
                    },
                    error: null
                }
            };

            stageStepReducer(originalState, event);

            expect(updateProperties).toHaveBeenCalledWith(originalState, {
                action: {
                    elementType: ELEMENT_TYPE.ACTION_CALL,
                    actionType: ACTION_TYPE.CREATE_WORK_ITEM,
                    actionName: event.detail.value.actionName
                },
                actionName: event.detail.value.actionName,
                inputParameters: [],
                outputParameters: []
            });
        });

        describe('referenced action.Outputs', () => {
            it('direct reference does not update the action', () => {
                const stateWithReferencedAction = {
                    guid: mockReferencedGuid,
                    action: {
                        actionName: { value: 'originalAction' },
                        actionType: 'createWorkItem',
                        elementType: 'ActionCall'
                    },
                    actionName: { value: 'originalAction' },
                    entryConditions: [],
                    inputParameters: [{}],
                    outputParameters: [{}]
                };

                const event = {
                    type: ValueChangedEvent.EVENT_NAME,
                    detail: {
                        value: {
                            actionName: 'anotherAction'
                        },
                        error: null
                    }
                };

                stageStepReducer(stateWithReferencedAction, event);

                expect(updateProperties).toHaveBeenCalledWith(stateWithReferencedAction, {
                    action: {
                        elementType: ELEMENT_TYPE.ACTION_CALL,
                        actionType: ACTION_TYPE.CREATE_WORK_ITEM,
                        actionName: stateWithReferencedAction.actionName.value
                    },
                    actionName: stateWithReferencedAction.actionName.value
                });
            });

            it('reference in array does not update the action', () => {
                mockReferencingElement = {
                    guid: 'someElement',
                    someField: [{ a: 'foo' }, { a: `${mockReferencedGuid}.Outputs` }]
                };

                const stateWithReferencedAction = {
                    guid: mockReferencedGuid,
                    action: {
                        actionName: { value: 'originalAction' },
                        actionType: 'createWorkItem',
                        elementType: 'ActionCall'
                    },
                    actionName: { value: 'originalAction' },
                    entryConditions: [],
                    inputParameters: [{}],
                    outputParameters: [{}]
                };

                const event = {
                    type: ValueChangedEvent.EVENT_NAME,
                    detail: {
                        value: {
                            actionName: 'anotherAction'
                        },
                        error: null
                    }
                };

                stageStepReducer(stateWithReferencedAction, event);

                expect(updateProperties).toHaveBeenCalledWith(stateWithReferencedAction, {
                    action: {
                        elementType: ELEMENT_TYPE.ACTION_CALL,
                        actionType: ACTION_TYPE.CREATE_WORK_ITEM,
                        actionName: stateWithReferencedAction.actionName.value
                    },
                    actionName: stateWithReferencedAction.actionName.value
                });
            });

            it('shows the warning modal', () => {
                const stateWithReferencedAction = {
                    guid: mockReferencedGuid,
                    action: {
                        actionName: { value: 'anotherAction' },
                        actionType: 'createWorkItem',
                        elementType: 'ActionCall'
                    },
                    actionName: { value: 'anotherAction' }
                };

                const event = {
                    type: ValueChangedEvent.EVENT_NAME,
                    detail: {
                        value: {
                            actionName: 'someAction'
                        },
                        error: null
                    }
                };

                stageStepReducer(stateWithReferencedAction, event);

                expect(invokeModal).toHaveBeenCalled();
            });
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
