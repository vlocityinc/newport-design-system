import { filterReducer } from '../filterReducer';
import {
    CollectionReferenceChangedEvent,
    AddConditionEvent,
    DeleteConditionEvent,
    UpdateConditionEvent,
    PropertyChangedEvent
} from 'builder_platform_interaction/events';

import * as store from 'mock/storeData';
import { EXPRESSION_PROPERTY_TYPE } from 'builder_platform_interaction/expressionUtils';
import { CONDITION_LOGIC } from 'builder_platform_interaction/flowMetadata';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { Store } from 'builder_platform_interaction/storeLib';

/**
 * Executing jest test
 * cd into /packages/@flow-builder/ui
 * yarn jest src/builder_platform_interaction/filterEditor/__tests__/filterReducer.test.ts
 */
jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

describe('filter reducer test', () => {
    beforeAll(() => {
        // @ts-ignore
        Store.setMockState(flowWithAllElementsUIModel);
    });

    afterAll(() => {
        // @ts-ignore
        Store.resetStore();
    });
    let originalState;
    beforeEach(() => {
        originalState = {
            collectionReference: {
                value: store.accountSObjectCollectionVariable.guid,
                error: null
            },
            conditions: [
                {
                    leftHandSide: { value: 'Account.Name', error: null },
                    rightHandSide: { value: 'Mike', error: null },
                    rightHandSideDataType: { value: 'String', error: null },
                    operator: { value: 'Contains', error: null },
                    rowIndex: '72cb7e19-9f98-4b59-9fdd-a276f216ddcf'
                }
            ],
            assignNextValueToReference: {
                value: store.accountSObjectCollectionVariable.guid,
                error: null
            },
            conditionLogic: { value: 'or', error: null },
            formula: { value: '', error: null }
        };
    });

    describe('update properties', () => {
        it('should update input collection', () => {
            const event = {
                type: CollectionReferenceChangedEvent.EVENT_NAME,
                detail: {
                    value: store.caseSObjectCollectionVariable.guid,
                    error: null
                }
            };
            const newState = filterReducer(originalState, event);
            expect(newState.collectionReference.value).toEqual(event.detail.value);
        });

        it('should update filter condition logic', () => {
            const event = {
                type: PropertyChangedEvent.EVENT_NAME,
                detail: {
                    propertyName: 'conditionLogic',
                    value: 'and',
                    error: null
                }
            };
            const newState = filterReducer(originalState, event);
            expect(newState.conditionLogic.value).toEqual(CONDITION_LOGIC.AND);
        });

        it('should reset filter condition on input reference change', () => {
            const event = {
                type: CollectionReferenceChangedEvent.EVENT_NAME,
                detail: {
                    value: store.caseSObjectCollectionVariable.guid,
                    error: null
                }
            };
            const newState = filterReducer(originalState, event);
            expect(newState.conditionLogic.value).toEqual(CONDITION_LOGIC.AND);
        });
    });

    describe('update filter item', () => {
        it('should add a new filter item row', () => {
            const event = {
                type: AddConditionEvent.EVENT_NAME
            };
            const newState = filterReducer(originalState, event);
            expect(newState.conditions).toHaveLength(2);
            expect(newState).not.toBe(originalState);
        });

        it('should delete a filter item row', () => {
            const event = {
                type: DeleteConditionEvent.EVENT_NAME,
                detail: {
                    index: 0
                }
            };
            const newState = filterReducer(originalState, event);
            expect(newState.conditions).toHaveLength(0);
            expect(newState).not.toBe(originalState);
        });

        it('should update LHS of a filter item', () => {
            const event = {
                type: UpdateConditionEvent.EVENT_NAME,
                detail: {
                    index: 0,
                    value: {
                        [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {
                            value: 'Account.AccountNumber',
                            error: null
                        }
                    }
                }
            };
            const newState = filterReducer(originalState, event);
            expect(newState.conditions).toHaveLength(1);
            expect(newState.conditions[0].leftHandSide.value).toBe('Account.AccountNumber');
            expect(newState).not.toBe(originalState);
        });

        it('should update operator', () => {
            const event = {
                type: UpdateConditionEvent.EVENT_NAME,
                detail: {
                    index: 0,
                    value: {
                        [EXPRESSION_PROPERTY_TYPE.OPERATOR]: {
                            value: 'or',
                            error: null
                        }
                    }
                }
            };
            const newState = filterReducer(originalState, event);
            expect(newState.conditions).toHaveLength(1);
            expect(newState.conditions[0].operator.value).toBe('or');
            expect(newState).not.toBe(originalState);
        });

        it('should update RHS', () => {
            const event = {
                type: UpdateConditionEvent.EVENT_NAME,
                detail: {
                    index: 0,
                    value: {
                        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {
                            value: 'test',
                            error: null
                        }
                    }
                }
            };
            const newState = filterReducer(originalState, event);
            expect(newState.conditions).toHaveLength(1);
            expect(newState.conditions[0].rightHandSide.value).toBe('test');
            expect(newState).not.toBe(originalState);
        });
    });

    describe('handle errors', () => {
        it('should handle input collection error', () => {
            const event = {
                type: CollectionReferenceChangedEvent.EVENT_NAME,
                detail: {
                    value: 'invalidCollection',
                    error: 'Input collection error'
                }
            };
            const newState = filterReducer(originalState, event);
            expect(newState.collectionReference.error).toEqual(event.detail.error);
        });

        it('should handle LHS error', () => {
            const event = {
                type: UpdateConditionEvent.EVENT_NAME,
                detail: {
                    index: 0,
                    value: {
                        [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: {
                            value: 'invalidLhsValue',
                            error: 'LHS error'
                        }
                    }
                }
            };
            const newState = filterReducer(originalState, event);
            expect(newState.conditions[0].leftHandSide.error).toEqual('LHS error');
        });

        it('should handle RHS error', () => {
            const event = {
                type: UpdateConditionEvent.EVENT_NAME,
                detail: {
                    index: 0,
                    value: {
                        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: {
                            value: 'invalidRhsValue',
                            error: 'RHS error'
                        }
                    }
                }
            };
            const newState = filterReducer(originalState, event);
            expect(newState.conditions[0].rightHandSide.error).toEqual('RHS error');
        });
    });
});
