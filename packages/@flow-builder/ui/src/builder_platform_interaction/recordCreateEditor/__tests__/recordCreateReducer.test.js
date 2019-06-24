import { recordCreateReducer } from '../recordCreateReducer';
import {
    AddRecordFieldAssignmentEvent,
    DeleteRecordFieldAssignmentEvent,
    PropertyChangedEvent,
    RecordStoreOptionChangedEvent,
    UpdateRecordFieldAssignmentEvent
} from 'builder_platform_interaction/events';
import { EXPRESSION_PROPERTY_TYPE } from 'builder_platform_interaction/expressionUtils';
import { WAY_TO_STORE_FIELDS } from 'builder_platform_interaction/recordEditorLib';

const recordCreateUsingFieldsTemplate = () => ({
    assignRecordIdToReference: { value: 'varToStoreId', error: null },
    description: { value: '', error: null },
    elementType: 'RECORD_CREATE',
    getFirstRecordOnly: true,
    guid: 'RECORDCREATE_2',
    inputAssignments: [
        {
            leftHandSide: { value: 'Account.BillingCountry', error: null },
            rightHandSide: { value: 'myCountry', error: null },
            rightHandSideDataType: { value: 'String', error: null },
            rightHandSideGuid: { value: 'myCountry', error: null },
            rowIndex: '724cafc2-7744-4e46-8eaa-f2df29539d1d'
        }
    ],
    isCanvasElement: true,
    label: { value: 'testRecordFields', error: null },
    locationX: 358,
    locationY: 227,
    name: { value: 'testRecordFields', error: null },
    object: { value: 'account', error: null }
});

const recordCreateUsingSobjectTemplate = () => ({
    assignRecordIdToReference: { value: '', error: null },
    description: { value: '', error: null },
    elementType: 'RECORD_CREATE',
    getFirstRecordOnly: true,
    guid: 'RECORDCREATE_2',
    inputReference: { value: 'VARIABLE_6', error: null },
    isCanvasElement: true,
    label: { value: 'testRecordFields', error: null },
    locationX: 358,
    locationY: 227,
    name: { value: 'testRecordFields', error: null },
    processMetadataValues: []
});

const recordCreateUsingSobjectCollectionTemplate = () => ({
    assignRecordIdToReference: { value: '', error: null },
    description: { value: '', error: null },
    elementType: 'RECORD_CREATE',
    getFirstRecordOnly: false,
    guid: 'RECORDCREATE_2',
    inputReference: { value: 'VARIABLE_Collection_6', error: null },
    isCanvasElement: true,
    label: { value: 'testRecordCollection', error: null },
    locationX: 358,
    locationY: 227,
    name: { value: 'testRecordCollection', error: null },
    processMetadataValues: []
});

const updateAssignmentEvent = (side, newValue = '', index = 0) => ({
    type: UpdateRecordFieldAssignmentEvent.EVENT_NAME,
    detail: {
        index,
        value: { [side]: { value: newValue, error: null } }
    }
});

