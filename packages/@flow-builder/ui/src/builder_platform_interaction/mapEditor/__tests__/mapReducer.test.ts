import {
    AddRecordFieldAssignmentEvent,
    CollectionReferenceChangedEvent,
    DeleteRecordFieldAssignmentEvent,
    PrepopulateMapItemsEvent,
    UpdateRecordFieldAssignmentEvent
} from 'builder_platform_interaction/events';
import { EXPRESSION_PROPERTY_TYPE } from 'builder_platform_interaction/expressionUtils';
import * as store from 'mock/storeData';
import { accountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { contractFields } from 'serverData/GetFieldsForEntity/contractFields.json';
import { mapReducer } from '../mapReducer';
import { getExpectedMapItems } from './mapEditorTestUtils';

const updateMapItemEvent = (side, newValue = '', newError, index = 0) => ({
    type: UpdateRecordFieldAssignmentEvent.EVENT_NAME,
    detail: {
        index,
        value: { [side]: { value: newValue, error: newError } }
    }
});

describe('map-reducer', () => {
    let originalState;
    beforeEach(() => {
        originalState = {
            collectionReference: { value: store.accountSObjectCollectionVariable.guid, error: null },
            mapItems: [
                {
                    leftHandSide: { value: 'Contract.Description', error: null },
                    rightHandSide: { value: 'This is my description', error: null },
                    rightHandSideDataType: { value: 'String', error: null },
                    operator: { value: 'Assign', error: null },
                    rowIndex: 'MapItem_1'
                }
            ],
            assignNextValueToReference: { value: store.contractSObjectVariable.guid, error: null },
            outputSObjectType: { value: 'Contract', error: null }
        };
    });

    describe('updates properties', () => {
        it('should update input collection', () => {
            const event = {
                type: CollectionReferenceChangedEvent.EVENT_NAME,
                detail: {
                    value: store.caseSObjectCollectionVariable.guid,
                    error: null
                }
            };
            const newState = mapReducer(originalState, event);
            expect(newState.collectionReference.value).toEqual(event.detail.value);
        });
    });
    describe('updates mapItems', () => {
        it('should prepolulate map items', () => {
            const event = {
                type: PrepopulateMapItemsEvent.EVENT_NAME,
                detail: {
                    outputObjectType: 'Contract',
                    outputFields: contractFields,
                    inputObjectType: 'Account',
                    inputFields: accountFields,
                    currentItemGuid: 'currentItem_guid'
                }
            };
            const newState = mapReducer(originalState, event);
            const expectedMapItems = getExpectedMapItems(contractFields, accountFields, event.detail.currentItemGuid);
            expect(newState.mapItems).toHaveLength(expectedMapItems.length);
            newState.mapItems.forEach((mapItem, index) => {
                expect(mapItem.leftHandSide.value).toEqual(expectedMapItems[index].leftHandSide.value);
                expect(mapItem.operator.value).toEqual(expectedMapItems[index].operator.value);
                expect(mapItem.rightHandSide.value).toEqual(expectedMapItems[index].rightHandSide.value);
                expect(mapItem.rightHandSideDataType.value).toEqual(
                    expectedMapItems[index].rightHandSideDataType.value
                );
            });
        });
        it('should add an map item', () => {
            const event = {
                type: AddRecordFieldAssignmentEvent.EVENT_NAME
            };
            const newState = mapReducer(originalState, event);
            expect(newState.mapItems).toHaveLength(2);
            expect(newState).not.toBe(originalState);
        });
        it('delete an map item', () => {
            const event = {
                type: DeleteRecordFieldAssignmentEvent.EVENT_NAME,
                detail: {
                    index: 0
                }
            };
            const newState = mapReducer(originalState, event);
            expect(newState.mapItems).toHaveLength(0);
            expect(newState).not.toBe(originalState);
        });
        it('update lhs', () => {
            const event = updateMapItemEvent(EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE, 'Contract.BankCity', null);
            const newState = mapReducer(originalState, event);
            expect(newState.mapItems).toHaveLength(1);
            expect(newState.mapItems[0].leftHandSide.value).toBe('Contract.BankCity');
            expect(newState).not.toBe(originalState);
        });
        it('update operator', () => {
            const event = updateMapItemEvent(EXPRESSION_PROPERTY_TYPE.OPERATOR, 'Add', null);
            const newState = mapReducer(originalState, event);
            expect(newState.mapItems).toHaveLength(1);
            expect(newState.mapItems[0].operator.value).toBe('Add');
            expect(newState).not.toBe(originalState);
        });
        it('update rhs', () => {
            const event = updateMapItemEvent(EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE, 'Test', null);
            const newState = mapReducer(originalState, event);
            expect(newState.mapItems).toHaveLength(1);
            expect(newState.mapItems[0].rightHandSide.value).toBe('Test');
            expect(newState).not.toBe(originalState);
        });
    });
    describe('errors', () => {
        it('from the input collection', () => {
            const event = {
                type: CollectionReferenceChangedEvent.EVENT_NAME,
                detail: {
                    value: 'invalidCollection',
                    error: 'Entered an invalid value'
                }
            };
            const newState = mapReducer(originalState, event);
            expect(newState.collectionReference.error).toEqual(event.detail.error);
        });
        it('from the lhs', () => {
            const event = updateMapItemEvent(EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE, 'Test', 'Invalid value');
            const newState = mapReducer(originalState, event);
            expect(newState.mapItems[0].leftHandSide.error).toEqual('Invalid value');
        });
        it('from the rhs', () => {
            const event = updateMapItemEvent(EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE, 'Test', 'Invalid value');
            const newState = mapReducer(originalState, event);
            expect(newState.mapItems[0].rightHandSide.error).toEqual('Invalid value');
        });
    });
});