describe('record-create-reducer using sObject', () => {
    let originalState;
    beforeEach(() => {
        originalState = recordCreateUsingSobjectTemplate();
    });
    describe('update property action', () => {
        it('updates the inputReference property', () => {
            const propertyName = 'inputReference';
            const value = 'VARIABLE_33';
            const error = null;
            const propChangedEvent = new PropertyChangedEvent(
                propertyName,
                value,
                error,
                null,
                originalState.inputReference.value
            );
            propChangedEvent.detail.ignoreValidate = true;
            const newState = recordCreateReducer(
                originalState,
                propChangedEvent
            );
            expect(newState).not.toBe(originalState);
            expect(newState.inputReference.value).toEqual('VARIABLE_33');
            expect(newState.inputReference.error).toBe(null);
        });
        it('fetch the error from the action instead of rerunning validation', () => {
            const propertyName = 'inputReference';
            const value = 'notValidSobject';
            const error = 'You have entered an invalid value.';
            const propChangedEvent = new PropertyChangedEvent(
                propertyName,
                value,
                error,
                null,
                originalState.inputReference.value
            );
            propChangedEvent.detail.ignoreValidate = true;
            const newState = recordCreateReducer(
                originalState,
                propChangedEvent
            );
            expect(newState).not.toBe(originalState);
            expect(newState.inputReference.value).toEqual(value);
            expect(newState.inputReference.error).toBe(error);
        });
    });
    it('ignores unknown events', () => {
        const event = {
            type: 'unknown event',
            detail: {
                propertyName: 'label',
                value: 'newlabel',
                error: null
            }
        };
        const resultObj = recordCreateReducer(originalState, event);
        expect(resultObj).toBe(originalState);
    });
});
describe('record-create-reducer using fields', () => {
    let originalState;
    beforeEach(() => {
        originalState = recordCreateUsingFieldsTemplate();
    });
    describe('update property action', () => {
        it('updates the object property', () => {
            const propertyName = 'object';
            const value = 'USER';
            const error = null;
            const propChangedEvent = new PropertyChangedEvent(
                propertyName,
                value,
                error,
                null,
                originalState.object.value
            );
            propChangedEvent.detail.ignoreValidate = true;
            const newState = recordCreateReducer(
                originalState,
                propChangedEvent
            );
            expect(newState).not.toBe(originalState);
            expect(newState.object.value).toEqual('USER');
            expect(newState.object.error).toBe(null);
        });
        it('not a valid Object : fetch the error from the action instead of rerunning validation', () => {
            const propertyName = 'object';
            const value = 'notValidSobject';
            const error = 'You have entered an invalid value.';
            const propChangedEvent = new PropertyChangedEvent(
                propertyName,
                value,
                error,
                null,
                originalState.object.value
            );
            propChangedEvent.detail.ignoreValidate = true;
            const newState = recordCreateReducer(
                originalState,
                propChangedEvent
            );
            expect(newState).not.toBe(originalState);
            expect(newState.object.value).toEqual(value);
            expect(newState.object.error).toBe(error);
        });
    });
    describe('handle list item events', () => {
        it('add an assignment item', () => {
            const event = {
                type: AddRecordFieldAssignmentEvent.EVENT_NAME
            };
            const newState = recordCreateReducer(originalState, event);
            expect(newState.inputAssignments).toHaveLength(2);
            expect(newState).not.toBe(originalState);
        });
        it('delete an assignment item', () => {
            const event = {
                type: DeleteRecordFieldAssignmentEvent.EVENT_NAME,
                detail: {
                    index: 0
                }
            };
            const newState = recordCreateReducer(originalState, event);
            expect(newState.inputAssignments).toHaveLength(0);
            expect(newState).not.toBe(originalState);
        });
        it('update the left hand side of an assignment item', () => {
            const event = updateAssignmentEvent(
                EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE,
                'Account.Description'
            );
            const newState = recordCreateReducer(originalState, event);
            expect(newState.inputAssignments).toHaveLength(1);
            expect(newState.inputAssignments[0].leftHandSide.value).toBe(
                'Account.Description'
            );
            expect(newState).not.toBe(originalState);
        });
        describe('update the left hand side of an assignment item', () => {
            it('with an empty value when the right hand side has a value', () => {
                const event = updateAssignmentEvent(
                    EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE
                );
                const newState = recordCreateReducer(originalState, event);
                expect(newState.inputAssignments).toHaveLength(1);
                expect(newState.inputAssignments[0].leftHandSide.value).toBe(
                    'Account.BillingCountry'
                );
                expect(newState).not.toBe(originalState);
            });
            it('with an empty value when the right hand side does not have a value', () => {
                // Remove Right Hand Side value first
                let event = updateAssignmentEvent(
                    EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE
                );
                let newState = recordCreateReducer(originalState, event);

                // Remove Left Hand Side after
                event = updateAssignmentEvent(
                    EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE
                );
                newState = recordCreateReducer(newState, event);
                expect(newState.inputAssignments).toHaveLength(1);
                expect(newState.inputAssignments[0].leftHandSide.value).toBe(
                    ''
                );
                expect(newState).not.toBe(originalState);
            });
        });
    });
    describe('numberRecordsToStore', () => {
        describe('update numberRecordsToStore from All Records to First Record', () => {
            let newState;
            beforeAll(() => {
                originalState = recordCreateUsingSobjectCollectionTemplate();
                const recordStoreOptionChangedEvent = new RecordStoreOptionChangedEvent(
                    true,
                    '',
                    false
                );
                newState = recordCreateReducer(
                    originalState,
                    recordStoreOptionChangedEvent
                );
            });
            it('should reset object', () => {
                expect(newState.object.value).toBe('');
            });
            it('should reset inputAssignments', () => {
                expect(newState.inputAssignments).toHaveLength(1);
                expect(newState.inputAssignments[0].leftHandSide.value).toBe(
                    ''
                );
            });
        });
        describe('update numberRecordsToStore from First Record to All Records', () => {
            let newState;
            beforeAll(() => {
                originalState = recordCreateUsingSobjectTemplate();
                const recordStoreOptionChangedEvent = new RecordStoreOptionChangedEvent(
                    false,
                    '',
                    false
                );
                newState = recordCreateReducer(
                    originalState,
                    recordStoreOptionChangedEvent
                );
            });
            it('should reset inputReference', () => {
                expect(newState.inputReference.value).toBe('');
            });
        });
    });
    describe('wayToStoreFields', () => {
        describe('update wayToStoreFields from SOBJECT_VARIABLE to SEPARATE_VARIABLES', () => {
            let newState;
            beforeAll(() => {
                originalState = recordCreateUsingSobjectTemplate();
                const recordStoreOptionChangedEvent = new RecordStoreOptionChangedEvent(
                    true,
                    WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES,
                    false
                );
                newState = recordCreateReducer(
                    originalState,
                    recordStoreOptionChangedEvent
                );
            });
            it('should reset inputReference', () => {
                expect(newState.inputReference).toEqual({
                    value: '',
                    error: null
                });
            });
            it('should reset assignRecordIdToReference', () => {
                expect(newState.assignRecordIdToReference).toEqual({
                    value: '',
                    error: null
                });
            });
            it('should reset inputAssignments', () => {
                expect(newState.inputAssignments).toEqual([
                    {
                        leftHandSide: { error: null, value: '' },
                        rightHandSide: { error: null, value: '' },
                        rightHandSideDataType: { error: null, value: '' },
                        rowIndex: expect.any(String)
                    }
                ]);
            });
        });
        describe('update wayToStoreFields from SEPARATE_VARIABLES to SOBJECT_VARIABLE', () => {
            let newState;
            beforeAll(() => {
                originalState = recordCreateUsingFieldsTemplate();
                const recordStoreOptionChangedEvent = new RecordStoreOptionChangedEvent(
                    true,
                    WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE,
                    false
                );
                newState = recordCreateReducer(
                    originalState,
                    recordStoreOptionChangedEvent
                );
            });
            it('should reset inputReference', () => {
                expect(newState.inputReference).toEqual({
                    value: '',
                    error: null
                });
            });
            it('should reset assignRecordIdToReference', () => {
                expect(newState.assignRecordIdToReference).toEqual({
                    value: '',
                    error: null
                });
            });
            it('should reset inputAssignments', () => {
                expect(newState.inputAssignments).toEqual([
                    {
                        leftHandSide: { error: null, value: '' },
                        rightHandSide: { error: null, value: '' },
                        rightHandSideDataType: { error: null, value: '' },
                        rowIndex: expect.any(String)
                    }
                ]);
            });
        });
    });
});
